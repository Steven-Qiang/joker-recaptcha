<template>
  <div>
    <h2>享受被骗当小丑的感觉吧。</h2>
    <Captcha />
  </div>
</template>

<script>
import Captcha from './components/Captcha.vue';
export default {
  name: 'App',
  components: {
    Captcha,
  },
};
</script>

<style>
body {
  margin: 8px;
}
</style>
