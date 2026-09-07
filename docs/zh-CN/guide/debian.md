# Debian / Ubuntu

适用于 Debian、Ubuntu 及其他使用 APT 的发行版。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 安装 `curl`

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

## 2. 添加软件源

从软件源下载配置文件。

按 APT 版本选择一种配置，不要同时添加两种。

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

## 3. 导入 GPG 公钥

::: code-group

```sh [sudo]
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

```sh [root]
curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

:::

## 4. 安装软件包

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
