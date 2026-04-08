<template>
  <el-dialog
    v-model="open"
    fullscreen
    width="min(900px, calc(100% - 24px))"
    align-center
    :close-on-click-modal="false"
    @closed="onDialogClosed"
  >
    <template #header>
      <div class="title">视频播放</div>
    </template>

    <video
      v-if="hasVideo"
      ref="videoRef"
      class="video"
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
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
  endedByVideo.value = false
}
</script>

<style scoped>
.title {
  font-weight: 800;
}

.video {
  width: 100%;
  min-height: 320px;
  border-radius: 10px;
  background: #0f172a;
}

.fallback {
  min-height: 240px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  gap: 10px;
  background: #0f172a;
  color: #e2e8f0;
}

.mock-box {
  width: min(720px, calc(100% - 24px));
  display: grid;
  place-items: center;
  gap: 16px;
  padding: 24px 16px;
  border-radius: 14px;
  border: 1px solid rgb(148 163 184 / 35%);
  background: linear-gradient(180deg, rgb(15 23 42 / 100%) 0%, rgb(2 6 23 / 100%) 100%);
}

.mock-text {
  font-weight: 900;
  text-align: center;
  line-height: 1.7;
}
</style>
