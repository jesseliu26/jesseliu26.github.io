---
title: "CC Switch 更新 Claude Code 和 Codex CLI 失败：原因与修复"
date: "2026-07-21"
readTime: "4 分钟"
tags: ["AI","Code"]
theme: ["#7253ed", "#e94c4c", "#f5f6fa"]
cover: "./assets/images/covers/cc-switch-wechat-cover.png"
excerpt: "CC Switch 更新失败的原因与修复。"
---

本文中的两个客户端，指 CC Switch 管理的 Claude Code 和 Codex CLI，不是 Claude 与 ChatGPT 桌面 App。

## 一、当前环境

- 电脑：MacBook Pro，M1 Pro，32 GB 内存
- 系统：macOS 27.0，arm64
- CC Switch：3.17.0
- Claude Code：2.1.210，准备更新到 2.1.216
- Codex CLI：0.142.5，准备更新到 0.144.6

Claude Code 原来通过 Homebrew Node 下的 npm 安装，Codex CLI 则是 OpenAI 官方独立安装版。

## 二、现象与原因

现象是：CC Switch 能检测到新版本，但点击更新立即失败，网络和终端命令均正常。

原因有两个：

1. CC Switch 从 macOS GUI 环境启动更新进程，没有继承终端中的 `/opt/homebrew/bin`，所以 npm 找不到 Node。
2. Codex 是官方独立安装版，而 CC Switch 3.17.0 在当前情况下会回退到 npm 更新，造成安装渠道不匹配。

因此，只补 PATH 只能解决 Claude Code。要让 CC Switch 以后同时更新两个客户端，需要把 Claude Code 和 Codex CLI 都统一为 Homebrew Node 下的 npm 安装，并让 CC Switch 继承正确的 PATH。

## 三、如何让 CC Switch 正常更新

下面是一次性配置，请在系统终端中依次执行。

### 第一步：将两个客户端统一为 Homebrew npm 全局包

```zsh
PATH="/opt/homebrew/bin:$PATH" /opt/homebrew/bin/npm install -g @anthropic-ai/claude-code@latest @openai/codex@latest
```

### 第二步：确认两份 npm 客户端可以运行

```zsh
/opt/homebrew/bin/claude --version
/opt/homebrew/bin/codex --version
```

### 第三步：停用旧的 Codex 独立版入口

先执行：

```zsh
readlink ~/.local/bin/codex
```

如果输出指向 `~/.codex/packages/standalone/current/bin/codex`，再执行：

```zsh
mv ~/.local/bin/codex ~/.local/bin/codex.standalone.bak
hash -r
```

### 第四步：给 CC Switch 补上 Homebrew PATH

```zsh
launchctl setenv PATH "/opt/homebrew/bin:/opt/homebrew/sbin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

### 第五步：重启 CC Switch

```zsh
osascript -e 'quit app "CC Switch"' 2>/dev/null || true
sleep 2
open -a "CC Switch"
```

### 第六步：检查默认路径

```zsh
command -v claude
command -v codex
```

正确结果应该是：

```text
/opt/homebrew/bin/claude
/opt/homebrew/bin/codex
```

现在回到 CC Switch 的工具版本页面，刷新后即可继续使用更新按钮。两个客户端都会通过同一套 Homebrew npm 和 Node 更新。

macOS 重新登录或重启后，`launchctl` 中的 PATH 可能被清除。如果同样的问题再次出现，只需重新执行第四步和第五步。

## 四、更新结果

- Claude Code：2.1.210 更新到 2.1.216，更新成功。
- Codex CLI：0.142.5 更新到 0.144.6，更新成功。

问题与网络无关。核心是 CC Switch 3.17.0 缺少 Homebrew PATH，同时 Codex 使用了不同安装渠道。统一 npm 安装渠道并补齐 GUI PATH 后，后续即可继续通过 CC Switch 更新这两个客户端。

## 参考资料

- [CC Switch 3.17.0](https://github.com/farion1231/cc-switch/releases/tag/v3.17.0)
- [CC Switch 上游 PATH 修复](https://github.com/farion1231/cc-switch/commit/17b053ed94871fde4c0ab1319e1b3a43a99bdbf9)
