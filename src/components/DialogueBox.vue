<template>
  <div class="dialogue-wrap" @click="handleNext">
    <el-card class="dialogue-card" shadow="hover">
      <div class="dialogue-header">
        <el-avatar :size="44" :src="avatarSrc">
          <span v-if="!avatarSrc">{{ avatarText }}</span>
        </el-avatar>
        <div class="speaker">{{ speakerName }}</div>
      </div>

      <div class="dialogue-content">{{ displayedText }}</div>
      <div class="dialogue-tip">点击继续</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  speakerName: string
  avatarText: string
  content: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'next'): void
}>()

const displayedText = ref('')
let typeTimer: number | undefined

const avatarSrc = computed(() => {
  const value = props.avatarText?.trim()
  if (!value) return ''

  const imagePattern = /^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/).+|.+\.(png|jpe?g|gif|webp|svg)$/i
  return imagePattern.test(value) ? value : ''
})

function startTyping(text: string) {
  if (typeTimer !== undefined) {
    window.clearInterval(typeTimer)
  }

  displayedText.value = ''
  let index = 0

  typeTimer = window.setInterval(() => {
    if (index >= text.length) {
      if (typeTimer !== undefined) {
        window.clearInterval(typeTimer)
      }
      return
    }
    displayedText.value += text[index]
    index += 1
  }, 35)
}

function handleNext() {
  emit('next')
}

watch(
  () => props.content,
  (newContent) => {
    startTyping(newContent ?? '')
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeTimer !== undefined) {
    window.clearInterval(typeTimer)
  }
})
</script>

<style scoped>
.dialogue-wrap {
  position: fixed;
  left: 50%;
  bottom: 20px;
  z-index: 1200;
  width: min(900px, calc(100% - 24px));
  transform: translateX(-50%);
  cursor: pointer;
}

.dialogue-card {
  border: 1px solid #d9ecff;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f4f9ff 100%);
}

.dialogue-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.speaker {
  font-size: 16px;
  font-weight: 700;
  color: #1f2d3d;
}

.dialogue-content {
  min-height: 68px;
  font-size: 16px;
  line-height: 1.75;
  color: #303133;
  white-space: pre-wrap;
}

.dialogue-tip {
  margin-top: 8px;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
</style>
