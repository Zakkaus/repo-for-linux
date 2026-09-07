---
title: "快速開始"
---

<div v-pre lang="zh-TW">

# 快速開始


## Linux 核心需求

## 核心版本

使用 `uname -r` 檢查機器上的核心版本。

> **注意**
> 若核心版本為 `< 5.17`，請依照[**升級指南**](/zh-TW/manual/user-guide/kernel-upgrade)將核心升級至最低需求版本。

`繫結 LAN：>= 5.17`

若要將 dae 作為中介裝置為 LAN 提供網路服務，必須將 dae 繫結至 LAN 介面。

此功能要求安裝 dae 的機器核心版本 >= 5.17。

請注意，若僅將 dae 繫結至 LAN，dae 僅會為來自 LAN 的流量提供網路服務，不會影響本機程式。

`繫結 WAN：>= 5.17`

若要讓 dae 為本機程式提供網路服務，必須將 dae 繫結至 WAN 介面。

此功能要求機器的核心版本 >= 5.17。

請注意，若僅將 dae 繫結至 WAN，dae 僅會為本機程式提供網路服務，不會影響從其他介面進入的流量。

`使用 trace 命令`

若要使用 `dae trace` 命令排查網路連線問題，核心版本必須 >= 5.15。

## 核心設定

主流桌面發行版通常已啟用這些項目。但為縮減核心大小，OpenWRT、Armbian 等嵌入式裝置發行版預設會停用部分項目。

使用下列命令顯示機器上的核心設定項目。

```shell
zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}
```

dae 需要：

```
CONFIG_BPF=y
CONFIG_BPF_SYSCALL=y
CONFIG_BPF_JIT=y
CONFIG_CGROUPS=y
CONFIG_KPROBES=y
CONFIG_NET_INGRESS=y
CONFIG_NET_EGRESS=y
CONFIG_NET_SCH_INGRESS=m
CONFIG_NET_CLS_BPF=m
CONFIG_NET_CLS_ACT=y
CONFIG_BPF_STREAM_PARSER=y
CONFIG_DEBUG_INFO=y
# CONFIG_DEBUG_INFO_REDUCED is not set
CONFIG_DEBUG_INFO_BTF=y
CONFIG_KPROBE_EVENTS=y
CONFIG_BPF_EVENTS=y
```

使用下列命令檢查：

適用於 bash 與其他符合 POSIX 的 shell：

```shell
(zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}) | grep -E 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS|BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS|NET_CLS_BPF|BPF_EVENTS|CGROUPS)=|# CONFIG_DEBUG_INFO_REDUCED is not set'
```

適用於 fish shell：

```fish
begin; zcat /proc/config.gz || bat /boot/config "/boot/config-"(uname -r); end | grep -E 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS|BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS|NET_CLS_BPF|BPF_EVENTS|CGROUPS)=|# CONFIG_DEBUG_INFO_REDUCED is not set'
```

> **注意**：`Armbian` 使用者可依照[**升級指南**](/zh-TW/manual/user-guide/kernel-upgrade)升級核心，以符合核心設定需求。

> `Arch Linux ARM` 使用者可使用符合 dae 核心設定需求的 [linux-aarch64-7ji](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。

## 安裝

### Arch Linux / Manjaro

可直接從官方儲存庫安裝 dae。

或者，可從 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 取得最新的 AVX2 最佳化二進位套件或最新 git 版本。

#### 官方儲存庫

```shell
sudo pacman -S dae
```

#### AUR

##### 最新發行版（適用於 x86-64 v3 / AVX2 的最佳化二進位檔）

```shell
[yay/paru] -S dae-avx2-bin
```

##### 最新 Git 版本

```shell
[yay/paru] -S dae-git
```

#### archlinuxcn

##### 最新發行版（適用於 x86-64 v3 / AVX2 的最佳化二進位檔）

```shell
sudo pacman -S dae-avx2-bin
```

##### 最新 Git 版本

```shell
sudo pacman -S dae-git
```

安裝後，使用 systemctl 控制它。

```shell
# start dae
sudo systemctl start dae

# auto start dae at boot
sudo systemctl enable dae
```

### Gentoo Linux

dae 已在 [gentoo-zh](https://github.com/microcai/gentoo-zh) 發行。

使用 `app-eselect/eselect-repository` 啟用此 overlay：

```shell
eselect repository enable gentoo-zh
emaint sync -r gentoo-zh
emerge -a net-proxy/dae
```

### Fedora

dae 已在 [Fedora Copr](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae) 發行。

```shell
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

### Alpine

請參閱[在 Alpine 上執行](/zh-TW/manual/tutorials/run-on-alpine)。

### macOS

我們提供在 macOS 上執行 dae 的權宜方法。請參閱[在 macOS 上執行](/zh-TW/manual/tutorials/run-on-macos)。

### Docker

預建映像檔及相關文件位於 <https://hub.docker.com/r/daeuniverse/dae>。

或者，可使用 `docker compose`：

```shell
git clone --depth=1 https://github.com/daeuniverse/dae
docker compose up -d --build
```

## 手動安裝

> **注意**：此方法**僅**建議 進階 使用者使用。使用此方法可彈性測試不同版本的 dae。請注意，新加入的功能有時可能有錯誤，請自行承擔風險。

dae 可作為 daemon（systemd）服務執行。請參閱 [以服務執行](/zh-TW/manual/user-guide/run-as-daemon)。

### 安裝指令碼

請參閱 [daeuniverse/dae-installer](https://github.com/daeuniverse/dae-installer)（或[鏡像](https://hubmirror.v2raya.org/daeuniverse/dae-installer)）。

### 從頭建置

請參閱[建置指南](/zh-TW/manual/user-guide/build-by-yourself)。

## 最小設定

最小可啟動設定：

```shell
global{}
routing{}
```

不過，此設定會讓 dae 處於無負載狀態。若要讓 dae 處於運作狀態，下列是小型設定的最佳實務：

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

更多內容請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

若使用 PVE，請參閱 [#37](https://github.com/daeuniverse/dae/discussions/37)。

## PPPoE 介面
若要代理 PPPoE 介面，請將 wan/lan_interface 設為 pppd 產生的介面（即 ppp0 / pppoe-wan），而非實體介面。
若僅將 PPPoE 介面用於 WAN，只需將 wan_interface 設為 "auto"。

## 重新載入與暫停

設定變更時，可方便地使用命令重新載入設定，既有連線不會在過程中中斷。若要暫停 dae，可使用命令暫停。

請參閱[重新載入與暫停](/zh-TW/manual/user-guide/reload-and-suspend)。

## 疑難排解

請參閱[疑難排解](/zh-TW/manual/troubleshooting)。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
