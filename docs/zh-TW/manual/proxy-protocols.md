---
title: "代理協定"
---

::: info
來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/proxy-protocols.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
:::

<div v-pre lang="zh-TW">

# 代理協定

> **注意**：dae 目前支援下列代理協定

- [x] HTTP(S)、naiveproxy
  ```
  https://[[user:]pass@]hostname:port/
  ```
- [x] Socks
  - [x] Socks4
  - [x] Socks4a
  - [x] Socks5

  ```
  socks4://[[user:]pass@]hostname:port/
  socks5://[[user:]pass@]hostname:port/
  ```

- [x] VMess(AEAD, alterID=0) / VLESS
  - [x] TCP
  - [x] WS
  - [x] TLS
    - [x] Reality
  - [x] gRPC
  - [x] Meek
  - [x] HTTPUpgrade

  [v2rayN URI 格式](https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2))

  [DuckSoft URI 格式](https://github.com/XTLS/Xray-core/discussions/716)

- [x] Shadowsocks
  - [x] AEAD Ciphers
  - [x] Stream Ciphers
  - [x] simple-obfs
  - [x] shadow-tls (SIP003 plugin)
  - [ ] v2ray-plugin
    - [x] Websocket (+TLS)

  ShadowTLS v3 連結也可直接搭配 `shadowtls://` 使用。
  若節點需要類似瀏覽器的 TLS 指紋，請設定 `global.tls_implementation: utls`，
  並將 `global.utls_imitate` 保持為預設的 `chrome_auto`，或在連結查詢字串附加
  `tlsImplementation=utls&utlsImitate=chrome`。若供應商預期不使用自訂 SNI，請省略 `sni` 或明確將其保留為空值。

  [SIP002](https://shadowsocks.org/doc/sip002.html)

  [SIP008](https://shadowsocks.org/doc/sip008.html)

- [x] ShadowsocksR

- [x] Trojan
  - [x] Trojan-gfw
  - [x] Trojan-go

  [trojan/trojan-go URI 格式](https://p4gefau1t.github.io/trojan-go/developer/url/)

- [x] Tuic (v5)

  [Tuic URI 格式](https://github.com/daeuniverse/dae/discussions/182)

- [x] Juicity

  [Juicity URI 格式](https://github.com/juicity/juicity?tab=readme-ov-file#link-format)

- [x] Hysteria2

  [Hysteria2 URI 格式](https://v2.hysteria.network/docs/developers/URI-Scheme)

- [x] AnyTLS

  [AnyTLS URI 格式](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md)

- [x] 代理鏈（彈性協定）

  [Proxy chain URI 格式](https://github.com/daeuniverse/dae/discussions/236)

若有其他需求，可透過外部代理程式擴充協定支援。以下是使用外部 naiveproxy 的範例。

雖然 dae 與其他代理程式支援 HTTPS 協定，但使用它們不會使用 chromium 網路堆疊，會削弱 naiveproxy 的偽裝效果。因此建議使用外部 naiveproxy 程式。

1. 啟動 naiveproxy：

   此範例使用 naiveproxy 開啟 HTTP 監聽連接埠。請注意，HTTP 代理不支援代理 UDP 流量，因此若使用外部代理程式，建議優先使用 socks5 連接埠。

   ```bash
   naiveproxy --listen=http://127.0.0.1:1090 --proxy=https://yourlink
   ```

2. 在 dae 設定中與節點相關的區段新增下列一行：`http://127.0.0.1:1090`，並記得在所使用的群組中使用此節點。

3. 若已繫結 WAN 介面，也就是填寫了 `global.wan_interface` 欄位，請務必在 routing 區段開頭附近加入下列一行，以避免流量經過 naiveproxy 後回流至 dae 而形成迴圈：

   ```shell
   pname(naiveproxy) -> must_direct
   ```

   此處的 `pname` 指處理程序名稱。可查看啟動 naiveproxy 所用的命令、在程式運作時執行 `ps -ef` 命令，或觀察 dae 日誌，以判斷 naiveproxy 的處理程序名稱。`must_direct` 的含義是讓包含 DNS 查詢在內的所有流量直接通過，而不重新導向至 dae。

   僅繫結 LAN 介面的使用者不需要執行此步驟。

</div>
