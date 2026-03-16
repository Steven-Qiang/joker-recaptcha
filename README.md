# Joke reCAPTCHA

恶搞版的 reCAPTCHA 验证码，无论怎么选都会失败。

## 项目简介

这是一个恶搞版的 reCAPTCHA 验证码组件，完全模仿 Google reCAPTCHA 的外观和交互，但无论用户如何选择，都会显示验证失败。

## 特性

- 完全模仿 Google reCAPTCHA 的界面
- 随机生成物体名称和验证码图片
- 响应式设计，适配不同屏幕尺寸
- 无论怎么选择，都会验证失败

## 技术栈

- Vue 3 + TypeScript
- Vite
- pnpm

## 安装

```bash
# 克隆项目
git clone https://github.com/Steven-Qiang/joker-recaptcha.git

# 进入项目目录
cd joke-recaptcha

# 安装依赖
pnpm install
```

## 开发

```bash
# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产构建
pnpm run preview
```

## 使用

### 在 Vue 项目中使用

1. 导入 Captcha 组件
2. 在模板中使用

```vue
<template>
  <div>
    <h1>Joke reCAPTCHA</h1>
    <captcha />
  </div>
</template>

<script setup lang="ts">
import Captcha from './components/Captcha.vue';
</script>
```

## 项目结构

```
joke-recaptcha/
├── src/
│   ├── assets/            # 静态资源
│   │   ├── icon/          # 图标
│   │   ├── payload/       # 验证码图片
│   │   └── styles__ltr.css # 样式文件
│   ├── components/        # 组件
│   │   └── Captcha.vue    # 核心验证码组件
│   ├── App.vue            # 主应用组件
│   └── main.ts            # 应用入口
├── .github/               # GitHub 配置
│   └── workflows/         # GitHub Actions 工作流
│       └── deploy.yml     # 部署到 GitHub Pages 的工作流
├── dist/                  # 构建输出目录
├── package.json           # 项目配置
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

## 部署

项目已配置 GitHub Pages 部署，当代码推送到 main 分支时，会自动构建并部署到 GitHub Pages。

部署地址：https://steven-qiang.github.io/joker-recaptcha/

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
