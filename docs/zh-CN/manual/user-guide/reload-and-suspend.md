---
title: "重载与暂停"
---

::: info
来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/user-guide/reload-and-suspend.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
:::

<div v-pre lang="zh-CN">

# 重载与暂停

dae 支持配置重载和程序挂起。这些功能可在修改配置的过程中，或需要临时挂起 dae 时帮助使用者节省大量时间。

## 重载

一般情况下，dae 在重载配置的过程中不会中断现有连接。重载的速度也比重启快得多。重载还会同时手动更新全部的订阅。

用法：

```shell
dae reload
```

## 挂起

如果你想暂时挂起 dae，并在之后将其恢复，该功能将很有用。

## 用法

```shell
dae suspend
```

如果想恢复，请使用重载：

```shell
dae reload
```

</div>
