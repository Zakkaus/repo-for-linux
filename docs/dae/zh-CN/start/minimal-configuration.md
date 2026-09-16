<div v-pre lang="zh-CN">

<!-- quick-start-minimal-configuration:start -->
# 最小配置

使用此示例前，请设置网络接口并填写订阅链接。`geoip` 和 `geosite` 规则需要对应的数据文件，参见[运行时依赖](/zh-CN/dae/user-guide/build-by-yourself#运行时依赖)。

```shell
global {
  # Bind to LAN and/or WAN as you want. Replace the interface name to your own.
  #lan_interface: docker0
  wan_interface: auto # Use "auto" to auto detect WAN interface.

  log_level: info
  allow_insecure: false
  auto_config_kernel_parameter: true
}

subscription {
  # Fill in your subscription links here.
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/dns.md for full examples.
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    request {
      qtype(https) -> reject
      fallback: alidns
    }
    response {
      upstream(googledns) -> accept
      ip(geoip:private) && !qname(geosite:cn) -> googledns
      fallback: accept
    }
  }
}

group {
  proxy {
    #filter: name(keyword: HK, keyword: SG)
    policy: min_moving_avg
  }
}

# See https://github.com/daeuniverse/dae/blob/main/docs/en/configuration/routing.md for full examples.
routing {
  pname(NetworkManager) -> direct
  dip(224.0.0.0/3, 'ff00::/8') -> direct

  ### Write your rules below.

  # Disable h3 because it usually consumes too much cpu/mem resources.
  l4proto(udp) && dport(443) -> block
  dip(geoip:private) -> direct
  dip(geoip:cn) -> direct
  domain(geosite:cn) -> direct

  fallback: proxy
}
```

如果你更关注隐私和 DNS 泄漏，而非极致速度，请将上面的 `dns` 部分替换为：

```shell
dns {
  upstream {
    googledns: 'tcp+udp://dns.google:53'
    alidns: 'udp://dns.alidns.com:53'
  }
  routing {
    request {
      qname(geosite:cn) -> alidns
      fallback: googledns
    }
  }
}
```

::: details 最小可启动配置

以下最小可启动配置会使 dae 处于无负载状态。

```shell
global{}
routing{}
```

:::

更多内容参见 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

如果使用 PVE，请参见 [#37](https://github.com/daeuniverse/dae/discussions/37)。
<!-- quick-start-minimal-configuration:end -->

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
