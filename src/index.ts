import Captcha from './Captcha.vue';

export { defaultCaptchaConfig, mergeCaptchaConfig } from './config';
export type {
  CaptchaConfig,
  DifficultyLevel,
  PassReason,
  SuccessData,
  VerifyData,
} from './config';

export default Captcha;
