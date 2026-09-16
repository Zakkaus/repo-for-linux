---
title: "DNS"
---

<div v-pre lang="zh-CN">

# DNS

dae 会拦截所有发往 53 端口的 UDP 流量并嗅探 DNS。以下给出 DNS 配置的一些示例和模板。

## DNS 地址格式

DoH3

```
h3://<host>:<port>/<path>
http3://<host>:<port>/<path>

default port: 443
default path: /dns-query
```

DoH

```
https://<host>:<port>/<path>

default port: 443
default path: /dns-query
```

DoT

```
tls://<host>:<port>

default port: 853
```

DoQ

```
quic://<host>:<port>

default port: 853
```

UDP
  
```
udp://<host>:<port>

default port: 53
```

TCP

```
tcp://<host>:<port>

default port: 53
```

TCP 和 UDP

```
tcp+udp://<host>:<port>

default port: 53
```

当响应被截断（`TC=1`，RFC 1035 §4.2.1）时，会按 RFC 7766 §5 的要求通过 TCP 重试：`udp://` 上游会通过 TCP 重试该查询，`tcp+udp://` 上游原本就有此行为。内置目标 `asis` 不会重试，而是将目标服务器的响应原样传给客户端，由客户端决定是否重试，与请求不经过 dae 时一致。其他协议仍使用各自指定的传输方式。

## 示例

::: details 完整参考示例

```shell
dns {
    # For example, if ipversion_prefer is 4 and the domain name has both type A and type AAAA records, the dae will only
    # respond to type A queries and response empty answer to type AAAA queries.
    ipversion_prefer: 4

    # Give a fixed ttl for domains. Zero means that dae will request to upstream every time and not cache DNS results
    # for these domains.
    fixed_domain_ttl {
        ddns.example.org: 10
        test.example.org: 3600
    }

    # Bind to local address to listen for DNS queries
    #bind: '127.0.0.1:5353'

    upstream {
        # Scheme list: tcp, udp, tcp+udp, https, tls, http3, h3, quic, details see above Schema.
        # If host is a domain and has both IPv4 and IPv6 record, dae will automatically choose
        # IPv4 or IPv6 to use according to group policy (such as min latency policy).
        # Please make sure DNS traffic will go through and be forwarded by dae, which is REQUIRED for domain routing.
        # If dial_mode is "ip", the upstream DNS answer SHOULD NOT be polluted, so domestic public DNS is not recommended.

        alidns: 'udp://dns.alidns.com:53'
        googledns: 'tcp+udp://dns.google:53'

        # alih3: 'h3://dns.alidns.com:443'
        # alih3_path: 'h3://dns.alidns.com:443/dns-query'
        # alihttp3: 'http3://dns.alidns.com:443'
        # alihttp3_path: 'http3://dns.alidns.com:443/dns-query'
        # ali_quic: 'quic://dns.alidns.com:853'

        # h3_custom_path: 'h3://dns.example.com:443/custom-path'
        # http3_custom_path: 'http3://dns.example.com:443/custom-path'

        # ali_doh: 'https://dns.alidns.com:443'
        # ali_dot: 'tls://dns.alidns.com:853'

        # doh_custom_path: 'https://dns.example.com:443/custom-path'
    }
    # The routing format of 'request' and 'response' is similar with section 'routing'.
    # See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md
    routing {
        # According to the request of dns query, decide to use which DNS upstream.
        # Match rules from top to bottom.
        request {
            # Built-in outbounds in 'request': asis, reject.
            # asis queries the server the request was addressed to, as the request arrived.
            # Do not point other LAN devices at dae:53 (loop risk).
            # You can also use user-defined upstreams.

            # Available functions for ordinary DNS requests: qname, qtype.
            # Additional internal dae selectors in the same block: sub, node, subnode.
            # - sub(): subscription fetch requests
            # - node(): node host resolution requests
            # - subnode(): node host resolution requests for subscription-derived nodes
            #   and it is checked before node()
            # Internal selectors:
            # - only affect dae's own DNS lookups
            # - must target names defined in dns.upstream
            # - do not use fallback
            # - cannot be mixed with qname/qtype in the same rule

            # DNS request name (omit suffix dot '.').
            qname(geosite:category-ads-all) -> reject
            qname(geosite:google@cn) -> alidns # Also see: https://github.com/v2fly/domain-list-community#attributes
            qname(suffix: abc.com, keyword: google) -> googledns
            qname(full: ok.com, regex: '^yes') -> googledns
            # DNS request type
            qtype(a, aaaa) -> alidns
            qtype(cname) -> googledns
            # disable ECH to avoid affecting traffic split
            qtype(https) -> reject

            # Route dae's own subscription fetch DNS to googledns.
            # sub(my_sub) -> googledns
            # Route all nodes with "hk" in their name to googledns.
            # node(name_keyword: hk) -> googledns
            # Use alidns for nodes from subscription "my_sub" before node() rules are checked.
            # subnode(subtag: my_sub) -> alidns

            # If no match, fallback to this upstream.
            fallback: asis
        }
        # According to the response of dns query, decide to accept or re-lookup using another DNS upstream.
        # Match rules from top to bottom.
        response {
            # Built-in outbounds in 'response': accept, reject.
            # You can use user-defined upstreams.

            # Available functions: qname, qtype, upstream, ip.
            # Accept the response if the request is sent to upstream 'googledns'. This is useful to avoid loop.
            upstream(googledns) -> accept
            # If DNS request name is not in CN and response answers include private IP, which is most likely polluted
            # in China mainland. Therefore, resend DNS request to 'googledns' to get correct result.
            ip(geoip:private) && !qname(geosite:cn) -> googledns
            fallback: accept
        }
    }

}
```

:::

## 引导解析器（`global`）

`global.bootstrap_resolver` 仅用于 dae 自身的 DNS 路由可用前就必须完成的查询：解析 DNS 上游的主机名，以及 `dial_mode: real-domain` 探测。未设置时，dae 依次尝试 `119.29.29.29:53` 和 `223.5.5.5:53`；设置后只使用指定的解析器，完全替代这两个默认值。中国大陆以外的主机通常应选择距离更近的解析器：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 模板

根据所需的 DNS 行为选择一种模板。

::: code-group

```shell [按域名分流]
# Use alidns for China mainland domains and googledns for others.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    # According to the request of dns query, decide to use which DNS upstream.
    # Match rules from top to bottom.
    request {
      # Lookup China mainland domains using alidns, otherwise googledns.
      qname(geosite:cn) -> alidns
      # fallback is also called default.
      fallback: googledns
    }
  }
}
```

```shell [污染响应重新查询]
# Use alidns for all DNS queries and fallback to googledns if pollution result detected.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    # According to the request of dns query, decide to use which DNS upstream.
    # Match rules from top to bottom.
    request {
      # fallback is also called default.
      fallback: alidns
    }
    # According to the response of dns query, decide to accept or re-lookup using another DNS upstream.
    # Match rules from top to bottom.
    response {
      # Trusted upstream. Always accept its result.
      upstream(googledns) -> accept
      # Possibly polluted, re-lookup using googledns.
      ip(geoip:private) && !qname(geosite:cn) -> googledns
      # fallback is also called default.
      fallback: accept
    }
  }
}
```

:::

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/configuration/dns.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
