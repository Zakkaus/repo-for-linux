# Fedora / openSUSE

For Fedora, RHEL, openSUSE and other RPM-based distributions.

Use the sudo tab if sudo is configured for your account; use the root tab when already in a root shell.

## 1. Add the repository

The repository config file is downloaded directly from the repository, the GPG key is imported automatically.

Choose your distribution; use one of these alternatives.

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

## 2. Install packages

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
