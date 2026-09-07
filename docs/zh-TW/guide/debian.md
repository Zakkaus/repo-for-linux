# Debian / Ubuntu

適用於 Debian、Ubuntu 及其他使用 APT 的發行版。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 安裝 `curl`

::: code-group

```sh [sudo]
sudo apt update
sudo apt install curl
```

```sh [root]
apt update
apt install curl
```

:::

## 2. 新增套件來源

從套件來源下載設定檔。

依 APT 版本選擇一種設定，不要同時新增兩種。

::: code-group

```sh [APT ≥ 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT ≥ 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

```sh [APT < 3.0 · sudo]
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

```sh [APT < 3.0 · root]
curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

:::

## 3. 匯入 GPG 公鑰

::: code-group

```sh [sudo]
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

```sh [root]
curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

:::

## 4. 安裝套件

::: code-group

```sh [sudo]
sudo apt update
sudo apt install v2raya
```

```sh [root]
apt update
apt install v2raya
```

:::
