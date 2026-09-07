# Debian / Ubuntu

適用於 Debian、Ubuntu 及其他使用 APT 的發行版。

## 1. 安裝 `curl`

```sh
sudo apt update
sudo apt install curl
```

## 2. 新增套件來源

從套件來源下載設定檔。

APT 3.0 及以上版本：

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

低於 APT 3.0 的版本：

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

## 3. 匯入 GPG 公鑰

```sh
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

## 4. 安裝套件

```sh
sudo apt update
sudo apt install v2raya
```
