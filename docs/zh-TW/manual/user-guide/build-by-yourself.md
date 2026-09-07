---
title: "從原始碼建置"
---

<div v-pre lang="zh-TW">

# 從原始碼建置

## 建置

### 建置相依套件

```shell
clang >= 10
llvm >= 10 (optional)
golang >= 1.24
make
```

### 編譯

```shell
git clone https://github.com/daeuniverse/dae.git
cd dae
git submodule update --init
## Minimal dependency build
make GOFLAGS="-buildvcs=false" \
  CC=clang

## Normal build
#make

## Cross compile
# To armv7 CPU architect:
#make CGO_ENABLED=0 GOARCH=arm GOARM=7
# To mips CPU architect:
#make CGO_ENABLED=0 GOARCH=mips
```

## 執行

### 執行階段相依套件

為了進行流量分流，dae 仰賴下列資料來源：[geoip.dat](https://github.com/v2fly/geoip/releases/latest) 和 [geosite.dat](https://github.com/v2fly/domain-list-community/releases/latest)。

```shell
mkdir -p /usr/local/share/dae/
pushd /usr/local/share/dae/
curl -L -o geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat
curl -L -o geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
popd
```

### 執行

下載範例設定檔：

```shell
curl -L -o example.dae https://github.com/daeuniverse/dae/raw/main/example.dae
```

請參閱 [example.dae](https://github.com/daeuniverse/dae/blob/main/example.dae)。

完成微調後，執行 dae：

```shell
./dae run -c example.dae
```

> **注意**：或者，你可以將 dae 作為常駐程式（systemd）服務執行。請查看[常駐程式服務指南](/zh-TW/manual/user-guide/run-as-daemon)瞭解詳情。

</div>

---

來源：[dae 上游文件](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/build-by-yourself.md) · [AGPL-3.0 授權條款](/upstream/dae-LICENSE.txt)。
