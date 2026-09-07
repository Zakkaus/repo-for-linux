---
title: "快速开始"
---

::: info
来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/README.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
:::

<div v-pre lang="zh-CN">

# 快速开始


## Linux 内核要求

## 内核版本

使用 `uname -r` 检查计算机上的内核版本。

> **注意**
> 如果内核版本为 `< 5.17`，请按照 [**升级指南**](/zh-CN/manual/user-guide/kernel-upgrade) 将内核升级到最低要求版本。

`绑定到 LAN：>= 5.17`

如果要作为中间设备为 LAN 提供网络服务，需要将 dae 绑定到 LAN 接口。

此功能要求安装 dae 的计算机内核版本 >= 5.17。

请注意，如果仅将 dae 绑定到 LAN，dae 只会为来自 LAN 的流量提供网络服务，不会影响本地程序。

`绑定到 WAN：>= 5.17`

如果希望 dae 为本地程序提供网络服务，需要将 dae 绑定到 WAN 接口。

此功能要求计算机的内核版本 >= 5.17。

请注意，如果仅将 dae 绑定到 WAN，dae 只会为本地程序提供网络服务，不会影响从其他接口进入的流量。

`使用 trace 命令`

如果要使用 `dae trace` 命令排查网络连通性问题，内核版本必须 >= 5.15。

## 内核配置

通常，主流桌面发行版会启用这些项目。但为了减小内核体积，OpenWRT、Armbian 等嵌入式设备发行版默认会关闭某些项目。

使用以下命令显示计算机上的内核配置项目。

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

使用类似以下命令检查：

对于 bash 及其他符合 POSIX 的 shell：

```shell
(zcat /proc/config.gz || cat /boot/{config,config-$(uname -r)}) | grep -E 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS|BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS|NET_CLS_BPF|BPF_EVENTS|CGROUPS)=|# CONFIG_DEBUG_INFO_REDUCED is not set'
```

对于 fish shell：

```fish
begin; zcat /proc/config.gz || bat /boot/config "/boot/config-"(uname -r); end | grep -E 'CONFIG_(DEBUG_INFO|DEBUG_INFO_BTF|KPROBES|KPROBE_EVENTS|BPF|BPF_SYSCALL|BPF_JIT|BPF_STREAM_PARSER|NET_CLS_ACT|NET_SCH_INGRESS|NET_INGRESS|NET_EGRESS|NET_CLS_BPF|BPF_EVENTS|CGROUPS)=|# CONFIG_DEBUG_INFO_REDUCED is not set'
```

> **注意**：`Armbian` 用户可按照 [**升级指南**](/zh-CN/manual/user-guide/kernel-upgrade) 升级内核，以满足内核配置要求。

> `Arch Linux ARM` 用户可使用满足 dae 内核配置要求的 [linux-aarch64-7ji](https://github.com/7Ji-PKGBUILDs/linux-aarch64-7ji)。

## 安装

### Arch Linux / Manjaro

可以直接从官方仓库安装 dae。

或者，从 [AUR](https://aur.archlinux.org) 或 [archlinuxcn](https://github.com/archlinuxcn/repo) 获取最新的 AVX2 优化二进制软件包或最新 git 版本。

#### 官方仓库

```shell
sudo pacman -S dae
```

#### AUR

##### 最新发行版（针对 x86-64 v3 / AVX2 优化的二进制文件）

```shell
[yay/paru] -S dae-avx2-bin
```

##### 最新 Git 版本

```shell
[yay/paru] -S dae-git
```

#### archlinuxcn

##### 最新发行版（针对 x86-64 v3 / AVX2 优化的二进制文件）

```shell
sudo pacman -S dae-avx2-bin
```

##### 最新 Git 版本

```shell
sudo pacman -S dae-git
```

安装后，使用 systemctl 控制它。

```shell
# start dae
sudo systemctl start dae

# auto start dae at boot
sudo systemctl enable dae
```

### Gentoo Linux

dae 已在 [gentoo-zh](https://github.com/microcai/gentoo-zh) 发布。

使用 `app-eselect/eselect-repository` 启用此 overlay：

```shell
eselect repository enable gentoo-zh
emaint sync -r gentoo-zh
emerge -a net-proxy/dae
```

### Fedora

dae 已在 [Fedora Copr](https://copr.fedorainfracloud.org/coprs/zhullyb/v2rayA/package/dae) 发布。

```shell
sudo dnf copr enable zhullyb/v2rayA
sudo dnf install dae
```

### Alpine

参见 [在 Alpine 上运行](/zh-CN/manual/tutorials/run-on-alpine)。

### macOS

我们提供了一种在 macOS 上运行 dae 的临时方案。参见 [在 macOS 上运行](/zh-CN/manual/tutorials/run-on-macos)。

### Docker

预构建镜像及相关文档位于 <https://hub.docker.com/r/daeuniverse/dae>。

或者，可以使用 `docker compose`：

```shell
git clone --depth=1 https://github.com/daeuniverse/dae
docker compose up -d --build
```

## 手动安装

> **注意**：此方法**仅**建议 有经验的 用户使用。通过此方法，用户可以灵活测试 dae 的不同版本。请注意，新引入的功能有时存在缺陷，风险自担。

dae 可以作为守护进程（systemd）服务运行。参见 [以守护进程运行](/zh-CN/manual/user-guide/run-as-daemon)

### 安装脚本

参见 [daeuniverse/dae-installer](https://github.com/daeuniverse/dae-installer)（或 [镜像](https://hubmirror.v2raya.org/daeuniverse/dae-installer)）。

### 从头构建

参见 [构建指南](/zh-CN/manual/user-guide/build-by-yourself)。

## 最小配置

最小可启动配置：

```shell
global{}
routing{}
```

不过，此配置会使 dae 处于无负载状态。若希望 dae 处于工作状态，以下是小型配置的最佳实践：

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

更多内容参见 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

如果使用 PVE，请参见 [#37](https://github.com/daeuniverse/dae/discussions/37)。

## PPPoE 接口
如果要代理 PPPoE 接口，请将 wan/lan_interface 设置为 pppd 生成的接口（即 ppp0 / pppoe-wan），而不是物理接口。
如果仅将 PPPoE 接口用于 WAN，只需将 wan_interface 设为 "auto"。

## 重新加载与暂停

配置变更时，可使用命令热重载配置，过程中不会中断现有连接。要暂停 dae 时，可使用命令暂停。

参见 [重新加载与暂停](/zh-CN/manual/user-guide/reload-and-suspend)。

## 故障排除

参见 [故障排除](/zh-CN/manual/troubleshooting)。

</div>
