/**
 * 第三章素材統一以 ESM import，確保 Vite 產生正確 URL（避免相對字串造成 404 / MIME 錯誤）。
 *
 * ===== 素材語意對照（檔名 → 用途）=====
 *
 * 【小派動作示意（適合：指令 ↔ 動作）】
 * - dance_videos/image_1776015117151.png：小派揮手 → 對應「你好」
 * - dance_videos/image_1776015116470.png：站立＋腰間能量環 → 暫作「轉圈」占位（若有旋轉中姿態請替換）
 * - dance_videos/image_1776015117805.png：跳躍／慶祝 → 對應「跳個舞」（複合動作的視覺輔助）
 * - dance_videos/image_1776015118483.png：測試感圖示 → 用於 Level3 標題點綴（不要放在右上 HUD）
 *
 * 【教學頁面框架／裝飾（不應當作某一個指令的動作圖）】
 * - spec/story_layout_ref.jpg：文檔中「第三章開場」整體佈局參考
 * - spec/base_brown.png：棕色底座（文檔要求：放在小芽下面露出邊）
 * - spec/label_voice_cmd.jpg：分欄標題「聲音指令」
 * - spec/label_action_show.jpg：分欄標題「動作表現」
 * - spec/panel_sample_sentence.jpg：樣本語句面板（Level2 生成區）
 * - spec/level2_checklist.png：Level2 清單式進度條（右側 3 條任務）
 * - spec/spark_stars.png：撒花星星（成長記錄/慶祝氛圍）
 *
 * 【角色／合照】
 * - level2/IMG_43744.png：形象圖（章節開場中部）
 */
import danceVideo1 from '../assets/chapter3/dance_videos/video_1776015086741.mp4'
import danceVideo2 from '../assets/chapter3/dance_videos/video_1776015093825.mp4'
import danceVideo3 from '../assets/chapter3/dance_videos/video_1776015096831.mp4'
import danceVideo4 from '../assets/chapter3/dance_videos/video_1776015114120.mp4'

import level4DebugIcon from '../assets/chapter3/system_prompts/image_1776015157757.png'
import level4PromptA from '../assets/chapter3/system_prompts/image_1776015159660.png'
import level4PromptB from '../assets/chapter3/system_prompts/image_1776015161220.png'

import poseSpinPlaceholder from '../assets/chapter3/dance_videos/image_1776015116470.png'
import poseWave from '../assets/chapter3/dance_videos/image_1776015117151.png'
import poseJump from '../assets/chapter3/dance_videos/image_1776015117805.png'
import iconTest from '../assets/chapter3/dance_videos/image_1776015118483.png'

import endChapterBadgeImg from '../assets/chapter3/growth_records/IMG_20260413_012035.png'
import chapterGroupHero from '../assets/chapter3/level2/IMG_43744.png'
import chapter3ConceptTriptych from '../assets/chapter3/image_1776000059529.png'

// Spec UI (from the design doc export)
import specStoryLayoutRef from '../assets/chapter3/spec/story_layout_ref.jpg'
import specBrownBase from '../assets/chapter3/spec/base_brown.png'
import specLabelVoiceCmd from '../assets/chapter3/spec/label_voice_cmd.jpg'
import specLabelActionShow from '../assets/chapter3/spec/label_action_show.jpg'
import specSampleSentencePanel from '../assets/chapter3/spec/panel_sample_sentence.jpg'
import specLevel2Checklist from '../assets/chapter3/spec/level2_checklist.png'
import specSparkStars from '../assets/chapter3/spec/spark_stars.png'
import specPaiTilt from '../assets/chapter3/spec/pai_tilt.jpg'
import specPaiDance from '../assets/chapter3/spec/pai_dance.jpg'
import xiaoyaPng from '../assets/chapter3/xiaoya.png'
import specLabelSampleTag from '../assets/chapter3/spec/label_sample_tag.jpg'
import specDropdownTag from '../assets/chapter3/spec/dropdown_tag.jpg'
import specBatteryShell from '../assets/chapter3/spec/progress_battery_shell.jpg'
import specBtnYes from '../assets/chapter3/spec/btn_yes.jpg'
import specBtnNo from '../assets/chapter3/spec/btn_no.jpg'
import specIconRepair from '../assets/chapter3/spec/icon_repair.png'
import specEndLayoutRef from '../assets/chapter3/spec/end_layout_ref.jpg'
import specEndBanner from '../assets/chapter3/spec/end_banner.png'
import specEndStars from '../assets/chapter3/spec/end_stars.png'
import specEndBrownBase from '../assets/chapter3/spec/end_brown_base.png'

export const level1ActionImages: Record<string, string> = {
  wave: poseWave,
  rotate: poseSpinPlaceholder,
  'rotate-jump': poseJump,
}

export const level1FooterStrip = [
  { id: 'hello', label: '你好 → 挥手', src: poseWave },
  { id: 'spin', label: '转圈 → 身体旋转360°', src: poseSpinPlaceholder },
  { id: 'dance', label: '跳个舞 → 先旋转，再跳跃', src: poseJump },
] as const

export const level2SampleImages = {
  hello: poseWave,
  spin: poseSpinPlaceholder,
  dance: poseJump,
} as const

export const level2DanceTrainingVideo = danceVideo1

export const level4Media = {
  headerIcon: level4DebugIcon,
  promptCardA: level4PromptA,
  promptCardB: level4PromptB,
  trainingVideos: [danceVideo1, danceVideo2, danceVideo3, danceVideo4] as const,
}

export const level3CommandPoses = {
  hello: poseWave,
  spin: poseSpinPlaceholder,
  dance: poseJump,
} as const

export const level3HeaderIcon = iconTest

export const level3DanceShowcaseVideo = danceVideo1

/** Center of story page (not top-right): avoids overlap with GlobalHUD */
export const storyChapterHero = chapterGroupHero

export const endChapterBadge = endChapterBadgeImg

export const chapter3SpecUi = {
  storyLayoutRef: specStoryLayoutRef,
  brownBase: specBrownBase,
  labelVoiceCmd: specLabelVoiceCmd,
  labelActionShow: specLabelActionShow,
  sampleSentencePanel: specSampleSentencePanel,
  level2Checklist: specLevel2Checklist,
  sparkStars: specSparkStars,
  badgePai: specPaiTilt,
  decoPaiDance: specPaiDance,
  xiaoya: xiaoyaPng,
  labelSampleTag: specLabelSampleTag,
  dropdownTag: specDropdownTag,
  batteryShell: specBatteryShell,
  btnYes: specBtnYes,
  btnNo: specBtnNo,
  iconRepair: specIconRepair,
  endLayoutRef: specEndLayoutRef,
  endBanner: specEndBanner,
  endStars: specEndStars,
  endBrownBase: specEndBrownBase,
} as const

/** 概念 icon 组图（查找/标注/禁止删除），适合做 Debug 装饰或选项卡片 icon。 */
export const chapter3ConceptIcons = chapter3ConceptTriptych
