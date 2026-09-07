# Debian / Ubuntu

For Debian, Ubuntu and other APT-based distributions.

## 1. Install `curl`

```sh
sudo apt update
sudo apt install curl
```

## 2. Add the repository

The source config file is downloaded directly from the repository.

For APT version 3.0 or higher:

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.sources https://daeuniverse.pages.dev/daeuniverse.sources
```

For APT version lower than 3.0:

```sh
sudo curl -fsSL -o /etc/apt/sources.list.d/daeuniverse.list https://daeuniverse.pages.dev/daeuniverse.list
```

## 3. Import the GPG key

```sh
sudo curl -fsSL -o /usr/share/keyrings/daeuniverse-archive-goose.gpg https://daeuniverse.pages.dev/daeuniverse-archive-goose.gpg
```

## 4. Install packages

```sh
sudo apt update
sudo apt install v2raya
```
