# Gentoo / Calculate

Gentoo 使用者可透過 [gentoo-zh overlay](https://github.com/gentoo-zh/overlay/tree/master/net-proxy/dae) 安裝 `net-proxy/dae`。此套件由 Gentoo 社群維護，使用 Portage 管理。本網站的 APT/RPM 版本表對應另一個套件來源。

以下指令以 root 身分執行，測試關鍵字範例適用於 amd64 系統。

## 1. 新增並同步 overlay

```sh
emerge --ask app-eselect/eselect-repository dev-vcs/git
eselect repository add gentoo-zh git https://github.com/gentoo-zh/overlay.git
emaint sync -r gentoo-zh
```

如果已經設定 gentoo-zh，只需執行同步指令。鏡像選擇與手動設定方法請見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。

## 2. 接受測試關鍵字

使用穩定關鍵字的 amd64 系統需要在 `package.accept_keywords` 中新增以下設定。如果 `/etc/portage/package.accept_keywords` 是目錄，可寫入其中的 `/etc/portage/package.accept_keywords/dae` 檔案；如果它是檔案，則直接在該檔案中新增。

```text
net-proxy/dae::gentoo-zh ~amd64
```

已全域接受 `~amd64` 的系統可略過此步驟。其他架構需先檢查所選 ebuild 的 `KEYWORDS`，再選擇對應的關鍵字。

## 3. 安裝 dae

```sh
emerge --ask net-proxy/dae::gentoo-zh
```

檢查 Portage 提供的核心設定提示。ebuild 會安裝 OpenRC、systemd 服務檔案，並將設定範例放在 `/usr/share/dae/config.dae.example`。啟動服務前應先完成 dae 設定，詳見 [dae 文件](https://github.com/daeuniverse/dae#readme)。

## 選用：鏡像與二進位套件

Distfiles 鏡像、binhost 頻道與簽章驗證的設定方法請見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。可用的二進位套件以[套件列表](https://distfiles.gentoozh.org/packages)為準；沒有合適的二進位套件時，Portage 可以從原始碼編譯。
