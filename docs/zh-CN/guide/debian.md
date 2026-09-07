# Debian / Ubuntu

适用于 Debian、Ubuntu 及其他使用 APT 的发行版。

## 1. 安装 `curl`

```sh
sudo apt update
sudo apt install curl
```

## 2. 添加软件源

从软件源下载配置文件。

APT 3.0 及以上版本：

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

低于 APT 3.0 的版本：

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

## 3. 导入 GPG 公钥

```sh
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

## 4. 安装软件包

```sh
sudo apt update
sudo apt install v2raya
```
