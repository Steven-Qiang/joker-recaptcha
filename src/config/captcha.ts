export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type PassReason = 'max_attempts' | 'random_pass';

export interface CaptchaConfig {
  maxAttempts: number;
  passProbability: number;
  minSelection: number;
  showSuccessMessage: boolean;
  successMessage: string;
  errorMessage: string;
  difficulty: DifficultyLevel;
  showAttemptCount: boolean;
  autoCloseOnSuccess: boolean;
  autoReloadOnFailure: boolean;
  allowReload: boolean;
  // 自定义物体名称列表（优先使用）
  customObjectNames: string[];
}

export interface SuccessData {
  attempt: number;
  reason: PassReason;
  difficulty: DifficultyLevel;
  [key: string]: any;
}

export interface VerifyData {
  attempt: number;
  selectedImages: string[];
  difficulty: DifficultyLevel;
  [key: string]: any;
}

// 默认配置
export const defaultCaptchaConfig: CaptchaConfig = {
  // 尝试次数，达到次数后自动通过
  maxAttempts: 3, // 0表示永远不通过
  // 通过概率（0-100）
  passProbability: 20, // 0表示永远不通过
  // 最小选择数量
  minSelection: 2,
  // 是否显示成功消息
  showSuccessMessage: true,
  // 成功消息
  successMessage: '验证成功！恭喜你通过了测试',
  // 失败消息
  errorMessage: '请重试，再试一次吧',
  // 难度级别：easy, medium, hard
  difficulty: 'medium',
  // 是否显示尝试次数
  showAttemptCount: false,
  // 成功后是否自动关闭
  autoCloseOnSuccess: true,
  // 每次失败后是否自动刷新
  autoReloadOnFailure: true,
  // 是否允许刷新按钮
  allowReload: true,
  // 自定义物体名称列表
  customObjectNames: [],
};

// 合并配置
export function mergeCaptchaConfig(config: Partial<CaptchaConfig>): CaptchaConfig {
  return {
    ...defaultCaptchaConfig,
    ...config,
  };
}
