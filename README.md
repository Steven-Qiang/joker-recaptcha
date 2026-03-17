# Fake reCAPTCHA

[![npm version](https://img.shields.io/npm/v/fake-recaptcha.svg)](https://www.npmjs.com/package/fake-recaptcha)
[![npm downloads](https://img.shields.io/npm/dm/fake-recaptcha.svg)](https://www.npmjs.com/package/fake-recaptcha)
[![license](https://img.shields.io/npm/l/fake-recaptcha.svg)](https://github.com/Steven-Qiang/fake-recaptcha/blob/main/LICENSE)

一个模仿 Google reCAPTCHA 的 Vue 3 验证码组件，外观和交互与真实的 reCAPTCHA 几乎一致，但验证逻辑完全可控（默认会按配置随机通过或失败）。

![](screenshots/example.png)

## 特性

- 完全模仿 Google reCAPTCHA 的界面
- 随机生成物体名称和验证码图片
- 可配置验证逻辑（尝试次数、通过概率、难度等）

## 安装

```bash
# npm
npm install fake-recaptcha

# yarn
yarn add fake-recaptcha

# pnpm
pnpm add fake-recaptcha
```

## 快速开始

### 基础用法

```vue
<template>
  <div>
    <FakeCaptcha />
  </div>
</template>

<script setup lang="ts">
import FakeCaptcha from 'fake-recaptcha'
</script>
```

### 完整示例

```vue
<template>
  <div>
    <FakeCaptcha
      :config="captchaConfig"
      :payload-list="payloadList"
      @success="handleSuccess"
      @error="handleError"
      @verify="handleVerify"
    />
  </div>
</template>

<script setup lang="ts">
import type { CaptchaConfig, SuccessData, VerifyData } from 'fake-recaptcha'
import FakeCaptcha, { defaultCaptchaConfig } from 'fake-recaptcha'

// 准备验证码图片列表
const dynPayloadList: Record<string, string> = import.meta.glob(
  './assets/payload/*.png',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
)
const payloadList = Object.values(dynPayloadList)

// 自定义配置
const captchaConfig: CaptchaConfig = {
  ...defaultCaptchaConfig,
  maxAttempts: 3, // 最大尝试次数
  passProbability: 20, // 通过概率 20%
  difficulty: 'medium', // 难度级别
}

// 事件处理
function handleSuccess(data: SuccessData) {
  console.log('验证成功', data)
  // data: { attempt: 3, reason: 'max_attempts' | 'random_pass', difficulty: 'medium' }
}

function handleError(message: string) {
  console.log('验证失败', message)
}

function handleVerify(data: VerifyData) {
  console.log('验证尝试', data)
  // data: { attempt: 1, selectedImages: ['1_1', '2_2'], difficulty: 'medium' }
}
</script>
```

## 配置选项

### CaptchaConfig

```typescript
interface CaptchaConfig {
  // 最大尝试次数（0 表示永远不通过）
  maxAttempts: number;

  // 通过概率（0-100）
  passProbability: number;

  // 最小选择数量
  minSelection: number;

  // 是否显示成功消息
  showSuccessMessage: boolean;

  // 成功消息内容
  successMessage: string;

  // 失败消息内容
  errorMessage: string;

  // 难度级别：'easy' | 'medium' | 'hard'
  difficulty: DifficultyLevel;

  // 是否显示尝试次数
  showAttemptCount: boolean;

  // 成功后自动关闭
  autoCloseOnSuccess: boolean;

  // 失败后自动刷新
  autoReloadOnFailure: boolean;

  // 是否允许刷新按钮
  allowReload: boolean;

  // 自定义物体名称列表（优先使用）
  customObjectNames: string[];
}
```

### 默认配置

```typescript
const defaultCaptchaConfig = {
  maxAttempts: 3,
  passProbability: 20,
  minSelection: 2,
  showSuccessMessage: true,
  successMessage: "验证成功！恭喜你通过了测试",
  errorMessage: "请重试，再试一次吧",
  difficulty: "medium",
  showAttemptCount: false,
  autoCloseOnSuccess: true,
  autoReloadOnFailure: true,
  allowReload: true,
  customObjectNames: [],
};
```

## Props

| 名称        | 类型            | 默认值                 | 说明           |
| ----------- | --------------- | ---------------------- | -------------- |
| config      | `CaptchaConfig` | `defaultCaptchaConfig` | 验证码配置对象 |
| payloadList | `string[]`      | `[]`                   | 验证码图片列表 |

## 事件

### @success

验证成功时触发

```typescript
interface SuccessData {
  attempt: number; // 尝试次数
  reason: "max_attempts" | "random_pass"; // 通过原因
  difficulty: string; // 难度级别
}
```

### @error

验证失败时触发

```typescript
(message: string) => void
```

### @verify

每次验证尝试时触发

```typescript
interface VerifyData {
  attempt: number; // 尝试次数
  selectedImages: string[]; // 选中的图片
  difficulty: string; // 难度级别
}
```

## 难度级别

- **easy**: 最小选择数量 1，通过概率 +20%
- **medium**: 使用配置的默认值
- **hard**: 最小选择数量至少 3，通过概率 -20%

## 自定义物体名称

可以通过配置自定义验证码中显示的物体名称：

```vue
<script setup lang="ts">
import { defaultCaptchaConfig } from "fake-recaptcha";

const captchaConfig = {
  ...defaultCaptchaConfig,
  customObjectNames: ["猫", "狗", "汽车", "飞机"],
};
</script>
```

如果不设置，会使用内置的默认物体名称列表（包含公交车、消防栓、烟囱、山、飞机等官方定义的物体）。

## 验证码图片

### 使用爬虫工具抓取（推荐）

项目提供了爬虫工具，可以自动抓取 Google reCAPTCHA 的验证码图片：

```bash
# 进入 toolkit 目录
cd toolkit

# 安装依赖
pnpm install

# 安装 Playwright 浏览器
npx playwright install

# 运行爬虫
pnpm start
```

爬虫会：

- 自动访问 reCAPTCHA 演示页面
- 自动点击复选框触发验证码
- 监听网络请求，抓取 payload 图片
- 将抓取的图片保存到 `toolkit/payload` 目录
- 无限循环刷新，持续抓取新图片

### 使用自己的图片

准备验证码图片，然后通过 `payloadList` prop 传入：

```vue
<script setup lang="ts">
const dynPayloadList = import.meta.glob("./assets/payload/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const payloadList = Object.values(dynPayloadList);
</script>
```

图片会按照 3x3 的网格进行分割显示，建议使用包含多个物体的场景图片。

## 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Steven-Qiang/fake-recaptcha.git

# 进入项目目录
cd fake-recaptcha

# 安装依赖
pnpm install

# 构建库
pnpm run build
```

### 构建

```bash
# 构建库
pnpm run build
```

输出目录：`dist/`

- `fake-recaptcha.es.js` - ES Module 版本
- `fake-recaptcha.cjs.js` - CommonJS 版本
- `index.d.ts` - TypeScript 类型定义
- `index.css` - 样式文件

## 项目结构

```
fake-recaptcha/
├── src/                    # 源代码
│   ├── assets/             # 静态资源
│   │   ├── icon/           # 图标
│   │   └── styles__ltr.css # 样式文件
│   ├── Captcha.vue         # 核心验证码组件
│   ├── config.ts           # 类型定义和默认配置
│   └── index.ts            # 库入口文件
├── demo/                   # 演示项目
│   ├── src/
│   │   ├── App.vue         # 演示应用
│   │   ├── main.ts         # 演示入口
│   │   └── payload/        # 验证码图片
├── toolkit/                # 工具目录
│   ├── crawler.js          # reCAPTCHA 图片爬虫
│   ├── package.json        # 爬虫工具配置
│   └── payload/            # 爬虫抓取的图片存储目录
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
└── vite.config.ts          # Vite 配置
```

## 技术栈

- Vue 3 + TypeScript + Composition API
- Vite 构建工具
- Rollup 打包

## 注意事项

- 该组件仅供娱乐和学习使用
- 请勿用于生产环境或任何可能误导用户的场景

## License

MIT
