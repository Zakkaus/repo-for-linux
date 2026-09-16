---
title: "从源代码构建"
---

<div v-pre lang="zh-CN">

# 从源代码构建

## 构建

### 构建依赖

```text
clang >= 10
llvm >= 10 (optional)
golang >= 1.26.0
make
```

工具链要求取决于源码版本。本次收录版本使用 Go 1.26.0，请核对对应的 [go.mod](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/go.mod) 与[构建工作流](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/.github/workflows/seed-build.yml)。

### 编译

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
```

选择一种构建方式：

::: code-group

```shell [最小依赖]
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CLANG=clang
```

```shell [普通构建]
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

### 各架构的 trace 支持

当工具链能够生成可选的 `dae trace` eBPF 程序时，`make` 会将其构建进二进制文件，并在 `.build_tags` 中记录结果：包含该程序时记录 `trace`，未包含时为空。**`arm`、`mips`、`mips64`、`mips64le`、`mipsle` 和 `s390x` 架构不提供 `dae trace`**，这些架构列在 Makefile 的 `TRACE_UNSUPPORTED_GOARCH` 中。构建这些架构时会输出 `WARNING`，继续生成不带 `trace` 构建标签的二进制文件。对于其他 `GOARCH`，trace 生成失败会报错，因此不会在没有提示的情况下生成缺少 `dae trace` 的二进制文件。

该列表基于实际验证，而非推测；BPF Test 工作流会通过 `./scripts/check-trace-arch-matrix.sh` 重新验证。可用以下命令按架构复现：

```shell
git submodule update --init
GOARCH=mips BPF_CLANG=clang go generate ./trace/trace.go    # fails: no compiler specified
GOARCH=mips64 BPF_CLANG=clang go generate ./trace/trace.go  # fails: unsupported target
```

不要仅因 `github.com/cilium/ebpf` 的 `gen.FindTarget()` 接受某个架构，就将其从列表中移除。目标查找与编译是不同的步骤：`mips` 能通过前者，却无法通过后者，因为其 `bpf_tracing.h` 选择了 mips 的 `pt_regs` 布局，而 `dae_bpf_headers` 子模块提供的 `vmlinux.h` 则回退到 x86。

`dae trace` 本身要求内核版本 >= 5.15；dae 的其余功能要求内核版本 >= 5.17。

## 运行

### 运行时依赖

为了进行流量分流，dae 依赖以下数据源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

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

### 运行

下载示例配置文件：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

请参阅 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

完成微调后，运行 dae：

::: code-group

```shell [sudo]
sudo ./dae run -c example.dae
```

```shell [root]
./dae run -c example.dae
```

:::

> **注意**：或者，你可以将 dae 作为守护进程（systemd）服务运行。请查看[守护进程服务指南](/zh-CN/dae/user-guide/run-as-daemon)了解详情。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
