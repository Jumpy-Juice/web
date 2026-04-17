<template>
  <el-dialog
    v-model="open"
    title="视频学习"
    width="800px"
    class="custom-video-dialog" 
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="onDialogClosed"
  >
    <div class="video-container">
      <template v-if="hasVideo">
        <div v-if="!isStarted" class="video-placeholder" @click="startPlay">
          <button class="play-btn-cream">
            <span class="play-icon">▶</span>
            播放
          </button>
        </div>
        
        <video
          v-else
          ref="videoRef"
          class="video-player"
          :src="videoSrc"
          controls
          autoplay
          playsinline
          @ended="handleEnded"
        >
          您的浏览器不支持视频播放。
        </video>
      </template>

      <div v-else class="fallback-content">
        <p>暂无视频资源: {{ videoLabel }}</p>
        <el-button @click="handleEnded">跳过模拟</el-button>
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

const isStarted = ref(false)

const hasVideo = computed(() => Boolean(props.videoSrc && props.videoSrc.trim()))
const videoLabel = computed(() => props.videoSrc || '未定义')

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

watch(() => props.modelValue, (val) => {
  if (val) isStarted.value = false
})

function startPlay() {
  isStarted.value = true
}

function handleEnded() {
  open.value = false
  emit('video-ended')
}

function onDialogClosed() {
  if (isStarted.value) {
    emit('video-ended')
  }
  isStarted.value = false
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding-bottom: 10px;
  background: #fff;
}

:deep(.el-dialog__body) {
  padding: 0 !important; 
  background-color: #000;
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9; 
  background: #000;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-placeholder {
  position: absolute;
  inset: 0;
  background: #000;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 10;
}

.play-btn-cream {
  background-color: #deb963; 
  color: #1c1c1c;           
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.play-btn-cream:hover {
  transform: scale(1.05);
  background-color: #fffdf9; 
}

.play-icon {
  font-size: 18px;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

.fallback-content {
  color: white;
  text-align: center;
}
</style>