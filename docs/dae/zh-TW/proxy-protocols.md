---
title: "代理協定"
---

<div v-pre lang="zh-TW">

# 代理協定

> **注意**：dae 目前支援下列代理協定

| 協定 | 支援細節 | URI 格式 |
| --- | --- | --- |
| HTTP(S)、naiveproxy | — | [HTTP(S)](#http-uri) |
| Socks | **版本**: Socks4 / Socks4a / Socks5 | [Socks](#socks-uri) |
| VMess / VLESS | **VMess**: AEAD, alterID=0<br>**傳輸**: TCP / WS / gRPC / Meek / HTTPUpgrade<br>**TLS**: Reality | [v2rayN](https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2))<br>[DuckSoft](https://github.com/XTLS/Xray-core/discussions/716) |
| Shadowsocks | **加密**: AEAD / Stream Ciphers<br>**插件**: simple-obfs / shadow-tls (SIP003)<br>[插件說明](#shadowsocks-plugins) | [SIP002](https://shadowsocks.org/doc/sip002.html)<br>[SIP008](https://shadowsocks.org/doc/sip008.html) |
| ShadowsocksR | — | — |
| Trojan | Trojan-gfw / Trojan-go | [trojan/trojan-go](https://p4gefau1t.github.io/trojan-go/developer/url) |
| Tuic | **版本**: v5 | [Tuic](https://github.com/daeuniverse/dae/discussions/182) |
| Juicity | — | [Juicity](https://github.com/juicity/juicity?tab=readme-ov-file#link-format) |
| Hysteria2 | — | [Hysteria2](https://v2.hysteria.network/docs/developers/URI-Scheme) |
| AnyTLS | — | [AnyTLS](https://github.com/anytls/anytls-go/blob/main/docs/uri_scheme.md) |
| 代理鏈（彈性協定） | — | [Proxy chain](https://github.com/daeuniverse/dae/discussions/236) |

表中協定均已支援。「—」表示原文未列出細分資訊或 URI 參考連結。

## URI 範例

### HTTP(S) {#http-uri}

  ```
  https://[[user:]pass@]hostname:port/
  ```

### Socks {#socks-uri}

  ```
  socks4://[[user:]pass@]hostname:port/
  socks5://[[user:]pass@]hostname:port/
  ```

## ShadowTLS 與 Shadowsocks 插件 {#shadowsocks-plugins}

原文未勾選 v2ray-plugin，但勾選了其 Websocket（+TLS）子項；此處保留這兩個狀態。

ShadowTLS v3 連結也可直接搭配 `shadowtls://` 使用。
若節點需要類似瀏覽器的 TLS 指紋，請設定 `global.tls_implementation: utls`，
並將 `global.utls_imitate` 保持為預設的 `chrome_auto`，或在連結查詢字串附加
`tlsImplementation=utls&utlsImitate=chrome`。若供應商預期不使用自訂 SNI，請省略 `sni` 或明確將其保留為空值。

## 外部代理程式

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

## 相容性說明

### VLESS 的 XTLS Vision 與格式錯誤的 ServerHello

用戶端必須先從伺服器的 `ServerHello` 讀取加密套件，才能啟用 XTLS Vision。因為 Vision 的填補策略取決於加密套件，猜測套件會破壞資料流。因此，出站層的 VLESS 實作只會在交握訊息格式正確時解析加密套件，尤其要求 `legacy_session_id` 長度符合 RFC 8446 第 4.1.2 節規定的 0 至 32 位元組，且訊息長度足以包含該欄位。

若 `ServerHello` 格式錯誤（工作階段 ID 超過 32 位元組，或交握訊息被截斷、過大），加密套件會保持未設定。**該連線不會啟用 XTLS Vision，而會改用一般 VLESS 轉送**，不套用 Vision 填補，也不回報協定錯誤。此退回行為是刻意設計的安全措施，因為從格式錯誤的訊息推斷加密套件，會產生錯誤的填補並破壞資料流。

此行為由 dae 所依賴的出站函式庫實作；dae 本身不解析交握訊息。

### 覆寫 QUIC 協定的壅塞控制

`tuic`、`juicity` 與 `hysteria2` 節點連結接受僅在用戶端生效的 `cc_override` 查詢參數，用來選擇用戶端採用的壅塞控制器。此參數不會傳送至伺服器，且優先於伺服器回報的任何控制器：

```
tuic://<uuid>:<password>@<server>:<port>?congestion_control=bbr&cc_override=bbr3
juicity://<uuid>:<password>@<server>:<port>?congestion_control=bbr&cc_override=bbr3
hysteria2://<auth>:<password>@<server>:443?upmbps=20&downmbps=100&cc_override=bbr3
```

`tuic` 與 `juicity` 接受 `bbr`、`cubic`、`new_reno`、`brutal` 與 `bbr3`；`hysteria2` 接受 `bbr`、`brutal` 與 `bbr3`。比對前會先將值轉成小寫，並去除前後空白；不支援的值會在建立撥號器時使節點建立失敗，而非無聲地退回預設值。

未設定 `cc_override` 時，這三種協定都採用 `bbr3`；若要讓個別節點恢復先前穩定版的預設值，請在連結中加入 `cc_override=bbr`。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/proxy-protocols.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
