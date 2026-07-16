---
title: "博客使用指南"
date: 2026-07-16
tags: ["tutorial", "技术"]
description: "本站的完整使用文档——从写文章、改配置到自定义模块和部署，一篇文章讲清楚。"
---

本博客基于静态站点生成器 [Eleventy (11ty)](https://www.11ty.dev/) 构建，托管在 GitHub Pages。零后端、零数据库，所有内容都是 Markdown 文件，所有配置都是 JSON。这份文档覆盖你所需的一切操作。

---

## 1. 快速开始

```bash
# 安装依赖（首次）
npm install

# 启动本地预览（保存即刷新，默认 http://localhost:8080）
npm run dev

# 构建生产版本（输出到 _site/ 目录）
npm run build
```

---

## 2. 写文章

在 `src/posts/` 目录下创建一个 `.md` 文件即可。**不需要任何注册步骤**——文件放进去就自动发布。

**文件名建议：** `YYYY-MM-DD-slug.md`，比如 `2026-07-16-hello-world.md`。

**最小示例：**

```markdown
---
title: "我的新文章"
date: 2026-07-16
tags: ["生活", "随笔"]
description: "一句话概括文章内容"
---

正文从这里开始...

## 二级标题

支持 **粗体**、*斜体*、`行内代码`、[链接](url)、图片等。

> 引用文字

- 列表项
- 列表项

```js
// 代码块
console.log("hello");
```
```

**Frontmatter 字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期（`YYYY-MM-DD` 格式） |
| `tags` | 否 | 标签数组，如 `["技术", "生活"]`，支持中文 |
| `description` | 否 | 摘要，用于首页卡片和 SEO |

---

## 3. 配置系统

所有站点设置都在 `src/_data/` 目录的 JSON 文件中。**修改 JSON 即生效，不需要改模板。**

### 3.1 站点身份 — `site.json`

```json
{
  "title": "My Blog",             // 站点名称
  "description": "...",           // 站点描述
  "url": "https://xxx.github.io", // 完整域名
  "author": { "name": "..." },    // 作者
  "postsPerPage": 5,             // 首页每页文章数
  "dateFormat": {
    "locale": "zh-CN",           // 日期语言
    "options": {                 // 格式选项
      "year": "numeric",
      "month": "long",
      "day": "numeric"
    }
  }
}
```

### 3.2 导航菜单 — `navigation.json`

```json
{
  "main": [
    { "label": "首页", "url": "/" },
    { "label": "标签", "url": "/tags/" },
    { "label": "关于", "url": "/about/" }
  ]
}
```

增删导航项只需编辑这个数组，模板自动渲染。

### 3.3 主题 — `theme.json`

```json
{
  "colors": {
    "primary": "#2563eb",         // 主色调（链接、标签、hover）
    "background": "#ffffff",       // 背景色
    "text": "#1e293b"             // 正文色
  },
  "fonts": {
    "body": "...",                // 正文字体
    "code": "..."                 // 代码字体
  },
  "showDateOnCards": true,        // 首页卡片是否显示日期
  "showTagsOnCards": true         // 首页卡片是否显示标签
}
```

### 3.4 社交链接 — `social.json`

```json
{
  "github": "https://github.com/username",
  "email": "you@example.com"
}
```

值为空字符串则页脚不显示对应链接。

### 3.5 配置级联机制

11ty 的核心设计是**数据级联**：全局 `_data/` → 目录级 `posts.json` → 文件级 frontmatter。例如 `posts.json` 设置：

```json
{ "layout": "layouts/post", "permalink": "/posts/{{ page.fileSlug }}/" }
```

这样 `posts/` 下所有文章自动获得相同的布局和 URL 结构，单篇文章无需重复声明。

---

## 4. 标签系统

**标签完全自动生成**——只要在文章 frontmatter 中写了 `tags`，系统就会：

1. 在每个标签页 `/tags/<标签名>/` 展示该标签下的所有文章
2. 在标签总览 `/tags/` 显示标签云（含文章计数）
3. 在文章卡片和文章页内渲染标签徽章

标签支持中文和英文，一个文章可以有多个标签。

---

## 5. 静态页面

在 `src/pages/` 目录下创建 `.md` 文件即可。例如"关于"页（`about.md`）：

```markdown
---
title: 关于
permalink: /about/
---

页面内容...
```

`permalink` 决定 URL。如果省略，11ty 会用文件路径生成。

---

## 6. 自定义模块

模块是博客的**扩展系统**——添加新功能而不动核心模板。

### 6.1 目录结构

```
src/_includes/modules/<模块名>/
  └── <模块名>.njk        # 模块模板
```

### 6.2 注册模块

在 `src/_data/modules.json` 中注册：

```json
{
  "myModule": {
    "enabled": true,
    "option1": "value1"
  }
}
```

### 6.3 引用模块

在任何布局中引入：

```njk
{% if modules.myModule.enabled %}
  {% include "modules/myModule/myModule.njk" %}
{% endif %}
```

### 6.4 内置参考：`recent-posts` 模块

内置了一个"最新文章"模块（位于 `src/_includes/modules/recent-posts/`），每篇文章底部展示最新 N 篇。配置方式：

```json
// modules.json
{
  "recentPosts": {
    "enabled": true,
    "count": 5
  }
}
```

设为 `false` 即可关闭，完全不需要删除文件或修改布局。

---

## 7. 模板系统速览

| 文件 | 角色 |
|------|------|
| `_includes/layouts/base.njk` | HTML 骨架，所有页面继承它 |
| `_includes/layouts/post.njk` | 文章页布局（日期 + 标签 + 正文） |
| `_includes/layouts/page.njk` | 静态页布局 |
| `_includes/layouts/tag.njk` | 标签页布局 |
| `_includes/components/article-card.njk` | 文章卡片（首页、标签页复用） |
| `_includes/components/tag-badge.njk` | 标签徽章 |
| `_includes/components/tag-list.njk` | 标签列表 |
| `_includes/components/pagination.njk` | 分页导航 |
| `_includes/components/header.njk` | 网站顶栏 |
| `_includes/components/footer.njk` | 网站底栏 |

---

## 8. 部署到 GitHub Pages

### 8.1 首次部署

1. 在 GitHub 上创建仓库（如 `blog` 或 `username.github.io`）
2. 进入仓库 **Settings → Pages → Build and deployment**
3. 将 **Source** 设为 **GitHub Actions**
4. 推送代码到 `main` 分支

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<用户名>/<仓库名>.git
git push -u origin main
```

### 8.2 自动部署

推送后，GitHub Actions 自动执行：

1. checkout 代码
2. `npm ci` 安装依赖
3. `npm run build` 构建站点
4. 部署到 `https://<用户名>.github.io`

整个流程在 `.github/workflows/deploy.yml` 中定义，无需额外配置。

### 8.3 后续更新

写完文章、调好配置后，只需：

```bash
git add .
git commit -m "新文章：xxx"
git push
```

GitHub Actions 自动构建部署，几分钟后生效。

---

## 9. 项目文件清单

```
blog/
├── .eleventy.js                  # 构建配置（集合、过滤器）
├── .github/workflows/deploy.yml  # 部署工作流
├── package.json                  # npm 脚本
├── src/
│   ├── _data/                    # ⭐ 全局配置
│   ├── _includes/
│   │   ├── layouts/              # 布局模板
│   │   ├── components/           # 可复用组件
│   │   └── modules/              # 自定义模块
│   ├── posts/                    # ⭐ 写文章的地方
│   ├── pages/                    # 静态页面
│   ├── tags/                     # 标签模板
│   └── assets/                   # CSS / JS / 图片
└── _site/                        # 构建输出（无需手动编辑）
```

---

## 10. 常见操作速查

| 操作 | 方法 |
|------|------|
| 写新文章 | 在 `src/posts/` 新建 `.md` 文件 |
| 改站点名 | 编辑 `src/_data/site.json` 的 `title` |
| 换主题色 | 编辑 `src/_data/theme.json` 的 `colors` |
| 加导航链接 | 编辑 `src/_data/navigation.json` |
| 开/关模块 | 编辑 `src/_data/modules.json` |
| 加新页面 | 在 `src/pages/` 新建 `.md` |
| 改布局 | 编辑 `src/_includes/layouts/` 下的模板 |
| 加新模块 | 在 `src/_includes/modules/` 新建目录 + modules.json 注册 |
| 本地预览 | `npm run dev` |
| 构建发布 | `git commit && git push` |

---

以上就是本博客的全部使用文档。从写文章到自定义模块，从调颜色到自动部署——**改 JSON 就是改网站，写 Markdown 就是发文章。**
