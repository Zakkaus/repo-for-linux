# Debian / Ubuntu

For Debian, Ubuntu and other APT-based distributions.

Use the sudo tab if sudo is configured for your account; use the root tab when already in a root shell.

## 1. Install `curl`

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

## 2. Add the repository

The source config file is downloaded directly from the repository.

Choose the configuration matching your APT version; use one of these alternatives.

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

## 3. Import the GPG key

::: code-group

```sh [sudo]
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

```sh [root]
curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

:::

## 4. Install packages

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
