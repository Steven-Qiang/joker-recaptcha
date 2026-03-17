# Fake reCAPTCHA 项目简介与文件功能

## 项目简介

Fake reCAPTCHA 是一个恶搞版的 reCAPTCHA 验证码组件，完全模仿 Google reCAPTCHA 的外观和交互，但无论用户如何选择，都会显示验证失败。

### 核心功能

- 完全模仿 Google reCAPTCHA 界面
- 随机生成物体名称和验证码图片
- 响应式设计，适配不同屏幕尺寸
- 无论怎么选择，都会验证失败

## 技术栈

- Vue 3 + TypeScript + Composition API
- Vite 构建工具
- Playwright（用于爬虫工具）

## 文件功能

### 根目录文件

| 文件/目录            | 功能              |
| ---------------- | --------------- |
| `src/`           | 源代码目录           |
| `toolkit/`       | 工具目录，包含爬虫工具     |
| `dist/`          | 构建输出目录          |
| `package.json`   | 项目配置文件          |
| `vite.config.ts` | Vite 配置文件       |
| `tsconfig.json`  | TypeScript 配置文件 |
| `README.md`      | 项目说明文件          |
| `agents.md`      | 项目代理配置文件        |

### src 目录文件

#### src/App.vue

- 主应用组件
- 包含页面布局和标题
- 引入并使用 Captcha 组件
- 显示页脚信息（版权和 GitHub 链接）

#### src/main.ts

- 应用入口文件
- 初始化 Vue 应用
- 挂载到 DOM

#### src/components/Captcha.vue

- 核心验证码组件
- 完全模仿 Google reCAPTCHA 界面
- 实现验证码选择逻辑（无论怎么选都会失败）
- 随机生成物体名称和验证码图片
- 响应式设计，适配不同屏幕尺寸

#### src/assets/

- 静态资源目录

##### src/assets/icon/

- 验证码相关图标
- 包含音频、图像、刷新等按钮图标
- 包含复选框和勾选标记图标

##### src/assets/payload/

- 验证码图片目录
- 包含用于显示的验证码图片
- 图片由爬虫工具抓取

##### src/assets/styles\_\_ltr.css

- 验证码样式文件
- 模仿 Google reCAPTCHA 的样式
- 包含响应式设计样式

### toolkit 目录文件

#### toolkit/crawler.js

- reCAPTCHA 图片爬虫工具
- 使用 Playwright 自动化浏览器
- 访问 Google reCAPTCHA 演示页面
- 自动点击刷新按钮获取新的验证码图片
- 监听网络请求，抓取 payload 图片
- 将抓取的图片保存到 toolkit/payload 目录
- 无限循环运行，持续抓取图片

#### toolkit/package.json

- 工具包配置文件
- 包含 Playwright 依赖

#### toolkit/payload/

- 爬虫抓取的图片存储目录

