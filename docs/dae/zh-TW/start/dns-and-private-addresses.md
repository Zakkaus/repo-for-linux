---
title: DNS 與保留位址
---

# DNS 與保留位址

## dae 作為 DNS 伺服器

dae 預設透明攔截所有發往 UDP 53 連接埠的流量並嗅探 DNS。設定 `dns.bind`（例如 `'127.0.0.1:5353'`）後，dae 還可主動監聽 DNS 查詢。內建出站 `asis` 會向原請求的目的位址查詢。使用 `asis` 時，不要讓區域網路裝置將 `dae:53` 作為 DNS 伺服器，否則查詢可能形成迴圈。

`udp://` 或 `tcp+udp://` 上游收到截斷回應（`TC=1`）後，會透過 TCP 重試。`asis` 則原樣轉送回應，由用戶端決定是否重試。其他協定方案仍使用其宣告的傳輸方式。

`global.bootstrap_resolver` 只處理 dae 自身 DNS 路由就緒前所需的查詢：解析 DNS 上游主機名稱，以及供 `dial_mode: real-domain` 探測使用。未設定時，dae 先使用 `119.29.29.29:53`，再使用 `223.5.5.5:53`。設定此選項會取代這兩個預設值，上游範例如下：

```shell
global {
  bootstrap_resolver: '9.9.9.9:53'
}
```

## 保留位址預設直連

隨附的 `example.dae` 與上游最小設定都包含以下規則，讓發往保留位址的流量直連。內建集合 `geoip:private` 包含 RFC 1918 私有位址、環回位址和鏈路本地位址等。

```shell
dip(geoip:private) -> direct
```

這是隨附設定的預設行為，不是 eBPF 資料平面或控制平面中寫死的排除邏輯。刪除這條規則後，這些位址便不再保證直連，流量會依其餘路由規則處理，可能進入代理。

詳細設定請參閱 [DNS 設定](/zh-TW/dae/configuration/dns)與[路由設定](/zh-TW/dae/configuration/routing)。
