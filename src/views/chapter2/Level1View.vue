<template>
  <main class="level1-view">
    <el-card class="level-card" shadow="hover">
      <h1>把声音理解流程按正确顺序排好吧</h1>

      <section class="board">
        <div class="left-panel">
          <h2>步骤卡片（拖拽）</h2>
          <div class="card-list">
            <div
              v-for="item in unplacedCards"
              :key="item.id"
              class="step-card"
              :class="{ shake: wrongCardId === item.id }"
              draggable="true"
              @dragstart="onDragStart(item.id)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>

        <div class="right-panel">
          <h2>排序槽位</h2>
          <div
            v-for="slot in slots"
            :key="slot.order"
            class="slot"
            :class="{ shake: shakingSlot === slot.order }"
            @dragover.prevent
            @drop="onDrop(slot.order)"
          >
            <div class="slot-title">第{{ slot.order }}步</div>
            <div v-if="slot.card" class="slot-card">{{ slot.card.label }}</div>
            <div v-else class="slot-placeholder">拖到这里</div>
          </div>
        </div>
      </section>

      <el-alert
        v-if="hintText"
        class="hint"
        type="info"
        :closable="false"
        show-icon
        :title="hintText"
      />

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel2">
          [去看看小派为什么还是会听错]
        </el-button>
      </div>
    </el-card>

    <VideoPlayerModal
      v-model="showVideoOverlay"
      video-src=""
      @video-ended="onVideoEnded"
    />

    <KnowledgeCardModal
      v-model="showTipModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import VideoPlayerModal from '../../components/VideoPlayerModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

interface StepCard {
  id: string
  label: string
  order: number
}

interface SlotItem {
  order: number
  card: StepCard | null
}

const router = useRouter()
const gameStore = useGameStore()

const draggingId = ref<string | null>(null)
const hintText = ref('')
const shakingSlot = ref<number | null>(null)
const wrongCardId = ref('')
const showVideoOverlay = ref(false)
const rewarded = ref(false)
const showNextButton = ref(false)
const showTipModal = ref(false)
const activeCardId = ref('tip_what_is_asr')
const pendingReward = ref(false)

const cards = ref<StepCard[]>([
  { id: 'step-3', label: '分析比对', order: 3 },
  { id: 'step-1', label: '麦克风收音', order: 1 },
  { id: 'step-4', label: '输出结果', order: 4 },
  { id: 'step-2', label: '把声音变成信息', order: 2 },
])

const slots = ref<SlotItem[]>([
  { order: 1, card: null },
  { order: 2, card: null },
  { order: 3, card: null },
  { order: 4, card: null },
])

const unplacedCards = computed(() => {
  const placedIds = new Set(slots.value.filter((s) => s.card).map((s) => s.card!.id))
  return cards.value.filter((c) => !placedIds.has(c.id))
})

const isCompleted = computed(() => slots.value.every((slot) => slot.card?.order === slot.order))

function onDragStart(cardId: string) {
  draggingId.value = cardId
}

function onDrop(targetOrder: number) {
  if (!draggingId.value) return

  const card = cards.value.find((c) => c.id === draggingId.value)
  const droppedId = draggingId.value
  const targetSlot = slots.value.find((s) => s.order === targetOrder)
  draggingId.value = null
  if (!card || !targetSlot || targetSlot.card) return

  if (card.order !== targetOrder) {
    shakingSlot.value = targetOrder
    window.setTimeout(() => {
      if (shakingSlot.value === targetOrder) shakingSlot.value = null
    }, 360)
    wrongCardId.value = droppedId
    window.setTimeout(() => {
      if (wrongCardId.value === droppedId) wrongCardId.value = ''
    }, 420)
    ElMessage.warning('顺序不对，卡片弹回原处。')
    return
  }

  targetSlot.card = card
  hintText.value = getHint(card.order)
  ElMessage.success('放置正确！')

  if (isCompleted.value) {
    showVideoOverlay.value = true
  }
}

function getHint(order: number) {
  if (order === 1) return '第一步，要先用麦克风把声音录下来！'
  if (order === 2) return '第二步，要把声音变成AI能看懂的数据密码。'
  if (order === 3) return '第三步最关键！AI要在它的字典里找，这段密码到底是什么意思？'
  return '最后一步，把找到的意思变成文字或者动作表现出来！'
}

async function onVideoEnded() {
  // 通关 -> 触发卡片 -> 关闭后再飞星+加星
  activeCardId.value = 'tip_what_is_asr'
  gameStore.unlockCard(activeCardId.value)
  pendingReward.value = true
  showTipModal.value = true
}

function goLevel2() {
  router.push('/chapter2/level2')
}

watch(showTipModal, async (open) => {
  if (open) return
  if (!pendingReward.value || rewarded.value) return

  pendingReward.value = false
  rewarded.value = true
  await playEnergyStarFly()
  gameStore.addStar()
  ElMessage.success('恭喜！获得 1 颗小派能量星。')
  showNextButton.value = true
})
</script>

<style scoped>
.level1-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

h1 {
  margin: 0 0 14px;
  text-align: center;
  color: #1f2d3d;
}

.board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.card-list {
  min-height: 340px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-card {
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  font-weight: 700;
  color: #1e3a8a;
  cursor: grab;
}

.step-card.shake {
  animation: shake 0.42s ease;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slot {
  min-height: 74px;
  border: 2px dashed #93c5fd;
  border-radius: 10px;
  background: #f8fbff;
  padding: 10px;
}

.slot-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
}

.slot-card {
  border: 1px solid #86efac;
  background: #f0fdf4;
  color: #166534;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
}

.slot-placeholder {
  color: #94a3b8;
}

.hint {
  margin-top: 14px;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.shake {
  animation: shake 0.36s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@media (max-width: 900px) {
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
