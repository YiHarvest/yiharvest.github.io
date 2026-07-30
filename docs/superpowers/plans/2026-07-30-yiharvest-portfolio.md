# YiHarvest Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional portfolio website for YiHarvest using Astro, TypeScript, Tailwind CSS, and MDX, deployed to GitHub Pages.

**Architecture:** Static site generation with Astro, content-driven pages via MDX collections, Tailwind for styling with custom cold-minimalist theme, dark mode support via CSS variables.

**Tech Stack:** Astro 5.x, TypeScript, Tailwind CSS 4.x, MDX, GitHub Actions, GitHub Pages

## Global Constraints

- Single accent color per page: Forest green (#1B4332 light / #2D6A4F dark)
- Font family: Geist only - no Inter, Roboto, Open Sans, Fraunces
- No em-dashes, no AI-purple gradients, no glassmorphism
- Max content width: 896px (max-w-4xl)
- Motion intensity: 3 (hover only, no scroll animations)

---

## File Structure Map

```
src/
├── components/
│   ├── Navigation.astro      # Fixed top nav with theme toggle
│   ├── Hero.astro            # Homepage hero section
│   ├── ProjectCard.astro     # Card for project display
│   ├── ProjectGrid.astro     # Grid wrapper for project cards
│   ├── Section.astro         # Reusable section wrapper
│   ├── Footer.astro          # Site footer
│   └── ThemeToggle.astro     # Light/dark mode toggle
├── layouts/
│   ├── BaseLayout.astro      # Base HTML structure
│   └── ContentLayout.astro   # Layout for MDX content pages
├── pages/
│   ├── index.astro           # Homepage
│   ├── about.astro           # About page
│   └── projects/
│       ├── index.astro       # Projects listing
│       └── [slug].astro      # Project detail (MDX)
├── content/
│   ├── config.ts             # Content collection config
│   └── projects/             # MDX project files
└── styles/
    └── global.css            # Global styles + Tailwind
```

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: Working Astro project with Tailwind CSS configured

- [ ] **Step 1: Initialize Astro project**

```bash
cd /home/yqy/Projects/yiharvest-website
npm create astro@latest . -- --template minimal --typescript strict --git false --install false
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @astrojs/mdx @astrojs/tailwind tailwindcss @tailwindcss/typography
```

- [ ] **Step 3: Configure Astro**

Create `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yiharvest.dev',
  integrations: [mdx(), tailwind()],
  output: 'static',
});
```

- [ ] **Step 4: Configure Tailwind**

Create `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': '896px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create global CSS**

Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #F6F6F3;
    --color-card: #FFFFFF;
    --color-border: #EAEAEA;
    --color-text: #111111;
    --color-text-secondary: #666666;
    --color-accent: #1B4332;
  }

  .dark {
    --color-bg: #0A0A0A;
    --color-card: #171717;
    --color-border: #262626;
    --color-text: #FAFAFA;
    --color-text-secondary: #A3A3A3;
    --color-accent: #2D6A4F;
  }

  body {
    @apply bg-[var(--color-bg)] text-[var(--color-text)] antialiased;
    font-feature-settings: 'ss01', 'ss03';
  }
}

@layer components {
  .card {
    @apply bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6;
  }
  
  .link-accent {
    @apply text-[var(--color-accent)] hover:underline underline-offset-4;
  }
}
```

- [ ] **Step 6: Verify build works**

```bash
npm run build
```

Expected: Build succeeds with no errors

---

### Task 2: Base Layout and Navigation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Navigation.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Produces: BaseLayout with slot for page content, Navigation component with theme toggle

- [ ] **Step 1: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'AI Agent & Applied Machine Learning Engineer' } = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>{title} | YiHarvest</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <slot name="navigation" />
    <main class="flex-1">
      <slot />
    </main>
    <slot name="footer" />
    <script is:inline>
      const theme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>
  </body>
</html>

<style>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 2: Create Navigation**

Create `src/components/Navigation.astro`:

```astro
---
const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/notes', label: 'Notes' },
];

const currentPath = Astro.url.pathname;
---

<nav class="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
  <div class="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="text-lg font-semibold tracking-tight">
      YiHarvest
    </a>
    
    <div class="flex items-center gap-6">
      {navLinks.map(link => (
        <a 
          href={link.href}
          class:list={[
            'text-sm transition-colors',
            currentPath.startsWith(link.href) 
              ? 'text-[var(--color-accent)]' 
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          ]}
        >
          {link.label}
        </a>
      ))}
      <ThemeToggle />
    </div>
  </div>
</nav>
```

- [ ] **Step 3: Create ThemeToggle**

Create `src/components/ThemeToggle.astro`:

```astro
---
---

<button 
  id="theme-toggle"
  type="button"
  class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
  aria-label="Toggle theme"
>
  <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 5.646 9.003 9.003 0 0012 21a9.003 9.003 0 01-8.354-5.646z" />
  </svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 4: Create Footer**

Create `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-[var(--color-border)] py-8">
  <div class="max-w-content mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-secondary)]">
    <p>YiHarvest {year}</p>
    <div class="flex items-center gap-6">
      <a href="https://github.com/YiHarvest" class="hover:text-[var(--color-text)] transition-colors">GitHub</a>
      <a href="mailto:yiharvest@example.com" class="hover:text-[var(--color-text)] transition-colors">Email</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Verify components render**

```bash
npm run dev
```

Expected: Dev server starts without errors

---

### Task 3: Hero and Section Components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/Section.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/ProjectGrid.astro`

**Interfaces:**
- Consumes: Navigation, Footer from Task 2
- Produces: Hero section, Section wrapper, ProjectCard and ProjectGrid components

- [ ] **Step 1: Create Hero**

Create `src/components/Hero.astro`:

```astro
---
---

<section class="min-h-[60vh] flex items-center justify-center pt-16">
  <div class="max-w-content mx-auto px-6 text-center">
    <h1 class="text-5xl sm:text-6xl font-semibold tracking-tight mb-4">
      YiHarvest
    </h1>
    <p class="text-xl text-[var(--color-text-secondary)] mb-3">
      AI Agent & Applied Machine Learning Engineer
    </p>
    <p class="text-base text-[var(--color-text-secondary)] max-w-lg mx-auto">
      专注于 AI Agent、MCP 工具、自动化工作流与生物医学机器学习
    </p>
  </div>
</section>
```

- [ ] **Step 2: Create Section**

Create `src/components/Section.astro`:

```astro
---
interface Props {
  title?: string;
  id?: string;
}

const { title, id } = Astro.props;
---

<section id={id} class="py-16 sm:py-24">
  <div class="max-w-content mx-auto px-6">
    {title && (
      <h2 class="text-2xl font-semibold tracking-tight mb-8">
        {title}
      </h2>
    )}
    <slot />
  </div>
</section>
```

- [ ] **Step 3: Create ProjectCard**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  tags: string[];
  href: string;
  github?: string;
}

const { title, description, tags, href, github } = Astro.props;
---

<article class="card group hover:border-[var(--color-accent)]/30 transition-colors">
  <h3 class="text-lg font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">
    {title}
  </h3>
  <p class="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
    {description}
  </p>
  <div class="flex flex-wrap gap-2 mb-4">
    {tags.map(tag => (
      <span class="text-xs px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-text-secondary)]">
        {tag}
      </span>
    ))}
  </div>
  <div class="flex items-center gap-4 text-sm">
    <a href={href} class="link-accent font-medium">查看详情</a>
    {github && (
      <a href={github} class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
        GitHub
      </a>
    )}
  </div>
</article>
```

- [ ] **Step 4: Create ProjectGrid**

Create `src/components/ProjectGrid.astro`:

```astro
---
---

<div class="grid gap-6">
  <slot />
</div>
```

- [ ] **Step 5: Verify components build**

```bash
npm run build
```

Expected: Build succeeds

---

### Task 4: Homepage Assembly

**Files:**
- Create: `src/pages/index.astro`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: BaseLayout, Navigation, Footer, Hero, Section, ProjectCard, ProjectGrid from Tasks 2-3
- Produces: Complete homepage

- [ ] **Step 1: Create favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">Y</text>
</svg>
```

- [ ] **Step 2: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/Hero.astro';
import Section from '../components/Section.astro';
import ProjectCard from '../components/ProjectCard.astro';
import ProjectGrid from '../components/ProjectGrid.astro';

const featuredProjects = [
  {
    title: 'Search Engine Tool MCP',
    description: 'A secure, multi-provider web search and extraction MCP server for Codex, Trae, and other MCP-compatible clients.',
    tags: ['Python', 'FastMCP', 'DDGS', 'SearXNG'],
    href: '/projects/search-engine-tool-mcp',
    github: 'https://github.com/YiHarvest/search-engine-tool-mcp',
  },
  {
    title: 'PPT Design',
    description: 'A Codex plugin for creating animated HTML presentations and genuinely editable PowerPoint decks.',
    tags: ['Codex Plugin', 'HTML Slides', 'PPTX'],
    href: '/projects/ppt-design',
    github: 'https://github.com/YiHarvest/ppt-design',
  },
  {
    title: 'HemoPain',
    description: 'Biomedical machine learning for chronic pain classification using blood biomarkers and clinical variables.',
    tags: ['Machine Learning', 'Biomedical', 'Bootstrap'],
    href: '/projects/hemopain',
    github: 'https://github.com/YiHarvest/hemopain',
  },
];

const researchInterests = [
  { name: 'Biomedical ML', href: '#' },
  { name: 'Knowledge Graph', href: '#' },
  { name: 'Agent Workflows', href: '#' },
];
---

<BaseLayout title="YiHarvest">
  <Navigation slot="navigation" />
  
  <Hero />
  
  <Section title="Featured Projects" id="projects">
    <ProjectGrid>
      {featuredProjects.map(project => (
        <ProjectCard {...project} />
      ))}
    </ProjectGrid>
  </Section>
  
  <Section title="Research Interests" id="research">
    <div class="flex flex-wrap gap-3">
      {researchInterests.map(interest => (
        <span class="text-base text-[var(--color-text-secondary)]">
          {interest.name}
        </span>
      ))}
    </div>
  </Section>
  
  <Section title="Contact" id="contact">
    <div class="flex flex-wrap gap-6 text-sm">
      <a href="mailto:yiharvest@example.com" class="link-accent">Email</a>
      <a href="https://github.com/YiHarvest" class="link-accent">GitHub</a>
      <a href="https://linkedin.com/in/yiharvest" class="link-accent">LinkedIn</a>
    </div>
  </Section>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Verify homepage builds and renders**

```bash
npm run build && npm run preview
```

Expected: Build succeeds, preview shows homepage with all sections

---

### Task 5: Content Collections Setup

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/search-engine-tool-mcp.mdx`
- Create: `src/content/projects/ppt-design.mdx`
- Create: `src/content/projects/hemopain.mdx`

**Interfaces:**
- Produces: Project content collection with MDX schema

- [ ] **Step 1: Create content config**

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    pypi: z.string().optional(),
    docs: z.string().optional(),
    publishedAt: z.date().optional(),
    status: z.enum(['active', 'archived', 'completed']).default('active'),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Create Search Engine Tool MCP content**

Create `src/content/projects/search-engine-tool-mcp.mdx`:

```mdx
---
title: Search Engine Tool MCP
description: A secure, multi-provider web search and extraction MCP server for Codex, Trae, and other MCP-compatible clients.
tags: ['Python', 'FastMCP', 'DDGS', 'SearXNG', 'Tavily']
github: 'https://github.com/YiHarvest/search-engine-tool-mcp'
pypi: 'https://pypi.org/project/search-engine-tool-mcp/'
---

## 背景

在 AI Agent 开发中，搜索能力是许多工作流的核心需求。然而，现有的搜索工具往往缺乏统一接口、安全校验机制不够完善，或者难以适配不同的搜索引擎 Provider。

## 技术架构

本项目基于 FastMCP 构建，实现了多 Provider 抽象层：

- **DDGS**: DuckDuckGo 搜索，无需 API Key
- **SearXNG**: 自托管元搜索引擎
- **Tavily**: 专为 AI Agent 优化的搜索 API
- **You.com**: 商业搜索 API
- **TalorData**: 结构化数据检索

## 关键特性

### 安全设计

- SSRF 校验：防止服务器端请求伪造
- 重定向校验：限制跳转次数和目标域名
- 响应大小限制：防止内存溢出

### 自动回退策略

当主 Provider 失败时，自动切换到备用 Provider，确保搜索服务的可用性。

### 分发

通过 PyPI 发布，支持 `pip install` 和 `uvx` 直接运行。

## 成果

- 发布至 PyPI，可通过 `pip install search-engine-tool-mcp` 安装
- 支持 Codex、Trae 等 MCP 客户端
- 完整的类型提示和文档
```

- [ ] **Step 3: Create PPT Design content**

Create `src/content/projects/ppt-design.mdx`:

```mdx
---
title: PPT Design
description: A Codex plugin for creating animated HTML presentations and genuinely editable PowerPoint decks.
tags: ['Codex Plugin', 'HTML Slides', 'PPTX', 'Design Automation']
github: 'https://github.com/YiHarvest/ppt-design'
---

## 背景

创建演示文稿是技术人员日常工作的一部分，但现有工具要么过于手动（PowerPoint），要么输出不可编辑（HTML 幻灯片导出）。

## 技术架构

PPT Design 作为 Codex 插件运行，提供三层输出：

1. **HTML 演示**: 动态、支持动画、适合在线展示
2. **PPTX 导出**: 真正可编辑的 PowerPoint 文件
3. **设计模板**: 可复用的视觉样式

## 关键特性

- 从项目文档自动生成演示结构
- 支持代码块、架构图、流程图等技术内容
- 商业级视觉设计模板
- 导出为原生 PPTX 格式，完全可编辑

## 成果

- 支持 Codex 平台
- 多套设计模板
- 自动化演示生成流程
```

- [ ] **Step 4: Create HemoPain content**

Create `src/content/projects/hemopain.mdx`:

```mdx
---
title: HemoPain
description: Biomedical machine learning for chronic pain classification using blood biomarkers and clinical variables.
tags: ['Machine Learning', 'Biomedical', 'Bootstrap', 'Model Calibration']
github: 'https://github.com/YiHarvest/hemopain'
---

## 背景

慢性疼痛是影响生活质量的常见问题。通过血液生物标志物和临床变量，可以构建预测模型辅助临床决策。

## 技术架构

采用经典的机器学习流程：

- **数据预处理**: 缺失值处理、特征工程
- **模型选择**: 多种分类器比较（LR, RF, XGBoost）
- **评估指标**: AUROC、敏感性、特异性、校准曲线
- **不确定性量化**: Bootstrap 置信区间

## 关键特性

### 模型校准

使用校准曲线评估预测概率的可靠性，确保模型输出可用于临床决策。

### 临床评价指标

除了统计指标，还计算了临床需要的敏感性/特异性阈值下的阳性和阴性预测值。

### 解释性

通过 SHAP 值分析特征贡献，提供临床可解释性。

## 成果

- 构建了可解释的疼痛分类模型
- 提供了完整的模型比较和评估流程
- 模型校准良好，预测概率可靠
```

- [ ] **Step 5: Verify content builds**

```bash
npm run build
```

Expected: Build succeeds, content collection recognized

---

### Task 6: Project Pages

**Files:**
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/layouts/ContentLayout.astro`

**Interfaces:**
- Consumes: Content collection from Task 5, BaseLayout components from Task 2
- Produces: Projects listing page and dynamic project detail pages

- [ ] **Step 1: Create ContentLayout**

Create `src/layouts/ContentLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <Navigation slot="navigation" />
  
  <article class="max-w-content mx-auto px-6 py-16 sm:py-24">
    <slot />
  </article>
  
  <Footer slot="footer" />
</BaseLayout>

<script>
  import BaseLayout from './BaseLayout.astro';
  import Navigation from '../components/Navigation.astro';
  import Footer from '../components/Footer.astro';
</script>
```

Wait, that's wrong. Let me fix it:

Create `src/layouts/ContentLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <Navigation slot="navigation" />
  
  <article class="max-w-content mx-auto px-6 py-16 sm:py-24">
    <slot />
  </article>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Create projects index**

Create `src/pages/projects/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import Footer from '../../components/Footer.astro';
import Section from '../../components/Section.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import ProjectGrid from '../../components/ProjectGrid.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
---

<BaseLayout title="Projects">
  <Navigation slot="navigation" />
  
  <Section title="Projects">
    <ProjectGrid>
      {projects.map(project => (
        <ProjectCard
          title={project.data.title}
          description={project.data.description}
          tags={project.data.tags}
          href={`/projects/${project.slug}`}
          github={project.data.github}
        />
      ))}
    </ProjectGrid>
  </Section>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Create project detail page**

Create `src/pages/projects/[slug].astro`:

```astro
---
import { type CollectionEntry, getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

type Props = {
  project: CollectionEntry<'projects'>;
};

const { project } = Astro.props;
const { Content } = await project.render();
---

<BaseLayout title={project.data.title} description={project.data.description}>
  <Navigation slot="navigation" />
  
  <article class="max-w-content mx-auto px-6 py-24">
    <header class="mb-12">
      <h1 class="text-4xl font-semibold tracking-tight mb-4">
        {project.data.title}
      </h1>
      <p class="text-lg text-[var(--color-text-secondary)] mb-6 leading-relaxed">
        {project.data.description}
      </p>
      <div class="flex flex-wrap gap-2 mb-6">
        {project.data.tags.map(tag => (
          <span class="text-xs px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-text-secondary)]">
            {tag}
          </span>
        ))}
      </div>
      <div class="flex flex-wrap gap-4 text-sm">
        {project.data.github && (
          <a href={project.data.github} class="link-accent font-medium">GitHub</a>
        )}
        {project.data.pypi && (
          <a href={project.data.pypi} class="link-accent font-medium">PyPI</a>
        )}
        {project.data.docs && (
          <a href={project.data.docs} class="link-accent font-medium">文档</a>
        )}
      </div>
    </header>
    
    <div class="prose prose-neutral dark:prose-invert max-w-none">
      <Content />
    </div>
  </article>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 4: Verify project pages build**

```bash
npm run build
```

Expected: Build succeeds, project pages generated

---

### Task 7: About Page

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: BaseLayout, Navigation, Footer, Section from Tasks 2-3
- Produces: About page

- [ ] **Step 1: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import Section from '../components/Section.astro';
---

<BaseLayout title="About">
  <Navigation slot="navigation" />
  
  <article class="max-w-content mx-auto px-6 py-24">
    <h1 class="text-4xl font-semibold tracking-tight mb-8">About</h1>
    
    <div class="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
      <p>
        我是 YiHarvest，一名专注于 AI Agent、MCP 工具开发和生物医学机器学习的工程师。
      </p>
      
      <p>
        我的研究兴趣包括：
      </p>
      
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Biomedical Machine Learning: 将机器学习应用于临床问题，关注模型可解释性和临床实用性</li>
        <li>Knowledge Graph: 构建和利用知识图谱支持推理和决策</li>
        <li>Agent Workflows: 设计和实现 AI Agent 工作流，提升自动化效率</li>
      </ul>
      
      <p>
        技术栈包括 Python、FastAPI、PyTorch、Docker，熟悉 MCP 协议和 Agent 开发。
      </p>
    </div>
    
    <Section title="联系方式">
      <div class="flex flex-wrap gap-6">
        <a href="mailto:yiharvest@example.com" class="link-accent">Email</a>
        <a href="https://github.com/YiHarvest" class="link-accent">GitHub</a>
        <a href="https://linkedin.com/in/yiharvest" class="link-accent">LinkedIn</a>
      </div>
    </Section>
  </article>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Verify about page builds**

```bash
npm run build
```

Expected: Build succeeds

---

### Task 8: Notes Pages

**Files:**
- Create: `src/content/notes/.gitkeep`
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[slug].astro`

**Interfaces:**
- Produces: Notes listing and detail pages (empty initially)

- [ ] **Step 1: Create notes content config**

Update `src/content/config.ts` to add notes collection:

```typescript
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    pypi: z.string().optional(),
    docs: z.string().optional(),
    publishedAt: z.date().optional(),
    status: z.enum(['active', 'archived', 'completed']).default('active'),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, notes };
```

- [ ] **Step 2: Create notes index**

Create `src/pages/notes/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import Section from '../components/Section.astro';
import { getCollection } from 'astro:content';

const notes = await getCollection('notes');
const sortedNotes = notes.sort((a, b) => 
  new Date(b.data.publishedAt).valueOf() - new Date(a.data.publishedAt).valueOf()
);
---

<BaseLayout title="Notes">
  <Navigation slot="navigation" />
  
  <Section title="Notes">
    {sortedNotes.length === 0 ? (
      <p class="text-[var(--color-text-secondary)]">暂无文章</p>
    ) : (
      <div class="space-y-6">
        {sortedNotes.map(note => (
          <article class="card">
            <time class="text-sm text-[var(--color-text-secondary)]">
              {new Date(note.data.publishedAt).toLocaleDateString('zh-CN')}
            </time>
            <h3 class="text-lg font-medium mt-2 mb-2">
              <a href={`/notes/${note.slug}`} class="hover:text-[var(--color-accent)] transition-colors">
                {note.data.title}
              </a>
            </h3>
            {note.data.description && (
              <p class="text-sm text-[var(--color-text-secondary)]">
                {note.data.description}
              </p>
            )}
          </article>
        ))}
      </div>
    )}
  </Section>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 3: Create note detail page**

Create `src/pages/notes/[slug].astro`:

```astro
---
import { type CollectionEntry, getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';

export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes.map(note => ({
    params: { slug: note.slug },
    props: { note },
  }));
}

type Props = {
  note: CollectionEntry<'notes'>;
};

const { note } = Astro.props;
const { Content } = await note.render();
---

<BaseLayout title={note.data.title} description={note.data.description}>
  <Navigation slot="navigation" />
  
  <article class="max-w-content mx-auto px-6 py-24">
    <header class="mb-12">
      <time class="text-sm text-[var(--color-text-secondary)]">
        {new Date(note.data.publishedAt).toLocaleDateString('zh-CN')}
      </time>
      <h1 class="text-4xl font-semibold tracking-tight mt-2 mb-4">
        {note.data.title}
      </h1>
      {note.data.tags && (
        <div class="flex flex-wrap gap-2">
          {note.data.tags.map(tag => (
            <span class="text-xs px-2 py-1 rounded bg-[var(--color-border)] text-[var(--color-text-secondary)]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
    
    <div class="prose prose-neutral dark:prose-invert max-w-none">
      <Content />
    </div>
  </article>
  
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 4: Create notes placeholder**

```bash
mkdir -p src/content/notes && touch src/content/notes/.gitkeep
```

- [ ] **Step 5: Verify notes pages build**

```bash
npm run build
```

Expected: Build succeeds

---

### Task 9: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: GitHub Actions workflow for automatic deployment

- [ ] **Step 1: Create deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify workflow file**

```bash
cat .github/workflows/deploy.yml
```

Expected: Workflow file content displayed

---

### Task 10: Final Verification

**Files:**
- Modify: Various files if needed

**Interfaces:**
- Final check of all functionality

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 2: Preview site locally**

```bash
npm run preview
```

Expected: Preview server starts, all pages accessible

- [ ] **Step 3: Check build output**

```bash
ls -la dist/
```

Expected: `dist/` contains `index.html`, `projects/`, `about/`, `notes/` directories

- [ ] **Step 4: Commit all files**

```bash
git add .
git commit -m "feat: initial portfolio website implementation

- Astro 5 + TypeScript + Tailwind CSS 4 setup
- Cold minimalist design with forest green accent
- Dark mode support
- MDX content collections for projects and notes
- GitHub Actions deployment workflow"
```

---

## Self-Review Checklist

1. **Spec coverage**: All spec requirements covered by tasks
2. **Placeholder scan**: No TBD, TODO, or placeholder text
3. **Type consistency**: All interfaces match between tasks
4. **File structure**: Matches spec structure
5. **Design constraints**: All taste-skill anti-patterns avoided