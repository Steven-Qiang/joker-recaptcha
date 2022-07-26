<template>
  <div>
    <div
      style="width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 2000000000; background-color: rgb(255, 255, 255); opacity: 0.05;"
      @click="close"
    ></div>
    <div class="gc-wrap">
      <div style="z-index: 2000000000; position: relative" class="gc-size-wrap">
        <div id="rc-imageselect" class="gc-size-wrap">
          <div id="rc-imageselect">
            <div class="rc-imageselect-response-field"></div>
            <span class="rc-imageselect-tabloop-begin" tabindex="0"></span>
            <div class="rc-imageselect-payload">
              <div class="rc-imageselect-instructions" style="margin-bottom: 7px;">
                <div class="rc-imageselect-desc-wrapper">
                  <div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 12px;">
                    选择所有包含<strong style="font-size: 28px;">{{ objectName }}</strong
                    >的所有图片
                  </div>
                </div>
                <div class="rc-imageselect-progress"></div>
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
                          role="button"
                          tabindex="0"
                          class="rc-imageselect-tile"
                          :class="{ 'rc-imageselect-tileselected': selectedId.includes(tr + '' + td) }"
                          aria-label="图片验证"
                          v-for="td in 3"
                          :key="td"
                          @click="itemClick(tr + '' + td)"
                        >
                          <div class="rc-image-tile-target">
                            <div class="rc-image-tile-wrapper" style="width: 126px; height: 126px">
                              <img
                                class="rc-image-tile-33"
                                :src="require('@/assets/payload/' + payload)"
                                :style="{ top: '-' + (tr - 1) * 100 + '%', left: '-' + (td - 1) * 100 + '%' }"
                              />
                              <div class="rc-image-tile-overlay"></div>
                            </div>
                            <div class="rc-imageselect-checkbox"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="rc-imageselect-incorrect-response" v-show="errorCode == 'rc-imageselect-incorrect-response'">
                请重试。
              </div>
              <div class="rc-imageselect-error-select-more" v-show="errorCode == 'rc-imageselect-error-select-more'">
                请选择所有相符的图片。
              </div>
            </div>
            <div class="rc-footer">
              <div class="rc-separator"></div>
              <div class="rc-controls">
                <div class="primary-controls">
                  <div class="rc-buttons">
                    <div class="button-holder reload-button-holder">
                      <button
                        class="rc-button goog-inline-block rc-button-reload"
                        title="换一个新的验证码"
                        value=""
                        id="recaptcha-reload-button"
                        tabindex="0"
                        @click="reload"
                      ></button>
                    </div>
                    <div class="button-holder help-button-holder">
                      <a
                        href="https://support.google.com/recaptcha/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rc-button goog-inline-block rc-button-help"
                        title="帮助"
                        value=""
                        id="recaptcha-help-button"
                        tabindex="0"
                      ></a>
                    </div>
                  </div>
                  <div class="verify-button-holder">
                    <button
                      class="rc-button-default goog-inline-block"
                      title=""
                      value=""
                      id="recaptcha-verify-button"
                      :class="{ 'rc-button-default-disabled': buttonDisabled }"
                      tabindex="0"
                      @click="verify"
                    >
                      验证
                    </button>
                  </div>
                </div>
                <div class="rc-challenge-help" style="display:none" tabindex="0"></div>
              </div>
            </div>
            <span class="rc-imageselect-tabloop-end" tabindex="0"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** css 和 html 来源为谷歌recaptcha官方。 */
import '@/assets/styles__ltr.css';

const payload_list = require
  .context('@/assets/payload', true, /^.*\.png$/)
  .keys()
  .map((x) => x.replace('./', ''));
const payload_random = () => payload_list[Math.floor(Math.random() * payload_list.length)];

const object_names = ['公交车', '消防栓', '烟囱', '山', '飞机', '过街人行道', '桥', '自行车'];
const object_random = () => object_names[Math.floor(Math.random() * object_names.length)];

export default {
  data() {
    return {
      buttonDisabled: false,
      objectName: object_random(),
      payload: payload_random(),
      selectedId: [],
      errorCode: '',
    };
  },
  methods: {
    verify() {
      if (this.selectedId.length < 2) {
        this.throwError('rc-imageselect-error-select-more');
        return;
      }
      this.buttonDisabled = true;
      setTimeout(() => {
        this.throwError('rc-imageselect-incorrect-response');
        this.reload();
      }, 1000);
    },
    close() {
      this.$emit('close');
    },
    reload() {
      this.buttonDisabled = true;
      this.selectedId = [];
      setTimeout(() => {
        const _id = this.payload;
        const _name = this.objectName;

        while (_id == this.payload) {
          this.payload = payload_random();
        }
        while (_name == this.objectName) {
          this.objectName = object_random();
        }
        this.buttonDisabled = false;
      }, 800);
    },
    throwError(n) {
      this.errorCode = n;
      setTimeout(() => {
        this.errorCode = '';
      }, 1000);
    },
    itemClick(id) {
      if (this.buttonDisabled) return;
      if (this.selectedId.includes(id)) {
        this.selectedId = this.selectedId.filter((x) => x != id);
      } else {
        this.selectedId.push(id);
      }
    },
  },
};
</script>
