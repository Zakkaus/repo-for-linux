---
title: DNS 与保留地址
---

# DNS 与保留地址

## dae 作为 DNS 服务器

dae 默认透明拦截所有发往 UDP 53 端口的流量并嗅探 DNS。设置 `dns.bind`（例如 `'127.0.0.1:5353'`）后，dae 还可主动监听 DNS 查询。内置出站 `asis` 会向原请求的目的地址查询。使用 `asis` 时，不要让局域网设备将 `dae:53` 作为 DNS 服务器，否则查询可能形成循环。

`udp://` 或 `tcp+udp://` 上游收到截断响应（`TC=1`）后，会通过 TCP 重试。`asis` 则原样转发响应，由客户端决定是否重试。其他协议方案仍使用其声明的传输方式。

`global.bootstrap_resolver` 只处理 dae 自身 DNS 路由就绪前所需的查询：解析 DNS 上游主机名，以及供 `dial_mode: real-domain` 探测使用。未设置时，dae 先使用 `119.29.29.29:53`，再使用 `223.5.5.5:53`。设置该选项会替换这两个默认值，上游示例如下：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 保留地址默认直连

随附的 `example.dae` 与上游最小配置都包含以下规则，让发往保留地址的流量直连。内置集合 `geoip:private` 包含 RFC 1918 私有地址、环回地址和链路本地地址等。

```shell
dip(geoip:private) -> direct
```

这是随附配置的默认行为，不是 eBPF 数据面或控制平面中硬编码的排除逻辑。删除这条规则后，这些地址便不再保证直连，流量会按其余路由规则处理，可能进入代理。

详细设置请参阅 [DNS 配置](/zh-CN/dae/configuration/dns)与[路由配置](/zh-CN/dae/configuration/routing)。
