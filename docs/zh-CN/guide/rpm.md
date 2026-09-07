# Fedora / openSUSE

适用于 Fedora、RHEL、openSUSE 及其他使用 RPM 的发行版。

## 1. 添加软件源

从软件源下载配置文件，GPG 公钥会自动导入。

Fedora、RHEL 及其他使用 DNF 的发行版：

```sh
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

openSUSE：

```sh
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

## 2. 安装软件包

```sh
sudo dnf install v2raya
```

openSUSE 使用以下命令：

```sh
sudo zypper install v2raya
```
