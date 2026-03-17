<template>
  <div class="app-container">
    <h1>Fake reCAPTCHA</h1>
    <p>恶搞版的 reCAPTCHA 验证码，现在可以完全自定义配置啦！</p>

    <!-- 验证码组件 -->
    <div class="captcha-container">
      <fake-captcha
        :config="captchaConfig"
        :payload-list="payloadList"
        @success="handleSuccess"
        @error="handleError"
        @verify="handleVerify"
      />
    </div>

    <!-- 配置表单 -->
    <div class="config-form">
      <h2>Fake reCAPTCHA 配置</h2>
      <div class="form-grid">
        <!-- 基本配置 -->
        <div class="form-group">
          <label>最大尝试次数</label>
          <input
            v-model.number="captchaConfig.maxAttempts"
            type="number"
            min="0"
            placeholder="0表示永远不通过"
          >
        </div>

        <div class="form-group">
          <label>通过概率 (%)</label>
          <input
            v-model.number="captchaConfig.passProbability"
            type="number"
            min="0"
            max="100"
          >
        </div>

        <div class="form-group">
          <label>最小选择数量</label>
          <input
            v-model.number="captchaConfig.minSelection"
            type="number"
            min="1"
          >
        </div>

        <div class="form-group">
          <label>难度级别</label>
          <select v-model="captchaConfig.difficulty">
            <option value="easy">
              简单
            </option>
            <option value="medium">
              中等
            </option>
            <option value="hard">
              困难
            </option>
          </select>
        </div>

        <!-- 布尔选项 -->
        <div class="form-group checkbox-group">
          <label>
            <input v-model="captchaConfig.showSuccessMessage" type="checkbox">
            显示成功消息
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input v-model="captchaConfig.showAttemptCount" type="checkbox">
            显示尝试次数
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input v-model="captchaConfig.autoCloseOnSuccess" type="checkbox">
            成功后自动关闭
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input
              v-model="captchaConfig.autoReloadOnFailure"
              type="checkbox"
            >
            失败后自动刷新
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input v-model="captchaConfig.allowReload" type="checkbox">
            允许刷新按钮
          </label>
        </div>

        <!-- 消息配置 -->
        <div class="form-group full-width">
          <label>成功消息</label>
          <input v-model="captchaConfig.successMessage" type="text">
        </div>

        <div class="form-group full-width">
          <label>失败消息</label>
          <input v-model="captchaConfig.errorMessage" type="text">
        </div>

        <!-- 物体名称配置 -->
        <div class="form-group full-width">
          <label>默认物体名称 (用逗号分隔)</label>
          <textarea
            v-model="objectNamesInput"
            placeholder="例如：公交车,消防栓,烟囱,山,飞机"
            rows="3"
          />
          <button type="button" class="btn-primary" @click="updateObjectNames">
            更新默认物体名称
          </button>
        </div>

        <!-- 自定义物体名称 -->
        <div class="form-group full-width">
          <label>自定义物体名称 (用逗号分隔，优先使用)</label>
          <input
            v-model="customObjectNamesInput"
            type="text"
            placeholder="例如：猫,狗,汽车,飞机"
          >
          <button
            type="button"
            class="btn-primary"
            @click="updateCustomObjectNames"
          >
            更新自定义物体名称
          </button>
        </div>

        <!-- 重置按钮 -->
        <div class="form-group full-width">
          <button type="button" class="btn-reset" @click="resetConfig">
            重置配置
          </button>
        </div>
      </div>
    </div>

    <footer class="app-footer">
      <div class="footer-content">
        <p>© {{ year }} Fake reCAPTCHA</p>
        <a href="https://github.com/Steven-Qiang/fake-recaptcha" target="_blank">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CaptchaConfig, SuccessData, VerifyData } from 'fake-recaptcha';
import FakeCaptcha, { defaultCaptchaConfig } from 'fake-recaptcha';
import { reactive, ref } from 'vue';

/** 图片可以自定义或者去toolkit目录下执行爬虫抓取 */
const dynPayloadList: Record<string, string> = import.meta.glob(
  './payload/*.png',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);
const payloadList = Object.values(dynPayloadList);

const year = new Date().getFullYear();
const customObjectNamesInput = ref('');
const objectNamesInput = ref('');

// 验证码配置
const captchaConfig = reactive<CaptchaConfig>({ ...defaultCaptchaConfig });

function handleSuccess(data: SuccessData) {
  alert(
    `验证成功！尝试了 ${data.attempt} 次，通过原因：${data.reason === 'max_attempts' ? '达到最大尝试次数' : '随机通过'}，难度：${data.difficulty}`,
  );
}

function handleError(message: string) {
  console.error(`验证失败: ${message}`);
}

function handleVerify(data: VerifyData) {
  console.log(`验证尝试 ${data.attempt} 次`);
}

// 更新默认物体名称
function updateObjectNames() {
  if (objectNamesInput.value) {
    captchaConfig.customObjectNames = objectNamesInput.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
  } else {
    alert('物体名称不能为空');
  }
}

// 更新自定义物体名称
function updateCustomObjectNames() {
  if (customObjectNamesInput.value) {
    captchaConfig.customObjectNames = customObjectNamesInput.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
  }
}

// 重置配置
function resetConfig() {
  Object.assign(captchaConfig, defaultCaptchaConfig);
  customObjectNamesInput.value = '';
  alert('配置已重置为默认值');
}
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

p {
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.captcha-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.app-footer {
  margin-top: 40px;
  padding-top: 15px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-content p {
  margin: 0;
}

.footer-content a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-content a:hover {
  color: #333;
}

.config-form {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  padding-top: 5px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-form h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: left;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: #555;
}

.form-group input[type='number'],
.form-group input[type='text'],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
}

.form-group input[type='checkbox'] {
  margin-right: 8px;
}

.form-group.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.form-group.checkbox-group label {
  margin-bottom: 0;
  cursor: pointer;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-reset {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-reset:hover {
  background-color: #da190b;
}

@media (max-width: 480px) {
  .footer-content {
    flex-direction: column;
    gap: 5px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .config-form {
    padding: 15px;
  }
}
</style>
