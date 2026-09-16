---
title: "從原始碼建置"
---

<div v-pre lang="zh-TW">

# 從原始碼建置

## 建置

### 建置相依套件

```text
clang >= 10
llvm >= 10 (optional)
golang >= 1.26.0
make
```

工具鏈需求取決於原始碼版本。本次收錄版本使用 Go 1.26.0，請核對對應的 [go.mod](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/go.mod) 與[建置工作流程](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/.github/workflows/seed-build.yml)。

### 編譯

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

選擇一種建置方式：

::: code-group

```shell [最少相依套件]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [一般建置]
## Normal build
make
```

```shell [ARMv7]
## Cross compile
# To armv7 CPU architect:
make CGO_ENABLED=0 GOARCH=arm GOARM=7
```

```shell [MIPS]
# To mips CPU architect:
make CGO_ENABLED=0 GOARCH=mips
```

:::

### 各架構的 trace 支援 {#trace-support-per-architecture}

當工具鏈能產生選用的 `dae trace` eBPF 程式時，`make` 會建置它，並將結果記錄在 `.build_tags` 中：有建置時記錄 `trace`，未建置時則為空。**`arm`、`mips`、`mips64`、`mips64le`、`mipsle` 與 `s390x` 架構不提供 `dae trace`**（清單見 Makefile 中的 `TRACE_UNSUPPORTED_GOARCH`）。這些架構的建置會顯示 `WARNING`，繼續產生不含 `trace` 建置標籤的二進位檔。其他 `GOARCH` 若無法產生 trace 程式，則視為建置錯誤，因此二進位檔不會在沒有提示的情況下缺少 `dae trace`。

此清單依據實測，而非假設；BPF Test 工作流程會透過 `./scripts/check-trace-arch-matrix.sh` 重新驗證。可用下列命令重現各架構的結果：

```shell
git submodule update --init
GOARCH=mips BPF_CLANG=clang go generate ./trace/trace.go    # fails: no compiler specified
GOARCH=mips64 BPF_CLANG=clang go generate ./trace/trace.go  # fails: unsupported target
```

不要僅因 `github.com/cilium/ebpf` 的 `gen.FindTarget()` 接受某架構，就將該架構從清單移除。目標查找與編譯是不同步驟；`mips` 能通過前者，卻無法通過後者，因為其 `bpf_tracing.h` 選用 mips 的 `pt_regs` 配置，而隨 `dae_bpf_headers` 子模組提供的 `vmlinux.h` 則退回使用 x86。

`dae trace` 本身需要核心版本 >= 5.15；dae 的其他功能需要 >= 5.17。

## 執行

### 執行階段相依套件

為了進行流量分流，dae 仰賴下列資料來源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

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

### 執行

下載範例設定檔：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

完成微調後，執行 dae：

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **注意**：或者，你可以將 dae 作為常駐程式（systemd）服務執行。請查看[常駐程式服務指南](/zh-TW/dae/user-guide/run-as-daemon)瞭解詳情。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
