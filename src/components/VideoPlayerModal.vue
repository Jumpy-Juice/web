<template>
  <el-dialog
    v-model="open"
    fullscreen
    class="custom-video-dialog" 
    append-to-body
    :close-on-click-modal="false"
    @closed="onDialogClosed"
  >
    <template #header>
      <div class="title">视频播放</div>
    </template>

    <div class="video-content-wrapper">
      <video
        v-if="hasVideo"
        ref="videoRef"
        class="video-element"
        :src="videoSrc"
        controls
        autoplay
        playsinline
        @ended="handleEnded"
      >
        当前浏览器不支持视频播放。
      </video>

      <div v-else class="fallback">
        <div class="mock-box" role="group" aria-label="视频占位播放区域">
          <div class="mock-text">▶️ 播放视频：{{ videoLabel }}</div>
          <el-button type="primary" size="large" round @click="handleEnded">[模拟视频播放完毕]</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  videoSrc: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'video-ended'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const endedByVideo = ref(false)
const hasVideo = computed(() => Boolean(props.videoSrc && props.videoSrc.trim()))
const videoLabel = computed(() => (hasVideo.value ? props.videoSrc : props.videoSrc?.trim() || '（未提供视频资源）'))

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      endedByVideo.value = false
      if (hasVideo.value) {
        window.setTimeout(() => {
          videoRef.value?.play().catch(() => {})
        }, 0)
      }
    }
  },
)

function handleEnded() {
  endedByVideo.value = true
  open.value = false
  emit('video-ended')
}

function onDialogClosed() {
  const shouldAdvance = !endedByVideo.value
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
  if (shouldAdvance) {
    emit('video-ended')
  }
  endedByVideo.value = false
}
</script>

<style scoped>
/* 1. 强制覆盖 Element 弹窗内部样式 */
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000; /* 黑色底色 */
  padding: 0 !important;
  height: calc(100vh - 54px); /* 动态计算内容区高度 */
  overflow: hidden;
}

/* 2. 视频内容包装器 */
.video-content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 3. 核心：智能适配横竖版 */
.video-element {
  /* 优先占据宽度，保证 16:9 视频足够大 */
  width: 100%; 
  max-width: 1200px; /* 如果是超宽屏，限制最大显示宽度 */
  
  /* 同时限制高度，解决竖版视频超出问题 */
  max-height: 85vh; 
  
  /* 解决第二个视频变小的关键：确保它不被 flex 容器过度压缩 */
  flex-shrink: 0; 

  /* 保持比例 */
  object-fit: contain; 
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
}

.title {
  font-weight: 800;
  color: #1c1c1c;
}

/* 占位图也需要占满空间 */
.fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #0f172a;
}
</style>