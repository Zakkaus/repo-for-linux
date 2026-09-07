# Fedora / openSUSE

For Fedora, RHEL, openSUSE and other RPM-based distributions.

## 1. Add the repository

The repository config file is downloaded directly from the repository, the GPG key is imported automatically.

For Fedora, RHEL and other DNF-based distributions:

```sh
sudo curl -fsSL -o /etc/yum.repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

For openSUSE:

```sh
sudo curl -fsSL -o /etc/zypp/repos.d/daeuniverse.repo https://daeuniverse.pages.dev/daeuniverse.repo
```

## 2. Install packages

```sh
sudo dnf install v2raya
```

or on openSUSE:

```sh
sudo zypper install v2raya
```
