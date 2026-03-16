<template>
  <div class="app-container">
    <h1>Joke reCAPTCHA</h1>
    <p>恶搞版的 reCAPTCHA 验证码，无论怎么选都会失败哦！</p>
    <div class="captcha-container">
      <captcha />
    </div>
    <footer class="app-footer">
      <div class="footer-content">
        <p>© {{ year }} Joke reCAPTCHA</p>
        <a
          href="https://github.com/Steven-Qiang/joker-recaptcha"
          target="_blank"
        >GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Captcha from './components/Captcha.vue';

const year = new Date().getFullYear();
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

@media (max-width: 480px) {
  .footer-content {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
