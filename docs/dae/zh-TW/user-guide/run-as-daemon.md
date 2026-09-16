---
title: "以服務執行"
---

<div v-pre lang="zh-TW">

# 以服務執行

本指南適用於使用 [systemd](https://wiki.debian.org/systemd) 的系統，說明如何啟動 dae 服務並設定開機自動啟動。

## 必要條件

### 選用的 Geo 資料檔案

為了更方便地進行流量分流，dae 仰賴下列資料來源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

::: code-group

```shell [sudo]
sudo mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
sudo curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
sudo curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

```shell [root]
mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

:::

### 設定檔

> **注意**：建議將設定檔儲存在 `/etc/dae` 下

下載範例設定檔：

::: code-group

```shell [sudo]
sudo mkdir -p /etc/dae
sudo curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
sudo chmod 600 /etc/dae/config.dae
```

```shell [root]
mkdir -p /etc/dae
curl -L -o /etc/dae/config.dae https://github.com/daeuniverse/dae/raw/main/example.dae
chmod 600 /etc/dae/config.dae
```

:::

啟動服務前，編輯 `/etc/dae/config.dae`，設定網路介面、訂閱或節點。請參閱[最小設定](/zh-TW/dae/start/minimal-configuration)。

## 下載預先編譯的二進位檔

發行版本位於 <https://github.com/daeuniverse/dae/releases>

> **注意**：如果你想體驗新功能，可以使用夜間（最新）建置。大多數時候，新提出的變更會包含在 `PRs` 中，並會在建置（GitHub Action Workflow Build）中匯出為跨平台可執行二進位檔。請注意，新引入的功能有時存在錯誤，風險由你自行承擔。不過，我們仍強烈鼓勵你查看最新建置，因為這可能有助於我們進一步分析功能穩定性並相應地解決潛在錯誤。

夜間建置位於 <https://github.com/daeuniverse/dae/actions/workflows/build-nightly.yml>

::: code-group

```shell [sudo]
sudo chmod +x ./dae
sudo install -Dm755 dae /usr/bin/
```

```shell [root]
chmod +x ./dae
install -Dm755 dae /usr/bin/
```

:::

### 檢查執行檔

```shell
# helper
dae --help
# check version
dae version
```

## 設定

::: code-group

```shell [sudo]
# download the sample systemd.service
sudo curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

```shell [root]
# download the sample systemd.service
curl -L -o /etc/systemd/system/dae.service https://github.com/daeuniverse/dae/raw/main/install/dae.service
```

:::

### 啟動並啟用服務

::: code-group

```shell [sudo]
sudo systemctl daemon-reload
sudo systemctl enable dae --now
sudo systemctl status dae
```

```shell [root]
systemctl daemon-reload
systemctl enable dae --now
systemctl status dae
```

:::

## 記憶體與透明大頁

`GOMEMLIMIT` 依行程的 cgroup 上限推算，而非取自 unit 設定：只有 `memory.max` 會參與計算，推算出的軟性限制為該上限的 90%。隨附的 unit 已不再設定 `MemoryHigh`，因為執行階段無法將其視為上限。明確設定的 `GOMEMLIMIT` 環境變數一律優先。

若主機將透明大頁設為 `always`，即使 Go 堆積中仍在使用的記憶體未增加，核心也可能使 dae 的常駐記憶體用量增加。`disable_thp: true` 會透過 `prctl(PR_SET_THP_DISABLE)` 讓該行程停用透明大頁；預設值 `false` 則不改變核心的策略：

```shell
global {
  disable_thp: true
}
```

## 檢查系統日誌

::: code-group

```shell [sudo]
sudo journalctl -xefu dae
```

```shell [root]
journalctl -xefu dae
```

:::

完成[最小設定](/zh-TW/dae/start/minimal-configuration)後，請參閱[服務管理](/zh-TW/dae/start/service-management)，啟動 dae、設定開機啟動、重載或重新啟動服務。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/user-guide/run-as-daemon.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
