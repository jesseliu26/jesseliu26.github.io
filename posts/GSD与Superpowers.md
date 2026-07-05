---
title: "GSD与Superpowers"
date: "2026-05-30"
readTime: "5 分钟"
tags: ["AI","Code"]
theme: ["#7253ed", "#e94c4c", "#f5f6fa"]
cover: "./assets/images/covers/GSD与Superpowers.png"
excerpt: "Vibe Coding 规范。"
---

下面我按 AI Coding / Claude Code / Cursor 工作流框架 的语境解释。这里的 GSD 通常是 gsd-build/get-shit-done，定位为“meta-prompting、context engineering、spec-driven development system”；Superpowers 通常是 obra/superpowers，定位为给编码 Agent 使用的一套“composable skills + initial instructions”的软件开发方法论。

## 1. 先说结论：它们解决的是同一个问题，但切入点不同

AI 编程 Agent 最大的问题不是“不会写代码”，而是：

它会忘上下文、越做越偏、跳过验证、把临时方案当正式架构、在大项目里乱改文件、对需求理解不稳定。

GSD 更像是给 Agent 加一套“任务执行系统”：把需求拆成 spec、plan、task，让 Agent 在受控上下文里推进，重点是 上下文管理、任务拆解、长任务执行。

Superpowers 更像是给 Agent 加一套“工程行为规范”：什么时候先写测试，什么时候调研，什么时候做设计，什么时候验证，重点是 流程纪律、技能调用、质量门槛。

一句话对比：

> GSD 管“怎么把一件大事拆开并持续做完”；Superpowers 管“每一步该用什么工程方法做得更稳”。

------

## 2. GSD 是什么？

GSD，全称通常写作 Get Shit Done，它的官方定位是一个轻量但强力的 meta-prompting、context engineering、spec-driven development system，主要面向 Claude Code，也扩展到其他 Agent Runtime。

可以把它理解成：

> 给 AI Agent 配一套“项目经理 + 上下文管理员 + 任务拆解器”。

它的核心思想大概是：

1. 不要让 Agent 直接从一句话需求跳到代码。
    先把需求变成规格、计划、任务。
2. 不要让一个长会话无限膨胀。
    大任务会让上下文污染、遗忘、混淆，所以要拆成更小的执行单元。
3. 让 Agent 有明确的“当前任务边界”。
    每次只处理一个 atomic task，减少乱改、跑偏、越权重构。
4. 让文档、计划、任务成为执行轨道。
    Agent 不是凭感觉写，而是围绕 spec/plan/tasks 推进。

所以 GSD 的价值主要在这些场景：

| 场景                  | GSD 的价值             |
| --------------------- | ---------------------- |
| 大型 brownfield 项目  | 降低上下文失控         |
| 多文件重构            | 明确任务边界           |
| 长时间 Agent 开发     | 避免会话后期“脑子变糊” |
| 从需求到实现          | 强制先形成 spec/plan   |
| 多 Agent 或子任务并行 | 更容易分派任务         |

它不是单纯的“提示词模板”，更像一个 SDD + context engineering 的执行框架。GitHub Spec Kit 对 SDD 的定义是“把规格放在 AI-assisted software development 的中心，先定义要构建什么，再通过结构化阶段细化并让 Agent 实现”，GSD 和这个思想高度相关，但更偏 Agent 执行和上下文治理。

------

## 3. Superpowers 是什么？

Superpowers 的官方描述是：一个面向 coding agents 的完整软件开发方法论，建立在一组可组合的 skills 和初始指令之上，确保 Agent 会使用这些 skills。它支持 Claude Code、Codex CLI、Gemini CLI、OpenCode、Cursor、GitHub Copilot CLI 等多种环境。

可以把它理解成：

> 给 AI Agent 装一套“工程师行为准则 + 技能库”。

它关心的不是“把任务拆成多少块”，而是：

- 做需求前要不要先澄清？
- 写代码前要不要先设计？
- 改 bug 前要不要先复现？
- 写功能前要不要先写测试？
- 实现后要不要跑验证？
- 遇到不确定问题要不要先调查？
- 修改时要不要避免无关重构？

Superpowers 的关键概念是 skills。这些 skills 通常是 Markdown 形式的流程说明，让 Agent 在特定场景下调用。例如：

| Skill 类型   | 约束 Agent 做什么          |
| ------------ | -------------------------- |
| Planning     | 先理解问题、分解步骤       |
| TDD          | 先写失败测试，再实现       |
| Debugging    | 先复现、定位、验证         |
| Verification | 不要只“认为可以”，要跑检查 |
| Design       | 大改动前先形成设计         |
| Review       | 检查风险、边界、回归       |

所以 Superpowers 的核心不是“更强大的能力”，而是 让 Agent 少犯工程流程错误。

这点很重要：
 Superpowers 不会让模型本身更聪明，但会减少它“聪明反被聪明误”的概率。

------

## 4. 核心差异：GSD 偏执行系统，Superpowers 偏行为规范

| 维度     | GSD                                   | Superpowers                                |
| -------- | ------------------------------------- | ------------------------------------------ |
| 核心问题 | 长任务上下文失控、任务边界模糊        | Agent 跳步骤、不验证、工程纪律差           |
| 主要手段 | spec、plan、task、context engineering | skills、methodology、workflow instructions |
| 更像什么 | 项目执行系统                          | 工程方法论/技能库                          |
| 控制对象 | 上下文、任务、执行单元                | 行为、步骤、质量习惯                       |
| 适合任务 | 大功能、多文件改造、复杂重构          | TDD、debug、review、设计、验证             |
| 典型收益 | 不容易做着做着忘了大目标              | 不容易跳过测试、调查和验证                 |
| 典型代价 | 前期拆解和维护 spec 有成本            | 流程感强，可能显得“啰嗦”                   |
| 最大风险 | spec 写错会导致稳定地做错             | skill 过多会增加仪式感                     |

我的判断是：

GSD 解决“做完”的问题；Superpowers 解决“做对”的问题。

------

## 5. 举个例子：实现“给博客系统加评论功能”

### 不用框架的 Agent 可能这样做

你说：“帮我加评论功能。”

Agent 可能直接开始改数据库、写 API、写前端、顺手改样式、加一些你没要求的东西，最后告诉你完成了，但没有 migration、没有鉴权边界、没有测试，甚至接口风格和项目不一致。

### 用 GSD 的方式

GSD 更可能先把事情拆成：

1. 需求规格：评论功能包含什么、不包含什么。
2. 数据模型：Post、Comment、User 的关系。
3. API 设计：创建、删除、分页查询。
4. 权限规则：谁能评论，谁能删除。
5. 任务列表：
   - 添加 Comment schema
   - 添加 migration
   - 添加 API route
   - 添加前端组件
   - 添加测试
   - 更新文档

然后 Agent 按任务逐步执行。

重点是：把“一个大需求”变成“可控任务轨道”。

### 用 Superpowers 的方式

Superpowers 更可能要求 Agent：

1. 先理解现有架构。
2. 如果不确定，先调查现有 auth/data pattern。
3. 写测试或至少定义验证方式。
4. 实现最小变更。
5. 跑测试、lint、typecheck。
6. 复盘是否有边界遗漏。

重点是：每一步都按工程纪律来，不要直接莽代码。

### 两者合用

最理想的组合是：

- GSD 负责把评论功能拆成 spec/plan/tasks。
- Superpowers 负责每个 task 的实现质量，比如 TDD、debug、verification、review。

也就是：

> GSD 给任务地图，Superpowers 给执行动作标准。

------

## 6. 和 GitHub Spec Kit 的比较

GitHub Spec Kit 是一个官方开源的 SDD 工具包，目标是帮助开发者用 AI Agent 做 Spec-Driven Development：先定义要构建什么，再通过结构化阶段细化并实现。

| 维度     | GitHub Spec Kit       | GSD                                        | Superpowers           |
| -------- | --------------------- | ------------------------------------------ | --------------------- |
| 核心定位 | 标准化 SDD 工具包     | SDD + context engineering + Agent 执行系统 | Agent skills 方法论   |
| 重点产物 | spec、plan、tasks     | spec、plan、tasks、上下文边界              | skills、流程指令      |
| 风格     | 更正式、更规范        | 更偏实战执行                               | 更偏工程习惯          |
| 适合     | 团队希望统一 SDD 流程 | 个人/团队想让 Agent 长任务不跑偏           | 想提升 Agent 工程质量 |
| 局限     | 可能显得流程重        | 依赖好的任务拆解                           | 不能替代 spec 管理    |

可以这样选：

- 你想建立团队级 SDD 标准：优先看 Spec Kit。
- 你想让 Claude Code/Cursor 更稳地干活：看 GSD。
- 你想让 Agent 不再跳过测试、验证、调研：看 Superpowers。

------

## 7. 和 OpenSpec 的比较

OpenSpec 也是 SDD 方向的工具，偏向用 schema、规范化结构和可扩展工作流来描述需求与变更；其仓库强调 community schemas 和与其他工具的集成。

| 维度 | OpenSpec                      | GSD / Superpowers       |
| ---- | ----------------------------- | ----------------------- |
| 核心 | 规格结构化、schema 化         | Agent 工作流约束        |
| 更像 | 规范格式/协议层               | 执行方法/操作层         |
| 优点 | 适合沉淀长期规范              | 适合驱动 Agent 实际干活 |
| 局限 | 不一定解决 Agent 执行过程问题 | 规范本身未必足够标准化  |

OpenSpec 更像“规格怎么写得标准”，GSD/Superpowers 更像“Agent 怎么按照规格和流程干活”。

------

## 8. 和 Task Master AI 的比较

Task Master 是一个 AI-driven development 的任务管理系统，文档和仓库都强调从 PRD 解析任务、列任务、选下一个任务、扩展子任务、管理依赖等能力。

| 维度 | Task Master            | GSD                   | Superpowers            |
| ---- | ---------------------- | --------------------- | ---------------------- |
| 核心 | 任务管理               | 任务执行 + 上下文工程 | 工程技能/流程纪律      |
| 输入 | PRD、任务列表          | spec、plan、task      | 当前开发场景           |
| 输出 | task graph / next task | 可执行开发轨道        | 更规范的执行行为       |
| 适合 | 项目任务拆分和追踪     | 长任务 Agent 执行     | 提升代码质量和验证习惯 |

Task Master 更像“AI 项目看板”；GSD 更像“Agent 执行系统”；Superpowers 更像“Agent 工程训练手册”。

------

## 9. 和 gstack / SuperClaude 这类框架的比较

gstack 的 README 描述它是把 Claude Code 变成一个“虚拟工程团队”：CEO、工程经理、设计师、QA、安全官、发布工程师等角色，以及一组 slash commands。

SuperClaude 则是通过 specialized commands、cognitive personas 和 development methodologies 来增强 Claude Code。

| 框架        | 更偏向                                     |
| ----------- | ------------------------------------------ |
| GSD         | 执行系统、上下文工程、spec-driven tasks    |
| Superpowers | skills、TDD、debug、verification、工程纪律 |
| gstack      | 多角色虚拟团队、产品/设计/发布视角         |
| SuperClaude | persona、commands、开发方法增强            |
| Spec Kit    | 标准 SDD 流程                              |
| Task Master | AI 任务管理                                |

简单说：

- GSD：把任务做完。
- Superpowers：把过程做规范。
- gstack：让 Agent 像一个创业团队/工程团队一样分角色思考。
- SuperClaude：给 Claude Code 加命令、角色和方法论。
- Spec Kit：把规格驱动开发制度化。
- Task Master：把任务拆分、排队、追踪。

------

## 10. 和传统开发规范的比较

### 10.1 和 TDD 比

TDD 是传统工程方法：先写失败测试，再实现，再重构。Superpowers 很适合承载 TDD，因为它可以提醒 Agent 不要直接写实现。

但 TDD 只解决“验证驱动实现”，不解决：

- Agent 上下文污染；
- 大任务拆分；
- 多文件长期执行；
- spec 和任务管理。

所以：

> TDD 是局部开发方法；GSD/Superpowers 是 Agent 工作流约束。

### 10.2 和 BDD 比

BDD 强调用业务行为描述需求，比如 Given / When / Then。

BDD 适合表达用户行为和验收标准；GSD 的 spec 可以吸收 BDD 的写法；Superpowers 可以要求 Agent 根据 BDD 场景写测试。

但 BDD 本身不会告诉 Agent 怎么管理上下文、怎么分任务、什么时候调研。

### 10.3 和 ADR / RFC 比

ADR 是 Architecture Decision Record，记录架构决策。RFC 是设计提案/评审文档。

它们适合沉淀“为什么这样设计”。

GSD 可以把 ADR/RFC 作为 spec 的一部分；Superpowers 可以要求大改动前先产出 design 或 decision record。

但 ADR/RFC 本身不是 Agent 执行框架。

### 10.4 和 OpenAPI / JSON Schema 比

OpenAPI、JSON Schema 是更严格的机器可读契约。

它们比 GSD/Superpowers 更“硬”：

- 字段类型明确；
- API 输入输出明确；
- 可以生成代码；
- 可以自动校验。

但它们范围很窄，主要管 API 或数据结构。GSD/Superpowers 管的是更上层的开发过程。

### 10.5 和 ESLint / Prettier / Conventional Commits 比

这些是工具级规范：

- ESLint 管代码规则；
- Prettier 管格式；
- Conventional Commits 管提交信息。

它们的优势是可以机器强制执行。
 GSD/Superpowers 的优势是可以约束 Agent 的思考和行动。

最好的实践不是二选一，而是组合：

> 用 GSD/Superpowers 管 Agent 行为，用 ESLint/TypeScript/tests/CI 管最终结果。

------

## 11. 什么时候用 GSD？什么时候用 Superpowers？

### 更适合 GSD 的情况

你可以优先用 GSD，如果你经常遇到：

- Agent 做到一半忘记目标；
- 大功能越做越乱；
- 一个需求涉及很多文件；
- 你希望从需求自动生成 spec/plan/tasks；
- 你想让 Agent 长时间自主推进；
- 你在大型旧项目里让 Agent 改代码。

### 更适合 Superpowers 的情况

你可以优先用 Superpowers，如果你经常遇到：

- Agent 不写测试；
- Agent 不跑验证；
- Agent debug 时乱猜；
- Agent 上来就改代码；
- Agent 不先读现有实现；
- Agent 完成后没有质量检查；
- 你想强制它按 TDD、debug、review、verification 流程走。

### 两者都用的情况

如果你做的是中大型项目，我会更建议组合：

- GSD 负责需求拆解和任务轨道；
- Superpowers 负责每个任务的工程纪律；
- CI/tests/typecheck/lint 负责最终硬校验。

------

## 12. 我的建议：别把它们当“魔法”，要当“刹车系统”

很多人装了 GSD 或 Superpowers 后会期待 Agent 变强很多。更准确地说，它们不是发动机，而是：

- 方向盘；
- 刹车；
- 车道线；
- 仪表盘；
- 检查清单。

它们的价值不是让 AI “凭空会更多”，而是让 AI 少乱来、少遗忘、少跳步、少自信胡说。

但也有代价：

| 问题               | 说明                                |
| ------------------ | ----------------------------------- |
| 仪式感增加         | 小任务可能反而变慢                  |
| 维护成本           | spec/skills/rules 需要更新          |
| 错误规范会放大错误 | spec 写错，Agent 会稳定执行错误方向 |
| 不等于验证         | 仍然需要测试、CI、review            |
| 不适合所有任务     | 一行 bug fix 不一定需要完整流程     |

所以我的实际建议是：

小任务：直接用 Agent + tests。
 中任务：Superpowers 约束流程。
 大任务：GSD 做拆解，Superpowers 做执行纪律。
 团队项目：再叠加 Spec Kit / ADR / CI / lint / typecheck。

------

## 13. 最简心智模型

你可以这样记：

| 名称                | 一句话                            |
| ------------------- | --------------------------------- |
| GSD                 | 给 Agent 一个“任务执行系统”       |
| Superpowers         | 给 Agent 一套“工程技能和纪律”     |
| Spec Kit            | 给团队一套“规格驱动开发流程”      |
| OpenSpec            | 给规格一套“结构化表达方式”        |
| Task Master         | 给 AI 开发一套“任务管理系统”      |
| gstack              | 给 Claude Code 一支“虚拟工程团队” |
| TDD/BDD/ADR/OpenAPI | 传统工程规范，可被上述框架吸收    |

最终推荐组合：

> Spec/ADR 定方向，GSD 拆任务，Superpowers 管过程，tests/CI 管结果。
