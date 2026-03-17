<template>
  <div class="captcha-container">
    <!-- 长条框 -->
    <div ref="container" class="captcha-box" @click="showCaptcha">
      <div id="rc-anchor-alert" class="rc-anchor-alert" />
      <div
        id="rc-anchor-container"
        class="rc-anchor rc-anchor-normal rc-anchor-light"
        :class="{ 'rc-anchor-checked': isSuccess }"
      >
        <div
          id="recaptcha-accessible-status"
          class="rc-anchor-aria-status"
          aria-hidden="true"
        >
          {{ isSuccess ? "验证成功" : "Recaptcha 要求验证." }}
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
                  class="recaptcha-checkbox goog-inline-block rc-anchor-checkbox"
                  :class="[
                    checkboxStateClass,
                    {
                      'recaptcha-checkbox-checked': isSuccess,
                      'recaptcha-checkbox-unchecked': !isSuccess,
                    },
                  ]"
                  role="checkbox"
                  :aria-checked="isSuccess"
                  dir="ltr"
                  aria-labelledby="recaptcha-anchor-label"
                  :aria-disabled="isSuccess"
                  tabindex="0"
                  @mouseenter="handleCheckboxHover(true)"
                  @mouseleave="handleCheckboxHover(false)"
                  @mousedown="handleCheckboxActive(true)"
                  @mouseup="handleCheckboxActive(false)"
                  @focus="handleCheckboxFocus(true)"
                  @blur="handleCheckboxFocus(false)"
                >
                  <div
                    v-show="!isLoading && !isSuccess"
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
              />{{ isSuccess ? "验证成功" : "进行人机身份验证" }}</label>
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
                <div v-if="props.config.showAttemptCount" class="attempt-count">
                  尝试次数: {{ attemptCount
                  }}{{
                    props.config.maxAttempts > 0
                      ? `/${props.config.maxAttempts}`
                      : ""
                  }}
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
                    <tr v-for="tr in gridSize.rows" :key="tr">
                      <td
                        v-for="td in gridSize.cols"
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
                              :src="payloadFile"
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
              {{ props.config.errorMessage }}
            </div>
            <div
              v-show="errorCode === 'rc-imageselect-error-select-more'"
              class="rc-imageselect-error-select-more"
            >
              请选择所有相符的图片。
            </div>
            <div
              v-show="successMessage"
              class="rc-imageselect-success-response"
            >
              {{ successMessage }}
            </div>
          </div>
          <div class="rc-footer">
            <div class="rc-separator" />
            <div class="rc-controls">
              <div class="primary-controls">
                <div class="rc-buttons">
                  <div
                    v-if="props.config.allowReload"
                    class="button-holder reload-button-holder"
                  >
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
import type { CaptchaConfig, SuccessData, VerifyData } from './config';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { defaultCaptchaConfig } from './config';

const props = withDefaults(
  defineProps<{
    config?: CaptchaConfig;
    payloadList?: string[];
  }>(),
  {
    config: () => defaultCaptchaConfig,
    payloadList: undefined,
  },
);

const emit = defineEmits<{
  verify: [data: VerifyData];
  success: [data: SuccessData];
  error: [message: string];
}>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const defaultObjectNames
  = '公交车,消防栓,烟囱,山,飞机,过街人行道,桥,自行车,停止标志,路标,店铺门面,植物,花,树木,棕榈树,水域,河流,海滩,天空,小轿车,船,出租车,校车,火车,雕像,喷泉,柱子,房屋,公寓楼,广告牌,道路,人行横道,红绿灯,公交站,锥形交通路标,停车计时器,拖拉机'.split(
    ',',
  );
const payloadList = props.payloadList || [];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPayload(): string {
  return getRandomItem(payloadList);
}

function getRandomObjectName(): string {
  const objectList
    = props.config.customObjectNames.length > 0
      ? props.config.customObjectNames
      : defaultObjectNames;
  return getRandomItem(objectList);
}

const isVisible = ref(false);
const isLoading = ref(false);
const isReloading = ref(false);
const showArrow = ref(false);
const selectedImages = ref<string[]>([]);
const wrapperSize = ref(126);
const errorCode = ref<string>('');
const objectName = ref(getRandomObjectName());
const payloadFile = ref(getRandomPayload());
const containerRef = useTemplateRef('container');
const attemptCount = ref(0);
const isSuccess = ref(false);
const successMessage = ref('');
const isHovered = ref(false);
const isFocused = ref(false);
const isActive = ref(false);

const gridSize = { rows: 3, cols: 3 };

const checkboxStateClass = computed(() => {
  if (isSuccess.value) return 'recaptcha-checkbox-checked';
  if (isActive.value) return 'recaptcha-checkbox-active';
  if (isHovered.value) return 'recaptcha-checkbox-hover';
  if (isFocused.value) return 'recaptcha-checkbox-focused';
  return '';
});

function handleCheckboxHover(hovered: boolean): void {
  isHovered.value = hovered;
}

function handleCheckboxActive(active: boolean): void {
  isActive.value = active;
}

function handleCheckboxFocus(focused: boolean): void {
  isFocused.value = focused;
}

interface DifficultyParams {
  minSelection: number;
  passProbability: number;
}

function getDifficultyParams(): DifficultyParams {
  const difficulty = props.config.difficulty;
  switch (difficulty) {
    case 'easy':
      return {
        minSelection: 1,
        passProbability: props.config.passProbability + 20,
      };
    case 'hard':
      return {
        minSelection: Math.max(3, props.config.minSelection),
        passProbability: Math.max(0, props.config.passProbability - 20),
      };
    default:
      return {
        minSelection: props.config.minSelection,
        passProbability: props.config.passProbability,
      };
  }
}

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

async function reloadCaptcha(): Promise<void> {
  const currentPayload = payloadFile.value;
  const currentObject = objectName.value;

  while (payloadFile.value === currentPayload) {
    payloadFile.value = getRandomPayload();
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

async function showSuccess(): Promise<void> {
  successMessage.value = props.config.successMessage;
  await delay(1500);
  successMessage.value = '';
}

async function showCaptcha(): Promise<void> {
  if (isSuccess.value) return;

  isLoading.value = true;
  await reloadCaptcha();
  await delay(300);
  isVisible.value = true;
  await delay(300);
  isLoading.value = false;
}

async function verifySelection(): Promise<void> {
  if (isSuccess.value) return;

  const difficultyParams = getDifficultyParams();

  if (selectedImages.value.length < difficultyParams.minSelection) {
    emit('error', '请选择足够的图片');
    return showError('rc-imageselect-error-select-more');
  }

  attemptCount.value++;
  emit('verify', {
    attempt: attemptCount.value,
    selectedImages: selectedImages.value,
    difficulty: props.config.difficulty,
  });

  // 检查是否达到最大尝试次数
  const reachedMaxAttempts
    = props.config.maxAttempts > 0
      && attemptCount.value >= props.config.maxAttempts;
  // 检查是否随机通过
  const randomPass
    = difficultyParams.passProbability > 0
      && Math.random() * 100 < difficultyParams.passProbability;

  if (reachedMaxAttempts || randomPass) {
    // 验证成功
    isSuccess.value = true;
    isReloading.value = true;
    await delay(1000);

    if (props.config.showSuccessMessage) {
      await showSuccess();
    }

    if (props.config.autoCloseOnSuccess) {
      isVisible.value = false;
    }
    isReloading.value = false;
    emit('success', {
      attempt: attemptCount.value,
      reason: reachedMaxAttempts ? 'max_attempts' : 'random_pass',
      difficulty: props.config.difficulty,
    });
  } else {
    // 验证失败
    isReloading.value = true;
    await delay(1000);
    await showError('rc-imageselect-incorrect-response');
    if (props.config.autoReloadOnFailure) {
      await handleReload();
    }
    emit('error', '验证失败');
  }
}

function toggleImageSelection(key: string): void {
  if (isReloading.value || isSuccess.value) return;

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
    style.width = `${width - 10}px`;
    wrapperSize.value = Math.floor((width - 10) / 3) - 7.55555;
    // 居中
    style.left = '50%';
    style.transform = 'translateX(-50%)';
    style.top = `${bounding.top + 2}px`;
    delete style.right;
    delete style.margin;
  } else {
    style.width = '408px';
    wrapperSize.value = 128.5;
    style.left = `${bounding.left + 51}px`;
    style.top = `${bounding.top + 2}px`;
    delete style.transform;
    delete style.right;
    delete style.margin;
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    if (isVisible.value) fixPosition();
  });
});

watch(isVisible, (value) => {
  fixPosition();
  const style = selectorStyle.value;
  style.visibility = value ? 'visible' : 'hidden';
  style.opacity = value ? '1' : '0';
  style.transition = value
    ? 'visibility 0s linear 0s, opacity 0.3s linear'
    : 'visibility 0s linear 0.3s, opacity 0.3s linear';
});

watch(
  () => props.config,
  async () => {
    objectName.value = getRandomObjectName();
    attemptCount.value = 0;
    isSuccess.value = false;
    selectedImages.value = [];
    errorCode.value = '';
    successMessage.value = '';
    isReloading.value = false;
    if (isVisible.value) {
      await reloadCaptcha();
    }
  },
  { deep: true },
);

watch(
  () => props.payloadList,
  async () => {
    if (isVisible.value) {
      await reloadCaptcha();
    }
  },
  { deep: true },
);
</script>

<style scoped>
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

.recaptcha-checkbox-nodatauri.recaptcha-checkbox-borderAnimation {
  background-image: url(./icon/checkbox_sprite.png);
}

.recaptcha-checkbox-spinner.spinner {
  animation-play-state: running !important;
  opacity: 1;
  transform: scale(0);
}

.recaptcha-checkbox-spinner-overlay {
  animation-play-state: running !important;
}

.rc-imageselect-success-response {
  color: #4caf50;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.attempt-count {
  font-size: 11px;
  color: #666;
  margin-top: 5px;
  text-align: center;
  font-style: italic;
}

.rc-challenge-help {
  display: none;
}

.rc-anchor-normal .rc-anchor-pt {
  margin: 2px 10px 0 0;
  padding-right: 0px;
}

.rc-anchor-checked {
  opacity: 0.8;
}

.recaptcha-checkbox-checked {
  background-position: -58px 0;
}

.recaptcha-checkbox-checked .recaptcha-checkbox-checkmark {
  opacity: 1;
}

.goog-inline-block {
  position: relative;
  display: -moz-inline-box;
  display: inline-block;
}

.recaptcha-checkbox {
  border: none;
  font-size: 1px;
  height: 28px;
  margin: 4px;
  width: 28px;
  overflow: visible;
  outline: 0;
  vertical-align: text-bottom;
}

.recaptcha-checkbox-hover .recaptcha-checkbox-border,
.recaptcha-checkbox-hover .recaptcha-checkbox-spinner-gif {
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
  border: 2px solid #b2b2b2;
}

.recaptcha-checkbox-focused .recaptcha-checkbox-border,
.recaptcha-checkbox-focused .recaptcha-checkbox-spinner-gif {
  border: 2px solid #4d90fe;
}

.recaptcha-checkbox-active .recaptcha-checkbox-border,
.recaptcha-checkbox-active .recaptcha-checkbox-spinner-gif {
  background-color: #ebebeb;
}

.recaptcha-checkbox-disabled .recaptcha-checkbox-border,
.recaptcha-checkbox-disabled .recaptcha-checkbox-spinner-gif {
  background-color: #f1f1f1;
}

.recaptcha-checkbox-loading .recaptcha-checkbox-spinner-gif {
  background-image: url('./icon/loading.gif');
}

.recaptcha-checkbox-checked .recaptcha-checkbox-border {
  visibility: hidden;
}

.recaptcha-checkbox-checked .recaptcha-checkbox-checkmark {
  opacity: 1;
  transform: scale(1);
  animation: checkmark-sprite-animation 0.6s steps(20) forwards;
  animation-delay: 0.1s;
}

.recaptcha-checkbox-expired .recaptcha-checkbox-border,
.recaptcha-checkbox-expired .recaptcha-checkbox-spinner-gif {
  border: 2px solid #d93025;
}

.recaptcha-checkbox-border {
  border-radius: 2px;
  background-color: #fff;
  border: 2px solid #444746;
  font-size: 1px;
  height: 24px;
  position: absolute;
  width: 24px;
  z-index: 1;
}

.recaptcha-checkbox-borderAnimation {
  background-image: url(./assets/icon/border_animation.png);
  background-repeat: no-repeat;
  border: none;
  height: 28px;
  outline: 0;
  position: absolute;
  width: 28px;
  background-position: 0 0;
}

.recaptcha-checkbox-borderAnimation.loading {
  background-position: -28px -588px;
  animation: border-animation-loading 1.2s steps(20) infinite;
}

@keyframes border-animation-loading {
  0% {
    background-position: -28px 0;
  }
  100% {
    background-position: -28px -560px;
  }
}

.recaptcha-checkbox-spinner {
  background-color: #f9f9f9;
  border: 6px solid #4d90fe;
  border-radius: 36px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  height: 36px;
  left: -4px;
  outline: 0;
  position: absolute;
  top: -4px;
  width: 36px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  opacity: 0;
  -webkit-animation: spinner-spin linear 2.5s infinite;
  animation: spinner-spin linear 2.5s infinite;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  -webkit-transition-duration: 1s;
  transition-duration: 1s;
}

@-webkit-keyframes spinner-spin {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }

  10% {
    -webkit-transform: rotateZ(135deg);
    transform: rotateZ(135deg);
  }

  25% {
    -webkit-transform: rotateZ(245deg);
    transform: rotateZ(245deg);
  }

  60% {
    -webkit-transform: rotateZ(700deg);
    transform: rotateZ(700deg);
  }

  75% {
    -webkit-transform: rotateZ(810deg);
    transform: rotateZ(810deg);
  }

  100% {
    -webkit-transform: rotateZ(3turn);
    transform: rotateZ(3turn);
  }
}

@keyframes spinner-spin {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }

  10% {
    -webkit-transform: rotateZ(135deg);
    transform: rotateZ(135deg);
  }

  25% {
    -webkit-transform: rotateZ(245deg);
    transform: rotateZ(245deg);
  }

  60% {
    -webkit-transform: rotateZ(700deg);
    transform: rotateZ(700deg);
  }

  75% {
    -webkit-transform: rotateZ(810deg);
    transform: rotateZ(810deg);
  }

  100% {
    -webkit-transform: rotateZ(3turn);
    transform: rotateZ(3turn);
  }
}

.recaptcha-checkbox-spinner-overlay {
  content: '';
  position: absolute;
  top: -7px;
  left: -7px;
  width: 38px;
  height: 19px;
  background-color: #f9f9f9;
  -webkit-animation: overlay-spin linear 1s;
  animation: overlay-spin linear 1s;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  -webkit-transform-origin: bottom center;
  -ms-transform-origin: bottom center;
  transform-origin: bottom center;
  border-radius: 38px 38px 0 0;
  -webkit-transform: rotateZ(45deg);
  -ms-transform: rotate(45deg);
  transform: rotateZ(45deg);
  opacity: 0;
}

@-webkit-keyframes overlay-spin {
  0% {
    opacity: 1;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateZ(225deg);
    transform: rotateZ(225deg);
  }
}

@keyframes overlay-spin {
  0% {
    opacity: 1;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  100% {
    opacity: 1;
    -webkit-transform: rotateZ(225deg);
    transform: rotateZ(225deg);
  }
}

.recaptcha-checkbox-checkmark {
  background-image: url(./assets/icon/checkbox_checkmark.png);
  background-repeat: no-repeat;
  border: none;
  height: 30px;
  left: -5px;
  outline: 0;
  position: absolute;
  width: 38px;
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.recaptcha-checkbox-checked .recaptcha-checkbox-checkmark {
  opacity: 1;
  transform: scale(1);
  animation: checkmark-sprite-animation 0.6s steps(20) forwards;
  animation-delay: 0.1s;
}

@keyframes checkmark-sprite-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -600px;
  }
}

.recaptcha-checkbox-disabled .recaptcha-checkbox-border {
  background-color: #f1f1f1;
}

.recaptcha-checkbox-checked .recaptcha-checkbox-border {
  visibility: hidden;
}

.recaptcha-checkbox-checked .recaptcha-checkbox-checkmark {
  background-position: 0 -600px;
}

.rc-anchor {
  border-radius: 3px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.08);
}

.rc-anchor-normal {
  height: 74px;
  width: 300px;
}

.rc-anchor-light {
  background: #f9f9f9;
  color: #000;
}

.rc-anchor-light.rc-anchor-normal {
  border: 1px solid #d3d3d3;
}

.rc-inline-block {
  display: inline-block;
  height: 100%;
}

.rc-anchor-center-container {
  display: table;
  height: 100%;
}

.rc-anchor-center-item {
  display: table-cell;
  vertical-align: middle;
}

.rc-anchor-content {
  display: inline-block;
  position: relative;
}

.rc-anchor-normal .rc-anchor-content {
  height: 74px;
  width: 206px;
}

.rc-anchor-checkbox {
  margin: 0 12px 2px 12px;
}

.rc-anchor-checkbox-label {
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
}

.rc-anchor-normal .rc-anchor-checkbox-label {
  width: 152px;
}

.rc-anchor-error-msg-container {
  color: #d93025;
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  left: 0;
  line-height: 14px;
  margin: 2px;
  position: absolute;
  top: 0;
}

.rc-anchor-normal.rc-anchor-error .rc-anchor-error-msg-container {
  width: 240px;
}

.rc-anchor-normal.rc-anchor-error .rc-anchor-content {
  margin-top: 10px;
}

.rc-anchor-normal-footer {
  display: inline-block;
  height: 74px;
  vertical-align: top;
  width: 70px;
}

.rc-anchor-logo-img {
  background: url(assets/icon/logo_48.png);
  background-repeat: no-repeat;
}

.rc-anchor-logo-text {
  cursor: default;
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 10px;
  margin-top: 5px;
  text-align: center;
}

.rc-anchor-light .rc-anchor-logo-text,
.rc-anchor-light div a:link,
.rc-anchor-light div a:visited {
  color: #555;
}

.rc-anchor-logo-portrait {
  margin: 10px 0 0 26px;
  width: 58px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.rc-anchor-logo-img-portrait {
  -webkit-background-size: 32px 32px;
  background-size: 32px;
  height: 32px;
  margin: 0 13px 0 13px;
  width: 32px;
}

.rc-anchor-normal .rc-anchor-pt {
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 8px;
  font-weight: 400;
}

.rc-anchor-pt {
  background-image: url(data:image/png;base64,iVBORw0KGgBX2EQZQBOnoDD2UcBhW1sSiNmRQ8RLXQFNGEeygBY2c9ObVv9U1t63RNBc6wgU2VvBPuEb0HRObDgBXlGjaztkBWm8aGJkATRZZa3RzU6xhDAwBuFJvGDokk0hlRv6FSghlBGdtzcqF6RQBVwudRzWvBcGFXHkxMO6F5Dx0B0GGK82EPKTobIlQ1OwBag4xQGEuQbhhZExTpOMDBdWcMLJAH6z05bpVM3n1yIHoBny71Em5nBb3FFaA1IB1nQYk269fH5kcxBuVnl2DwBHU8DmmdyZWV0Kp9/B/utvhXIgX65veQBbxxyTBBhPIp43wBuV2HH3NWZDvKaRUBcaWcBYwCccgG1CS5ayvpLA+VaS2AoJEGZWOY/OJHry+PRBih8RohtGaoLIEyGBdlheMvRrX9ddH3tfKX9eyhoEy/2dl3sqLyixil0zXIrepVxUhxsq0CN8YypdBCrZLgz43ZCkKTB8Pqf4WkFkNSU3fTWFahPQLh42Bv853YXR2dHIBo7Vtbh5kR3Jm/t/o8WUBb4M/nElvLlCkb4TpsrVtByaN2YWM35OlwBOjsdc8PAB01o/BdE5l9unUdAooYXA74zIBawZfP8ccRU+Gb5hvUABVU0zkLigyABoG7f6XMOZHcTVVMBdAFk3zQB1G/Ea9NwaXQnBZnF2RxZlSI96RQBI89vGAM3C9I9p4U+RXPsBdJjXfmUB/Nt6pN2ZX3cUin0lWs98YnyzBaWA3ZOr3R7hqBfatk020qBfBoRLHL6KHIBakhwo3XdbxkBUh6HRnEkfhv+fV1Zrn87g80uFFbUIA9Qtsxx+4pcPURUGvI/BHxZG75dkfdfKKVTm1OlkAQZD1Hb7EeEgylwBdHIenSyS95xEYe5pbgQBYZV2E255ZTuaZHo);
}

.rc-anchor-pt a {
  display: inline;
  padding-left: 1px;
  padding-right: 1px;
  padding-top: 2px;
  padding-bottom: 2px;
  text-decoration: none;
}

.rc-anchor-pt a:hover {
  text-decoration: underline;
}

.rc-anchor-normal .rc-anchor-pt {
  margin: 2px 11px 0 0;
  padding-right: 2px;
  position: absolute;
  right: 0;
  text-align: right;
  width: 276px;
}

.rc-anchor-aria-status {
  display: none;
}

#rc-anchor-alert,
.rc-anchor-alert {
  color: red;
  font-size: 9px;
  margin: 2px;
  position: absolute;
  top: 0;
}

.rc-button-default {
  background: #1a73e8;
  border: 0;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 42px;
  line-height: 42px;
  min-width: 100px;
  padding: 0 10px 0 10px;
  text-align: center;
  text-transform: uppercase;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

.rc-button-default:focus {
  outline: 0;
  -webkit-box-shadow: 0 0 0 2pt #185abc;
  box-shadow: 0 0 0 2pt #185abc;
}

.rc-button-default-disabled {
  background: rgba(73, 143, 225, 0.5);
  cursor: default;
}

body {
  margin: 0;
}

.rc-imageselect-instructions strong {
  font-weight: 900;
  display: block;
  font-size: 28px;
}

.rc-footer {
  font-family: Roboto, helvetica, arial, sans-serif;
  position: relative;
  width: 100%;
}

.rc-separator {
  border-top: 1px solid #dfdfdf;
  margin-bottom: 1px;
}

.rc-controls {
  width: 100%;
}

.primary-controls {
  height: 60px;
}

.rc-buttons {
  float: left;
  height: 48px;
  margin: 6px 0 6px 6px;
  background-repeat: no-repeat;
}

.button-holder {
  float: left;
  height: 48px;
}

.rc-button-reload {
  background: url(assets/icon/refresh_2x.png);
}

.rc-button-reload:focus-visible {
  background-color: #d8d8d8;
}

@media screen and (forced-colors: active) and (prefers-color-scheme: dark) {
  .rc-button-reload {
    background: url(assets/icon/refresh_white_2x.png);
  }
}

.rc-button-image {
  background: url(assets/icon/image_2x.png);
}

.rc-button-image:focus-visible {
  background-color: #d8d8d8;
}

@media screen and (forced-colors: active) and (prefers-color-scheme: dark) {
  .rc-button-image {
    background: url(assets/icon/image_white_2x.png);
  }
}

.rc-button-help {
  background: url(assets/icon/info_2x.png);
}

.rc-button-help:focus-visible {
  background-color: #d8d8d8;
}

@media screen and (forced-colors: active) and (prefers-color-scheme: dark) {
  .rc-button-help {
    background: url(assets/icon/info_white_2x.png);
  }
}

.rc-button {
  -webkit-background-size: 32px 32px;
  background-size: 32px 32px;
  cursor: pointer;
  height: 48px;
  opacity: 0.55;
  width: 48px;
  padding: 0;
  border: 0;
  background-repeat: no-repeat;
  background-position: center;
}

.rc-button:focus,
.rc-button:hover {
  opacity: 0.8;
  outline: 0;
}

.verify-button-holder {
  float: right;
  margin: 8px 8px 9px 0;
}

.rc-challenge-help {
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  overflow-y: scroll;
  padding: 5px 20px 5px 20px;
}

.goog-container:focus {
  outline: 0;
}

.goog-container:focus {
  outline: 0;
}

#rc-imageselect {
  min-width: 240px;
  font-family: Roboto, helvetica, arial, sans-serif;
  background-color: #fff;
}

#rc-imageselect .rc-button:focus {
  outline: 0;
}

.rc-imageselect-desc {
  margin-left: -10px;
  margin-top: -10px;
  padding-right: 100px;
  position: relative;
}

.rc-imageselect-instructions .rc-imageselect-desc strong {
  font-size: 22px;
}

.rc-imageselect-desc span {
  display: block;
}

.rc-imageselect-desc-no-canonical {
  position: relative;
}

.rc-imageselect-desc-no-canonical span {
  display: block;
}

.rc-imageselect-payload {
  min-width: 240px;
  margin: 0 7px;
  padding: 7px 0;
}

.rc-imageselect-challenge {
  position: relative;
  width: 100%;
  height: 100%;
}

.rc-footer {
  min-width: 240px;
}

.rc-imageselect-error-select-more,
.rc-imageselect-incorrect-response {
  color: #d93025;
  font-size: 14px;
  padding: 7px 0;
  text-align: center;
  width: 100%;
  background-color: #fff;
}

.rc-imageselect-desc-wrapper {
  margin-bottom: 6px;
}

.rc-imageselect-checkbox {
  background: url(./assets/icon/imageselect_checkbox.png);
  display: none;
  position: absolute;
}

.rc-imageselect-table-33,
.rc-imageselect-table-42,
.rc-imageselect-table-44 {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  height: 100%;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
}

.rc-imageselect-table-33,
.rc-imageselect-table-42 {
  margin: -2px;
}

.rc-imageselect-table-44 {
  margin: -1px;
}

.rc-imageselect-table-42 td {
  padding: 2px;
}

.rc-imageselect-table-33 td {
  padding: 2px;
}

.rc-imageselect-table-44 td {
  padding: 1px;
}

.rc-image-tile-target tr,
td {
  margin: 0;
}

td:focus {
  outline: 0;
}

.rc-image-tile-overlay {
  display: none;
  opacity: 0;
  position: absolute;
  background-color: #1a73e8;
  width: 100%;
  height: 100%;
  z-index: 2;
  -webkit-transition: opacity 1s cubic-bezier(0.49, 0.78, 0.46, 1.34);
  transition: opacity 1s cubic-bezier(0.49, 0.78, 0.46, 1.34);
}

.rc-image-tile-target {
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.rc-image-tile-wrapper {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.rc-imageselect-challenge {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.rc-imageselect-response-field-error {
  border-bottom: 1px solid red;
}

.rc-imageselect-desc {
  font-size: 16px;
}

.rc-imageselect-desc-wrapper span {
  font-size: 14px;
}

.rc-image-tile-wrapper {
  overflow: hidden;
  position: relative;
  -webkit-transition: 0.1s ease;
  transition: 0.1s ease;
}

.rc-image-tile-wrapper img {
  position: relative;
  -webkit-user-drag: none;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}

.rc-image-tile-11 {
  width: 100%;
  height: 100%;
}

.rc-image-tile-42 {
  width: 200%;
  height: 400%;
}

.rc-image-tile-33 {
  width: 300%;
  height: 300%;
}

.rc-image-tile-44 {
  width: 400%;
  height: 400%;
}

.rc-imageselect-instructions {
  height: 113px;
  width: 100%;
  margin-bottom: 7px;
  position: relative;
}

.rc-imageselect-desc-wrapper {
  background-color: #1a73e8;
  position: relative;
  padding: 24px;
  color: #fff;
  height: 66px;
  font-size: 16px;
}

.rc-imageselect-progress {
  background-color: #417cc1;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 15px;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
}

.rc-imageselect-tileselected {
  position: relative;
}

.rc-imageselect-tileselected .rc-image-tile-wrapper {
  -webkit-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);
}

.rc-image-tile-wrapper {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
}

.rc-imageselect-tileselected .rc-imageselect-checkbox {
  display: block;
  background-repeat: no-repeat;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
</style>
