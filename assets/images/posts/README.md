# 文章正文图片

每篇文章使用一个与 Markdown 文件 slug 同名的子目录。例如：

```text
posts/my-first-note.md
assets/images/posts/my-first-note/example.png
```

正文中使用站点根目录路径引用：

```markdown
![正文配图](./assets/images/posts/my-first-note/example.png)
```

图片单独成段时，页面会把 `alt` 文案显示为图注。
