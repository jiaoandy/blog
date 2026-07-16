# 个人博客

基于 [Eleventy (11ty)](https://www.11ty.dev/) 构建的个人博客，托管在 GitHub Pages。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载，默认 http://localhost:8080）
npm run dev

# 构建生产版本（输出到 _site/）
npm run build
```

## 目录结构

```
src/
├── _data/            # 全局配置（site.json, navigation.json, theme.json, ...）
├── _includes/
│   ├── layouts/      # 布局模板（base, post, page, tag）
│   │── components/   # 可复用组件（article-card, tag-badge, pagination, ...）
│   └── modules/      # 自定义模块（recent-posts 等）
├── assets/           # 静态资源（CSS, JS, images）
├── posts/            # 博客文章（Markdown）
├── pages/            # 静态页面（关于等）
├── tags/             # 标签模板
└── index.njk         # 首页
```

## 写文章

在 `src/posts/` 目录下创建 `.md` 文件，使用 YAML frontmatter：

```markdown
---
title: "文章标题"
date: 2024-01-01
tags: ["tag1", "tag2"]
description: "文章摘要"
---

正文内容...
```

文件名建议格式：`YYYY-MM-DD-slug.md`，程序会自动按日期排序。

## 配置

所有站点配置集中在 `src/_data/` 目录的 JSON 文件中：

| 文件 | 说明 |
|------|------|
| `site.json` | 站点标题、描述、URL、作者、每页文章数、日期格式 |
| `navigation.json` | 导航菜单结构 |
| `theme.json` | 主题颜色、字体、组件显示开关 |
| `social.json` | 社交媒体链接 |
| `modules.json` | 模块启用/禁用及配置 |

修改 JSON 文件即可全局生效，无需修改模板代码。

## 自定义模块

模块位于 `src/_includes/modules/<name>/`，每个模块包含：

1. `<name>.njk` — 模板文件
2. 在 `modules.json` 中注册并启用

参考示例：`src/_includes/modules/recent-posts/`

## 部署

推送代码到 `main` 分支，GitHub Actions 自动构建并部署到 GitHub Pages。

首次部署需在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。
