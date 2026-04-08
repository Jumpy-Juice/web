<template>
  <el-dialog
    v-model="open"
    class="kc-modal"
    width="min(720px, calc(100% - 24px))"
    :show-close="false"
    :close-on-click-modal="false"
    align-center
  >
    <template #header>
      <div class="kc-header">
        <div class="kc-badge">AI 小贴士</div>
        <div class="kc-title">{{ card?.title || 'AI小贴士' }}</div>
      </div>
    </template>

    <div class="kc-body">
      <div v-if="false" class="kc-image">
        <!-- 资源占位策略：不渲染真实图片，后续由美术同学接入 -->
      </div>

      <div class="kc-content" v-html="safeContent"></div>
    </div>

    <template #footer>
      <div class="kc-footer">
        <el-button type="primary" size="large" round @click="close">
          {{ card?.buttonText || '我知道啦' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

interface Props {
  modelValue: boolean
  cardId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const gameStore = useGameStore()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const card = computed(() => {
  const id = props.cardId?.trim()
  if (!id) return undefined
  return gameStore.cardsData[id]
})

const safeContent = computed(() => {
  // 允许 HTML 或换行：非 HTML 时把换行转为 <br/>
  const raw = card.value?.content ?? ''
  const looksLikeHtml = /<[^>]+>/.test(raw)
  return looksLikeHtml ? raw : raw.replace(/\n/g, '<br/>')
})

function close() {
  open.value = false
}
</script>

<style scoped>
.kc-modal :deep(.el-dialog) {
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(circle at 20% 10%, #e0f2fe 0%, #ffffff 35%, #f5f3ff 100%);
  border: 1px solid rgb(59 130 246 / 20%);
  box-shadow: 0 22px 60px rgb(0 0 0 / 18%);
}

.kc-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 2px 0;
}

.kc-badge {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #1d4ed8;
  background: rgb(59 130 246 / 12%);
  border: 1px solid rgb(59 130 246 / 20%);
  padding: 4px 10px;
  border-radius: 999px;
}

.kc-title {
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
}

.kc-body {
  display: grid;
  gap: 12px;
}

.kc-image {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px dashed rgb(124 58 237 / 35%);
  background: rgb(124 58 237 / 6%);
}

.kc-image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.kc-content {
  font-size: 16px;
  line-height: 1.9;
  color: #1f2937;
}

.kc-footer {
  display: flex;
  justify-content: center;
  padding-top: 6px;
}
</style>
