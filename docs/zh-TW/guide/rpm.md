# Fedora / openSUSE

適用於 Fedora、RHEL、openSUSE 及其他使用 RPM 的發行版。

## 1. 新增套件來源

從套件來源下載設定檔，GPG 公鑰會自動匯入。

Fedora、RHEL 及其他使用 DNF 的發行版：

```sh
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

openSUSE：

```sh
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

## 2. 安裝套件

```sh
sudo dnf install v2raya
```

openSUSE 使用以下指令：

```sh
sudo zypper install v2raya
```
