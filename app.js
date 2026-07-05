let site = {
  name: "jesseliu",
  mark: "JL",
  avatarMark: "JL",
  subtitle: "Something for nothing。",
  title: "Talk is cheap,\nShow me the code.",
  githubUrl: "https://github.com/jesseliu26",
  email: "jesseliu26@gmail.com",
  avatar: "./assets/images/avatar/profile.png",
  deployment: "已上线",
};

const tagAliases = {
  "\u601d\u60f3": "札记",
};

const state = {
  query: "",
  tag: "全部",
  posts: [],
  loading: true,
  error: "",
};

const view = document.querySelector("#view");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const postCount = document.querySelector("#postCount");
const tagCount = document.querySelector("#tagCount");
const avatarImage = document.querySelector("#avatarImage");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function decodeBasicEntities(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");
}

function sanitizeUrl(value) {
  const url = String(value || "").trim();
  if (!url || /[\u0000-\u001f\u007f]/.test(url)) return "#";
  if (url.startsWith("//")) return "#";
  if (/^(https?:|mailto:|#|\.\/|\.\.\/|\/)/i.test(url)) return url;
  return "#";
}

function isSafePostFile(file) {
  const name = String(file || "").trim();
  return (
    Boolean(name) &&
    /\.md$/i.test(name) &&
    !name.includes("/") &&
    !name.includes("\\") &&
    !name.includes("..") &&
    !/[\u0000-\u001f\u007f]/.test(name)
  );
}

function postFileUrl(file) {
  return `./posts/${encodeURIComponent(file)}`;
}

function getTextValue(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeSiteProfile(data) {
  const source = data && typeof data === "object" ? data.site || data : {};
  return {
    name: getTextValue(source.name, site.name),
    mark: getTextValue(source.mark, site.mark),
    avatarMark: getTextValue(source.avatarMark, source.mark || site.avatarMark),
    subtitle: getTextValue(source.subtitle, site.subtitle),
    title: getTextValue(source.title, site.title),
    githubUrl: getTextValue(source.githubUrl, site.githubUrl),
    email: getTextValue(source.email, site.email),
    avatar: getTextValue(source.avatar, site.avatar),
    deployment: getTextValue(source.deployment, site.deployment),
  };
}

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return trimmed.replace(/^["']|["']$/g, "");
}

function normalizeTag(tag) {
  const text = String(tag || "").trim();
  return tagAliases[text] || text;
}

function parseFrontmatter(markdown, file) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = {};
  let body = normalized;

  if (match) {
    body = normalized.slice(match[0].length);
    match[1].split("\n").forEach((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1);
      meta[key] = parseValue(value);
    });
  }

  const slug = meta.slug || file.replace(/\.md$/i, "");
  const plainText = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`[\]()-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    readTime: meta.readTime || `${Math.max(1, Math.round(plainText.length / 500))} 分钟`,
    tags: Array.isArray(meta.tags) ? meta.tags.map(normalizeTag).filter(Boolean) : [],
    theme: Array.isArray(meta.theme) ? meta.theme : ["#5e41d0", "#2869e6", "#f5f6fa"],
    cover: meta.cover || "",
    excerpt: meta.excerpt || plainText.slice(0, 120),
    draft: Boolean(meta.draft),
    file,
    body,
  };
}

async function fetchText(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.text();
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

async function loadCustomContent() {
  try {
    site = normalizeSiteProfile(await fetchJson("./profile/index.json"));
  } catch {
    // Keep the built-in profile when the optional profile file is unavailable.
  }
}

async function loadMarkdownPosts() {
  try {
    const manifestResponse = await fetch("./posts/index.json", { cache: "no-store" });
    if (!manifestResponse.ok) throw new Error("posts/index.json 读取失败");
    const manifest = await manifestResponse.json();
    const files = (Array.isArray(manifest.posts) ? manifest.posts : []).filter(isSafePostFile);
    const posts = await Promise.all(
      files.map(async (file) => {
        const markdown = await fetchText(postFileUrl(file));
        return parseFrontmatter(markdown, file);
      })
    );

    state.posts = posts
      .filter((post) => !post.draft)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    state.error = "";
  } catch (error) {
    state.posts = [];
    state.error =
      location.protocol === "file:"
        ? "当前是 file:// 预览，浏览器不能稳定读取 posts 目录。请使用本地服务或 GitHub Pages 访问。"
        : `Markdown 加载失败：${error.message}`;
  } finally {
    state.loading = false;
    updateStats();
    render();
  }
}

function getAllTags() {
  const tags = ["全部"];
  const seen = new Set(tags);
  state.posts.forEach((post) => {
    post.tags.map(normalizeTag).forEach((tag) => {
      if (!tag || seen.has(tag)) return;
      seen.add(tag);
      tags.push(tag);
    });
  });
  return tags;
}

function getFilteredPosts() {
  const query = state.query.trim().toLowerCase();
  const activeTag = normalizeTag(state.tag);
  return state.posts.filter((post) => {
    const postTags = post.tags.map(normalizeTag);
    const matchesTag = activeTag === "全部" || postTags.includes(activeTag);
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.body}`.toLowerCase();
    return matchesTag && (!query || haystack.includes(query));
  });
}

function renderInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const image = parseImageMarkdown(`![${decodeBasicEntities(alt)}](${decodeBasicEntities(src)})`) || {
      alt: decodeBasicEntities(alt),
      src: decodeBasicEntities(src),
    };
    return renderImageElement(image);
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    return `<a href="${escapeAttribute(
      sanitizeUrl(decodeBasicEntities(href))
    )}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function parseImageMarkdown(text) {
  const match = text.trim().match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
  if (!match) return null;
  return {
    alt: match[1].trim(),
    src: match[2].trim(),
    title: (match[3] || "").trim(),
  };
}

function renderImageElement(image, className = "") {
  const title = image.title ? ` title="${escapeAttribute(image.title)}"` : "";
  const classAttribute = className ? ` class="${escapeAttribute(className)}"` : "";
  return `<img${classAttribute} src="${escapeAttribute(sanitizeUrl(image.src))}" alt="${escapeAttribute(
    image.alt
  )}" loading="lazy" decoding="async"${title} />`;
}

function renderImageFigure(image) {
  const caption = image.title || image.alt;
  return `
    <figure class="article-image">
      ${renderImageElement(image, "article-image-media")}
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const toc = [];
  let index = 0;
  let headingIndex = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const language = fence[1] || "text";
      const code = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(
        `<pre><code data-language="${escapeAttribute(language)}">${escapeHtml(code.join("\n"))}</code></pre>`
      );
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      headingIndex += 1;
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = `section-${headingIndex}`;
      toc.push({ id, text, level });
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${quote.map((item) => `<p>${renderInline(item)}</p>`).join("")}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ""));
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^#{2,3}\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    const paragraphText = paragraph.join(" ");
    const image = parseImageMarkdown(paragraphText);
    html.push(image ? renderImageFigure(image) : `<p>${renderInline(paragraphText)}</p>`);
  }

  return { html: html.join(""), toc };
}

function makeCover(post, wide = false, showText = true) {
  const canvas = document.createElement("canvas");
  canvas.width = wide ? 1400 : 920;
  canvas.height = wide ? 620 : 520;
  const ctx = canvas.getContext("2d");
  const [a, b, c] = post.theme;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, a || "#5e41d0");
  gradient.addColorStop(0.58, b || "#2869e6");
  gradient.addColorStop(1, c || "#f5f6fa");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  for (let x = -canvas.height; x < canvas.width; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + canvas.height, canvas.height);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(42, 42, canvas.width - 84, canvas.height - 84);

  if (!showText) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = a || "#5e41d0";
    ctx.fillRect(72, 78, canvas.width * 0.42, 16);
    ctx.fillRect(72, 116, canvas.width * 0.3, 16);
    ctx.fillStyle = b || "#2869e6";
    ctx.fillRect(canvas.width - 360, canvas.height - 150, 288, 18);
    ctx.fillRect(canvas.width - 260, canvas.height - 108, 188, 18);
    ctx.globalAlpha = 1;
    return canvas.toDataURL("image/png");
  }

  ctx.fillStyle = a || "#5e41d0";
  ctx.font = "700 28px 'JetBrains Mono', monospace";
  ctx.fillText(site.name.toUpperCase(), 72, 102);

  ctx.fillStyle = "#27262b";
  ctx.font = wide ? "800 64px 'JetBrains Mono', monospace" : "800 46px 'JetBrains Mono', monospace";
  wrapText(ctx, post.title, 72, wide ? 210 : 190, canvas.width - 150, wide ? 74 : 58);

  ctx.fillStyle = "#5c5962";
  ctx.font = "400 24px 'JetBrains Mono', monospace";
  ctx.fillText(`${post.date} / ${post.readTime}`, 72, canvas.height - 86);

  return canvas.toDataURL("image/png");
}

function makeAvatar() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 900, 560);
  gradient.addColorStop(0, "#381885");
  gradient.addColorStop(0.52, "#7253ed");
  gradient.addColorStop(1, "#2869e6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 560);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let y = 60; y < 520; y += 56) {
    for (let x = 70; x < 840; x += 88) {
      ctx.fillRect(x, y, 34, 3);
      ctx.fillRect(x, y + 16, 56, 3);
      ctx.fillRect(x, y + 32, 42, 3);
    }
  }

  ctx.fillStyle = "rgba(248,250,249,0.94)";
  ctx.fillRect(72, 86, 756, 388);
  ctx.fillStyle = "#27262b";
  ctx.font = "800 76px 'JetBrains Mono', monospace";
  ctx.fillText(site.avatarMark, 116, 205);
  ctx.font = "700 34px 'JetBrains Mono', monospace";
  ctx.fillText("技术 / 札记", 116, 278);
  ctx.fillStyle = "#5c5962";
  ctx.font = "400 26px 'JetBrains Mono', monospace";
  ctx.fillText("先活下来，再优化", 116, 338);

  return canvas.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split("");
  let line = "";
  let lineCount = 0;
  for (const word of words) {
    const nextLine = line + word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount += 1;
    } else {
      line = nextLine;
    }
  }
  ctx.fillText(line, x, y + lineCount * lineHeight);
}

function getTagHref(tag) {
  const normalized = normalizeTag(tag);
  return normalized === "全部" ? "#/" : `#/tag/${encodeURIComponent(normalized)}`;
}

function getPostCover(post, wide = false, showText = true) {
  const cover = sanitizeUrl(post.cover);
  return cover && cover !== "#" ? cover : makeCover(post, wide, showText);
}

function bindCoverFallbacks() {
  document.querySelectorAll("[data-cover-slug]").forEach((image) => {
    image.addEventListener("error", () => {
      const post = state.posts.find((item) => item.slug === image.dataset.coverSlug);
      if (!post || image.dataset.coverFallbackApplied === "true") return;
      image.dataset.coverFallbackApplied = "true";
      image.src = makeCover(post, image.dataset.coverWide === "true", image.dataset.coverText !== "false");
    });
  });
}

function postCard(post) {
  return `
    <a class="post-card" href="#/post/${escapeAttribute(encodeURIComponent(post.slug))}">
      <img
        class="post-cover"
        src="${escapeAttribute(getPostCover(post, false, false))}"
        alt="${escapeAttribute(post.title)}封面"
        data-cover-slug="${escapeAttribute(post.slug)}"
        data-cover-wide="false"
        data-cover-text="false"
      />
      <div class="post-body">
        <div class="meta-row">
          <span>${escapeHtml(post.date)}</span>
          <span>${escapeHtml(post.readTime)}</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="tag-row">
          ${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </a>
  `;
}

function renderHome() {
  const filtered = getFilteredPosts();
  const allTags = getAllTags();
  const title = state.tag === "全部" ? "全部文章" : `${state.tag}文章`;
  view.innerHTML = `
    ${state.error ? `<div class="notice">${escapeHtml(state.error)}</div>` : ""}

    <h2 class="section-title">${escapeHtml(title)}</h2>
    <div class="toolbar">
      <label class="search-box">
        <span>搜索</span>
        <input id="searchInput" type="search" placeholder="文章、标签、关键词" value="${escapeAttribute(state.query)}" />
      </label>
      <div class="filter-row" aria-label="标签筛选">
        ${allTags
          .map(
            (tag) =>
              `<a class="chip ${normalizeTag(tag) === normalizeTag(state.tag) ? "active" : ""}" href="${escapeAttribute(getTagHref(tag))}">${escapeHtml(tag)}</a>`
          )
          .join("")}
      </div>
    </div>

    ${
      filtered.length
        ? `<section class="post-grid">${filtered.map(postCard).join("")}</section>`
        : `<div class="empty-state">没有找到匹配的文章，换个关键词试试。</div>`
    }

  `;

  bindCoverFallbacks();

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderHome();
  });

}

function renderPost(slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post) {
    view.innerHTML = `
      <a class="back-link" href="#/">返回全部</a>
      <div class="empty-state">没有找到这篇文章。</div>
    `;
    return;
  }

  const rendered = renderMarkdown(post.body);
  view.innerHTML = `
    <a class="back-link" href="#/">返回全部</a>
    <section class="article-head">
      <div class="meta-row">
        <span>${escapeHtml(post.date)}</span>
        <span>${escapeHtml(post.readTime)}</span>
        <span>${escapeHtml(post.file)}</span>
      </div>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.excerpt)}</p>
      <div class="tag-row">
        ${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <img
        class="article-cover"
        src="${escapeAttribute(getPostCover(post, true))}"
        alt="${escapeAttribute(post.title)}封面"
        data-cover-slug="${escapeAttribute(post.slug)}"
        data-cover-wide="true"
        data-cover-text="true"
      />
    </section>

    <div class="article-layout">
      <article class="article-content">
        ${rendered.html}
      </article>
      <aside class="toc" aria-label="文章目录">
        <strong>目录</strong>
        ${
          rendered.toc.length
            ? rendered.toc
                .map((item) => `<a class="toc-level-${item.level}" href="#${item.id}">${escapeHtml(item.text)}</a>`)
                .join("")
            : `<span class="toc-empty">这篇文章还没有二级标题。</span>`
        }
      </aside>
    </div>
  `;
  bindCoverFallbacks();
}

function renderFallbackRoute() {
  state.tag = "全部";
  renderHome();
}

function renderLoading() {
  view.innerHTML = `<div class="empty-state">正在读取 Markdown 文章...</div>`;
}

function render() {
  if (state.loading) {
    renderLoading();
    return;
  }

  const hash = window.location.hash.replace(/^#\/?/, "");
  const [route, rawSlug] = hash.split("/");
  let slug = rawSlug || "";
  try {
    slug = decodeURIComponent(slug);
  } catch {
    slug = "";
  }

  if (route === "post") renderPost(slug);
  else if (route === "tag") {
    state.tag = normalizeTag(slug || "全部");
    renderHome();
  } else if (route === "") {
    state.tag = "全部";
    renderHome();
  } else {
    renderFallbackRoute();
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function updateStats() {
  postCount.textContent = state.posts.length;
  tagCount.textContent = Math.max(0, getAllTags().length - 1);
}

function hydrateShell() {
  document.title = `${site.name} | 个人博客`;
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription && site.description) metaDescription.setAttribute("content", site.description);
  document.querySelector("#brandName").textContent = site.name;
  document.querySelector("#brandSubtitle").textContent = site.subtitle;
  document.querySelector("#profileTitle").textContent = site.title;
  document.querySelector("#githubLink").setAttribute("href", sanitizeUrl(site.githubUrl));
  document.querySelector("#githubLink").textContent = `GitHub: ${site.githubUrl}`;
  document.querySelector("#emailLink").setAttribute("href", sanitizeUrl(`mailto:${site.email}`));
  document.querySelector("#emailLink").textContent = `Email: ${site.email}`;
  document.querySelector(".brand-mark").textContent = site.mark;
  document.querySelector("#deploymentStatus").textContent = site.deployment;
  avatarImage.alt = `${site.name} 个人头像`;
  avatarImage.addEventListener(
    "error",
    () => {
      avatarImage.src = makeAvatar();
    },
    { once: true }
  );
  avatarImage.src = sanitizeUrl(site.avatar) !== "#" ? sanitizeUrl(site.avatar) : makeAvatar();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "亮" : "暗";
  try {
    localStorage.setItem("blog-theme", theme);
  } catch {
    // Some privacy modes disable localStorage; theme switching should still work.
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem("blog-theme");
  } catch {
    return "";
  }
}

function waitForFontAssets() {
  if (!document.fonts) return Promise.resolve();
  return Promise.all([
    document.fonts.load("400 16px 'JetBrains Mono'"),
    document.fonts.load("700 28px 'JetBrains Mono'"),
    document.fonts.load("800 64px 'JetBrains Mono'"),
  ]).catch(() => []);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
});

window.addEventListener("hashchange", render);

setTheme(getStoredTheme() || "light");
renderLoading();
waitForFontAssets().then(async () => {
  await loadCustomContent();
  hydrateShell();
  loadMarkdownPosts();
});
