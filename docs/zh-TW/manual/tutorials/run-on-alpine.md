---
title: "Alpine Linux"
---

::: info
來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/tutorials/run-on-alpine.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
:::

<div v-pre lang="zh-TW">

# Alpine Linux

**注意：**
1. Alpine Linux 3.18 或更新版本原生提供完整 eBPF 支援；較舊版本的 Alpine Linux 需要自行建置核心。
2. 自 3.20 版本起，因 Alpine Linux 的跨 CPU 架構相容性，Alpine Linux 已正式停用 dae 所需的部分功能，因此預設只能使用 `linux-virt` 執行 dae。若要使用 `linux-lts` 或 `linux-edge`，應自行建置核心。
3. 本教學適用於 Alpine Linux 3.20 及更新版本。

## 啟用 Community 儲存庫

執行 `setup-apkrepos` 命令，接著會看到如下選單：

```
 (f)    Find and use fastest mirror
 (s)    Show mirrorlist
 (r)    Use random mirror
 (e)    Edit /etc/apk/repositories with text editor
 (c)    Community repo enable
 (skip) Skip setting up apk repositories
```

接著輸入 `c` 以啟用 Community 儲存庫。

## 啟用 CGroups

啟用 `cgroups` 服務：

```sh
rc-update add cgroups boot
```

## 掛載 bpf

編輯 `/etc/init.d/sysfs`：

```sh
vi /etc/init.d/sysfs
```

在 `mount_misc` 區段加入下列內容：

```sh
        # Setup Kernel Support for bpf file system
        if [ -d /sys/fs/bpf ] && ! mountinfo -q /sys/fs/bpf; then
                if grep -qs bpf /proc/filesystems; then
                ebegin "Mounting eBPF filesystem"
                mount -n -t bpf -o ${sysfs_opts} bpffs /sys/fs/bpf
                eend $?
                fi
        fi
```

請留意，指令碼 `/etc/init.d/sysfs` 的格式必須正確，否則 `sysfs` 服務會失敗。

## 安裝 dae

安裝程式：<https://github.com/daeuniverse/dae-installer/>

此安裝程式提供 dae 的 OpenRC 服務指令碼。安裝後，應將設定檔加入 `/usr/local/etc/dae/config.dae`，然後將其權限設為 600 或 640：

```sh
chmod 640 /usr/local/etc/dae/config.dae
```

若設定檔已可正常運作，即可啟動 dae 服務：

```sh
rc-service dae start
```

## 開機時啟動 dae

使用 `rc-update` 啟用 dae 服務：

```sh
rc-update add dae
```

</div>
