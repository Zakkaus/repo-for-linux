# Fedora / openSUSE

適用於 Fedora、RHEL、openSUSE 及其他使用 RPM 的發行版。

已設定 sudo 的一般使用者選擇 sudo 標籤；已進入 root shell 時選擇 root 標籤。

## 1. 新增套件來源

從套件來源下載設定檔，GPG 公鑰會自動匯入。

依發行版選擇對應指令，無須執行另一組。

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

## 2. 安裝套件

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
