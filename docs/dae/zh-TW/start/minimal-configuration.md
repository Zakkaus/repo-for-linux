<div v-pre lang="zh-TW">

<!-- quick-start-minimal-configuration:start -->
# 最小設定

使用此範例前，請設定網路介面並填入訂閱連結。`geoip` 和 `geosite` 規則需要對應的資料檔案，請參閱[執行階段相依套件](/zh-TW/dae/user-guide/build-by-yourself#執行階段相依套件)。

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

若不追求極致速度，而更重視隱私與避免 DNS 洩漏，請將上方的 `dns` 區段替換為：

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

::: details 最小可啟動設定

以下最小可啟動設定會使 dae 處於無負載狀態。

```shell
global{}
routing{}
```

:::

更多內容請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

若使用 PVE，請參閱 [#37](https://github.com/daeuniverse/dae/discussions/37)。
<!-- quick-start-minimal-configuration:end -->

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
