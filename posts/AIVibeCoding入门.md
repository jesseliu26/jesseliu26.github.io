---
title: "AI vibe coding入门"
date: "2026-05-30"
readTime: "5 分钟"
tags: ["AI","Code"]
theme: ["#7253ed", "#e94c4c", "#f5f6fa"]
cover: "./assets/images/covers/codex封面.png"
excerpt: "基础的名词和软件工具。"
---

## 1. 你先认识这些名词

| 名词                          | 一句话解释                                                   |
| ----------------------------- | ------------------------------------------------------------ |
| Prompt                        | 你给 AI 的指令。                                             |
| Context                       | AI 当前能看到的信息：代码、报错、文档、历史对话。            |
| Context Window                | AI 一次能记住/读取的上下文容量。                             |
| RAG                           | 先从外部资料库检索相关内容，再让 AI 回答；简单说就是“先查资料再生成”。IBM 对 RAG 的定义也是把模型连接到外部知识库以提升回答质量。 |
| Embedding                     | 把文本/代码变成向量，方便相似度搜索。                        |
| Vector DB                     | 存 embedding 的数据库，常用于 RAG。                          |
| MCP                           | Model Context Protocol，把 AI 接到外部工具、数据库、文件、搜索、GitHub 等；官方类比是“AI 应用的 USB-C 接口”。 |
| Agent                         | 能自己读代码、改文件、跑命令、迭代修错的 AI。                |
| Tool Call                     | AI 调用工具，比如运行测试、查文件、访问 API。                |
| Diff                          | AI 改了哪些代码。你必须会看。                                |
| Hallucination                 | AI 一本正经地写错、编造 API、编造库。                        |
| Rules / AGENTS.md / CLAUDE.md | 写给 AI 的项目规则，比如“先计划、别乱加依赖、必须跑测试”。   |

## 2. 你需要知道这些工具

| 工具                | 用来干嘛                      | 怎么用                                                       |
| ------------------- | ----------------------------- | ------------------------------------------------------------ |
| Cursor              | AI IDE，适合新手。            | 打开项目 → 让 AI 读代码 → 让它改小任务。                     |
| Claude Code         | 终端里的 AI 编程 agent。      | 进项目目录，运行claude，然后说“先分析项目结构，不要改代码”。Claude Code 官方说明它能读代码库、编辑文件、运行命令。 |
| Codex CLI           | OpenAI 的终端 coding agent。  | 进项目目录，运行codex，或codex "Explain this codebase to me"；官方文档说它可以读取仓库、修改文件、运行命令，并让你实时审查。 |
| GitHub Copilot      | IDE 补全、聊天、代码建议。    | 适合日常补代码、解释代码。                                   |
| v0 / Lovable / Bolt | 用自然语言快速生成网页/原型。 | 适合做 demo，不适合直接当严肃工程。                          |
| GitHub              | 管代码、版本、PR、回滚。      | AI 写代码前后都要配合 Git 使用。                             |

入门顺序建议是：

```text
Cursor → GitHub → Claude Code 或 Codex → 再研究 MCP/RAG
```

## 3. 你要知道这些“规范/工作流”

这些不是传统代码规范，更像是约束 AI 写代码的工作方法。

| 名称               | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| GSD                | 偏“防止上下文变脏”。它把任务拆阶段，用.planning/、REQUIREMENTS.md、ROADMAP.md、STATE.md等文件传递状态，而不是全靠长对话记忆。GSD 文档里也有/gsd-discuss-phase、/gsd-plan-phase这种分阶段命令。 |
| Superpowers        | 偏“强制工程纪律”。它是给 coding agent 用的一套技能/方法论，强调先澄清需求、写 spec、做计划、TDD、审查。其 README 也说它是基于 composable skills 的软件开发方法论。 |
| AGENTS.md          | 通用 AI 项目说明文件，告诉 agent 项目规则。                  |
| CLAUDE.md          | Claude Code 常用的项目记忆/规则文件。                        |
| TDD                | 先写测试，再写实现。适合约束 AI。                            |
| Red-Green-Refactor | 测试失败 → 写代码通过 → 重构。                               |
| DRY                | Don’t Repeat Yourself，不要重复代码。                        |
| YAGNI              | You Aren’t Gonna Need It，不要提前做没用功能。               |
| CI                 | 每次提交自动跑测试/构建。                                    |

GSD、Superpowers、GSTACK 这类框架的区别可以简单记成：Superpowers 管流程和测试，GSD 管上下文和阶段隔离，GSTACK 管角色和治理。Pulumi 的比较文章也基本是这个划分。

## 4. 你的最简学习路线

```text
第一步：学名词
Prompt / Context / Agent / RAG / MCP / Diff / Test

第二步：学工具
Cursor + GitHub

第三步：学基本工程能力
Git / 命令行 / 看报错 / 跑测试 / 看 diff

第四步：学终端 agent
Claude Code 或 Codex

第五步：学 AI 工作流规范
AGENTS.md / CLAUDE.md / Superpowers / GSD
```

## 5. 最重要的一句话

优先级是：

```text
先会用 Cursor 做小项目
→ 再会看 diff 和用 Git 回滚
→ 再会用 Claude Code / Codex
→ 最后再研究 RAG、MCP、GSD、Superpowers
```
