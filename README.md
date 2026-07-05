# jesseliu 个人博客

这是 jesseliu 的静态个人博客，内容方向与个人主页保持一致。

## 本地预览

由于 `file://` 预览不能稳定读取 `posts/*.md`，建议在本目录启动一个本地静态服务：

```bash
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080
```

## 写一篇新文章

1. 在 `posts/` 目录新建一个 Markdown 文件，例如 `my-first-note.md`
2. 在文件顶部添加 front matter
3. 把文件名加入 `posts/index.json`
4. 提交并推送到 GitHub

模板：

~~~markdown
---
title: "我的第一篇文章"
date: "2026-05-06"
readTime: "5 分钟"
tags: ["技术"]
theme: ["#5e41d0", "#2869e6", "#f5f6fa"]
cover: "./assets/images/covers/my-first-note.png"
excerpt: "这是一段会显示在首页卡片里的摘要。"
---

## 第一节

这里写正文。

```js
console.log("hello note")
```
~~~

`posts/index.json` 示例：

```json
{
  "posts": [
    "my-first-note.md"
  ]
}
```

## 修改站点资料

站点名称、个人介绍、GitHub 链接、邮箱和头像路径在 `profile/index.json` 里。

个人头像放在 `assets/images/avatar/`，文章封面放在 `assets/images/covers/`。新文章可以在 front matter 里用 `cover` 指定封面路径；不指定时页面仍会生成兜底封面。

正文配图放在 `assets/images/posts/文章-slug/`。例如 `posts/my-first-note.md` 的正文图片放在 `assets/images/posts/my-first-note/`，Markdown 中这样引用：

```markdown
![正文配图](./assets/images/posts/my-first-note/example.png)
```

图片单独成段时会自动居中显示，并把 `alt` 文案作为图注；行内图片仍按普通 Markdown 图片渲染。

文章分类请在 front matter 的 `tags` 里维护，页面会自动生成筛选标签。

## 安全维护

页面已添加基础 Content Security Policy。仓库不应提交 `.env`、日志、构建目录和依赖目录；`.gitignore` 已覆盖这些路径。

发现安全问题时，请按 `SECURITY.md` 中的方式私下反馈。

## 发布到 GitHub Pages

1. 把这些文件保留在 GitHub Pages 仓库根目录
2. 推送到 `main` 分支
3. 在 GitHub 打开 `Settings -> Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main / root`

线上地址：

```text
https://jesseliu26.cn
```
