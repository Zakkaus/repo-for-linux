# Fedora / openSUSE

适用于 Fedora、RHEL、openSUSE 及其他使用 RPM 的发行版。

已配置 sudo 的普通用户选择 sudo 标签；已进入 root shell 时选择 root 标签。

## 1. 添加软件源

从软件源下载配置文件，GPG 公钥会自动导入。

按发行版选择对应命令，无需执行另一组。

::: code-group

```sh [Fedora / RHEL · sudo]
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [Fedora / RHEL · root]
curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [openSUSE · sudo]
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

```sh [openSUSE · root]
curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

:::

## 2. 安装软件包

::: code-group

```sh [Fedora / RHEL · sudo]
sudo dnf install v2raya
```

```sh [Fedora / RHEL · root]
dnf install v2raya
```

```sh [openSUSE · sudo]
sudo zypper install v2raya
```

```sh [openSUSE · root]
zypper install v2raya
```

:::
