<template>
  <div class="captcha-container">
    <!-- 长条框 -->
    <div ref="container" class="captcha-box" @click="showCaptcha">
      <div id="rc-anchor-alert" class="rc-anchor-alert" />
      <div
        id="rc-anchor-container"
        class="rc-anchor rc-anchor-normal rc-anchor-light"
      >
        <div
          id="recaptcha-accessible-status"
          class="rc-anchor-aria-status"
          aria-hidden="true"
        >
          Recaptcha 要求验证.
        </div>
        <div class="rc-anchor-error-msg-container">
          <span class="rc-anchor-error-msg" aria-hidden="true" />
        </div>
        <div class="rc-anchor-content">
          <div class="rc-inline-block">
            <div class="rc-anchor-center-container">
              <div class="rc-anchor-center-item rc-anchor-checkbox-holder">
                <span
                  id="recaptcha-anchor"
                  class="recaptcha-checkbox goog-inline-block recaptcha-checkbox-unchecked rc-anchor-checkbox"
                  role="checkbox"
                  aria-checked="false"
                  dir="ltr"
                  aria-labelledby="recaptcha-anchor-label"
                  aria-disabled="false"
                  tabindex="0"
                >
                  <div
                    v-show="!isLoading"
                    class="recaptcha-checkbox-border"
                    role="presentation"
                  />
                  <div
                    class="recaptcha-checkbox-borderAnimation"
                    role="presentation"
                    :class="{ loading: isLoading }"
                  />
                  <div
                    v-show="isLoading"
                    class="recaptcha-checkbox-spinner spinner"
                    role="presentation"
                  >
                    <div class="recaptcha-checkbox-spinner-overlay" />
                  </div>
                  <div class="recaptcha-checkbox-checkmark" role="presentation" /></span>
              </div>
            </div>
          </div>
          <div class="rc-inline-block">
            <div class="rc-anchor-center-container">
              <label
                id="recaptcha-anchor-label"
                class="rc-anchor-center-item rc-anchor-checkbox-label"
                aria-hidden="true"
                role="presentation"
              ><span
                aria-live="polite"
                aria-labelledby="recaptcha-accessible-status"
              />进行人机身份验证</label>
            </div>
          </div>
        </div>
        <div class="rc-anchor-normal-footer">
          <div
            class="rc-anchor-logo-portrait"
            aria-hidden="true"
            role="presentation"
          >
            <div class="rc-anchor-logo-img rc-anchor-logo-img-portrait" />
            <div class="rc-anchor-logo-text">
              reCAPTCHA
            </div>
          </div>
          <div class="rc-anchor-pt">
            <a
              href="https://www.google.com/intl/zh-CN/policies/privacy/"
              target="_blank"
            >隐私权</a><span aria-hidden="true" role="presentation"> - </span><a
              href="https://www.google.com/intl/zh-CN/policies/terms/"
              target="_blank"
            >使用条款</a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="isVisible"
      class="captcha-overlay"
      @click="isVisible = false"
    />

    <div class="captcha-selector" :style="selectorStyle">
      <!-- 遮罩层 -->
      <div v-show="showArrow" class="g-recaptcha-bubble-arrow outer-arrow" />
      <div v-show="showArrow" class="g-recaptcha-bubble-arrow inner-arrow" />
      <div id="rc-imageselect">
        <div id="rc-imageselect">
          <div class="rc-imageselect-response-field" />
          <span class="rc-imageselect-tabloop-begin" tabindex="0" />
          <div class="rc-imageselect-payload">
            <div class="rc-imageselect-instructions">
              <div class="rc-imageselect-desc-wrapper">
                <div class="rc-imageselect-desc-no-canonical">
                  选择所有包含<strong class="object-name">{{
                    objectName
                  }}</strong>的所有图片
                </div>
              </div>
              <div class="rc-imageselect-progress" />
            </div>
            <div class="rc-imageselect-challenge">
              <div
                id="rc-imageselect-target"
                class="rc-imageselect-target"
                dir="ltr"
                role="presentation"
                aria-hidden="true"
              >
                <table class="rc-imageselect-table-33">
                  <tbody>
                    <tr v-for="tr in 3" :key="tr">
                      <td
                        v-for="td in 3"
                        :key="td"
                        role="button"
                        tabindex="0"
                        class="rc-imageselect-tile"
                        :class="{
                          'rc-imageselect-tileselected':
                            selectedImages.includes(`${tr}_${td}`),
                        }"
                        aria-label="图片验证"
                        @click="toggleImageSelection(`${tr}_${td}`)"
                      >
                        <div class="rc-image-tile-target">
                          <div
                            class="rc-image-tile-wrapper"
                            :style="{
                              width: `${wrapperSize}px`,
                              height: `${wrapperSize}px`,
                            }"
                          >
                            <img
                              class="rc-image-tile-33"
                              :src="getPayloadUrl(payloadFilename)"
                              :style="{
                                top: `-${(tr - 1) * 100}%`,
                                left: `-${(td - 1) * 100}%`,
                              }"
                            >
                            <div class="rc-image-tile-overlay" />
                          </div>
                          <div class="rc-imageselect-checkbox" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              v-show="errorCode === 'rc-imageselect-incorrect-response'"
              class="rc-imageselect-incorrect-response"
            >
              请重试。
            </div>
            <div
              v-show="errorCode === 'rc-imageselect-error-select-more'"
              class="rc-imageselect-error-select-more"
            >
              请选择所有相符的图片。
            </div>
          </div>
          <div class="rc-footer">
            <div class="rc-separator" />
            <div class="rc-controls">
              <div class="primary-controls">
                <div class="rc-buttons">
                  <div class="button-holder reload-button-holder">
                    <button
                      id="recaptcha-reload-button"
                      class="rc-button goog-inline-block rc-button-reload"
                      title="换一个新的验证码"
                      value=""
                      tabindex="0"
                      @click="handleReload"
                    />
                  </div>
                  <div class="button-holder help-button-holder">
                    <a
                      id="recaptcha-help-button"
                      href="https://support.google.com/recaptcha/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="rc-button goog-inline-block rc-button-help"
                      title="帮助"
                      value=""
                      tabindex="0"
                    />
                  </div>
                </div>
                <div class="verify-button-holder">
                  <button
                    id="recaptcha-verify-button"
                    class="rc-button-default goog-inline-block"
                    title=""
                    value=""
                    :class="{ 'rc-button-default-disabled': isReloading }"
                    tabindex="0"
                    @click="verifySelection"
                  >
                    验证
                  </button>
                </div>
              </div>
              <div class="rc-challenge-help" tabindex="0" />
            </div>
          </div>
          <span class="rc-imageselect-tabloop-end" tabindex="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const payloadList = import.meta.glob('../assets/payload/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
const payloadKeys = Object.keys(payloadList);

const OBJECT_NAMES = [
  '公交车',
  '消防栓',
  '烟囱',
  '山',
  '飞机',
  '过街人行道',
  '桥',
  '自行车',
  '停止标志',
  '路标',
  '店铺门面',
  '植物',
  '花',
  '树木',
  '棕榈树',
  '水域',
  '河流',
  '海滩',
  '天空',
  '小轿车',
  '船',
  '出租车',
  '校车',
  '火车',
  '雕像',
  '喷泉',
  '柱子',
  '房屋',
  '公寓楼',
  '广告牌',
  '道路',
  '人行横道',
  '红绿灯',
  '公交站',
  '锥形交通路标',
  '停车计时器',
  '拖拉机',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPayload(): string {
  const randomKey = getRandomItem(payloadKeys);
  return randomKey.split('/').pop() || '';
}

function getRandomObjectName(): string {
  return getRandomItem(OBJECT_NAMES);
}

const isVisible = ref(false);
const isLoading = ref(false);
const isReloading = ref(false);
const showArrow = ref(false);
const selectedImages = ref<string[]>([]);
const wrapperSize = ref(126);
const errorCode = ref<string>('');
const objectName = ref(getRandomObjectName());
const payloadFilename = ref(getRandomPayload());
const containerRef = useTemplateRef('container');

const selectorStyle = ref<CSSProperties>({
  backgroundColor: 'rgb(255, 255, 255)',
  border: '1px solid rgb(204, 204, 204)',
  boxShadow: 'rgb(0 0 0 / 20%) 2px 2px 3px',
  position: 'absolute',
  transition: 'visibility 0s linear 0s, opacity 0.3s linear 0s',
  opacity: '1',
  zIndex: '2000000000',
  visibility: 'hidden',
});

function getPayloadUrl(filename: string): string {
  return new URL(`../assets/payload/${filename}`, import.meta.url).href;
}

async function reloadCaptcha(): Promise<void> {
  const currentPayload = payloadFilename.value;
  const currentObject = objectName.value;

  while (payloadFilename.value === currentPayload) {
    payloadFilename.value = getRandomPayload();
  }

  while (objectName.value === currentObject) {
    objectName.value = getRandomObjectName();
  }
}

async function handleReload(): Promise<void> {
  selectedImages.value = [];
  isReloading.value = true;
  await delay(800);
  await reloadCaptcha();
  isReloading.value = false;
}

async function showError(code: string): Promise<void> {
  errorCode.value = code;
  await delay(1000);
  errorCode.value = '';
}

async function showCaptcha(): Promise<void> {
  isLoading.value = true;
  await reloadCaptcha();
  await delay(300);
  isVisible.value = true;
  await delay(300);
  isLoading.value = false;
}

async function verifySelection(): Promise<void> {
  if (selectedImages.value.length < 2) {
    return showError('rc-imageselect-error-select-more');
  }

  isReloading.value = true;
  await delay(1000);
  await showError('rc-imageselect-incorrect-response');
  await handleReload();
}

function toggleImageSelection(key: string): void {
  if (isReloading.value) return;

  if (selectedImages.value.includes(key)) {
    selectedImages.value = selectedImages.value.filter((item) => item !== key);
  } else {
    selectedImages.value.push(key);
  }
}

function fixPosition(): void {
  if (!containerRef.value) return;

  const bounding = containerRef.value.getBoundingClientRect();
  const style = selectorStyle.value;
  const isMobile = window.innerWidth < 470;

  showArrow.value = !isMobile;

  if (isMobile) {
    const width = window.innerWidth;
    style.width = `${width - 5}px`;
    wrapperSize.value = Math.floor((width - 5) / 3) - 7.55555;
    // 居中
    style.left = '0';
    style.right = '0';
    style.margin = 'auto';
  } else {
    style.width = '408px';
    wrapperSize.value = 128.5;
    style.left = `${bounding.left + 51}px`;
    style.top = `${bounding.top + 2}px`;
    delete style.margin;
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', () => {
    if (isVisible.value) fixPosition();
  });
});

// 监听
watch(isVisible, (value) => {
  fixPosition();
  const style = selectorStyle.value;
  style.visibility = value ? 'visible' : 'hidden';
  style.opacity = value ? '1' : '0';
  style.transition = value
    ? 'visibility 0s linear 0s, opacity 0.3s linear'
    : 'visibility 0s linear 0.3s, opacity 0.3s linear';
});
</script>

<style>
@import url('../assets/styles__ltr.css');

.captcha-container {
  text-align: left;
}

.captcha-box {
  width: 304px;
  height: 78px;
  cursor: pointer;
}

.rc-anchor {
  position: relative;
}

.rc-anchor-error-msg-container {
  display: none;
}

.captcha-overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2000000000;
  background-color: rgb(255, 255, 255);
  opacity: 0;
}

.captcha-selector {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(204, 204, 204);
  box-shadow: rgb(0 0 0 / 20%) 2px 2px 3px;
  position: absolute;
  transition:
    visibility 0s linear 0s,
    opacity 0.3s linear 0s;
  opacity: 1;
  z-index: 2000000000;
  visibility: hidden;
}

.outer-arrow {
  border-width: 11px;
  border-style: solid;
  border-color: transparent rgb(204, 204, 204) transparent transparent;
  border-image: initial;
  width: 0px;
  height: 0px;
  position: absolute;
  pointer-events: none;
  margin-top: -11px;
  z-index: 2000000000;
  top: 35px;
  right: 100%;
}

.inner-arrow {
  border-width: 10px;
  border-style: solid;
  border-color: transparent rgb(255, 255, 255) transparent transparent;
  border-image: initial;
  width: 0px;
  height: 0px;
  position: absolute;
  pointer-events: none;
  margin-top: -10px;
  z-index: 2000000000;
  top: 35px;
  right: 100%;
}

.rc-imageselect-instructions {
  margin-bottom: 7px;
}

.rc-imageselect-desc-no-canonical {
  font-size: 12px;
}

.object-name {
  font-size: 28px;
}

.recaptcha-checkbox-borderAnimation.loading {
  background-position: -28px -588px;
}

.recaptcha-checkbox-spinner.spinner {
  animation-play-state: running;
  opacity: 1;
  transform: scale(0);
}

.recaptcha-checkbox-spinner-overlay {
  animation-play-state: running;
}

.rc-challenge-help {
  display: none;
}

.rc-anchor-normal .rc-anchor-pt {
  margin: 2px 10px 0 0;
  padding-right: 0px;
}
</style>
