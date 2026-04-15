<template>
  <main class="level1-view">
    <el-card class="level-card" shadow="hover">
      <div class="float-sticker sticker-star">⭐</div>
      <div class="float-sticker sticker-bell">🔔</div>
      <div class="float-sticker sticker-ribbon">🎀</div>
      <aside class="progress-hud" aria-label="关卡进度">
        <p class="hud-title">分类进度</p>
        <p class="hud-number">{{ placedCount }}/{{ totalCount }}</p>
        <div class="hud-bar">
          <span :style="{ width: progressPercent + '%' }"></span>
        </div>
      </aside>

      <div class="head-meta">
        <span>Chapter 1 · Level 1</span>
        <span>Classification Mission</span>
      </div>
      <h1><span class="title-icon">🧭</span> 第一关：AI朋友在哪里</h1>
      <p class="intro">
        <strong>小芽：</strong>你知道吗，不是所有会动的东西都是“会听话”的 AI 朋友。真正的语音 AI，要能
        “听见你说了什么、理解你说的意思、然后做出回应”。我们来试试分分类？
      </p>
      <p class="intro">
        你看，一个AI朋友要真正“会听话”，需要完成三个步骤：第一步，听见；第二步，听懂；第三步，回应。
        现在你来试试，把下面这些东西分分类，看看哪些算是“会听话”的AI朋友？
      </p>
      <p class="tip-line">小贴士：会自己动 ≠ 会听话</p>

      <h2 class="guide-text">把下面这些物品分到正确的位置吧。</h2>

      <section class="zones">
        <div class="zone">
          <h3>🎧 会听话的 AI 朋友</h3>
          <div class="drop-area" @dragover.prevent @drop="onDrop('left')">
            <div v-for="item in leftItems" :key="item.id" class="placed-card">
              <span class="item-emoji">{{ itemEmoji[item.id] }}</span>
              <span>{{ item.name }}</span>
            </div>
            <p v-if="leftItems.length === 0" class="placeholder">拖到这里</p>
          </div>
        </div>

        <div class="zone">
          <h3>🧸 还不是 / 不完全是</h3>
          <div class="drop-area" @dragover.prevent @drop="onDrop('right')">
            <div v-for="item in rightItems" :key="item.id" class="placed-card">
              <span class="item-emoji">{{ itemEmoji[item.id] }}</span>
              <span>{{ item.name }}</span>
            </div>
            <p v-if="rightItems.length === 0" class="placeholder">拖到这里</p>
          </div>
        </div>
      </section>

      <section class="pool">
        <div
          v-for="item in unplacedItems"
          :key="item.id"
          class="drag-card"
          :class="{ shake: wrongDragId === item.id }"
          draggable="true"
          @dragstart="onDragStart(item.id)"
        >
          <span class="item-emoji">{{ itemEmoji[item.id] }}</span>
          <span>{{ item.name }}</span>
        </div>
      </section>

      <section v-if="isCompleted" class="result">
        <el-alert
          type="success"
          :closable="false"
          show-icon
          title="小芽总结"
          description="原来，不是会动就够了。能听见、能听懂、还能回应，才更像真正会听话的AI朋友。我们去生活里找找看，哪里还藏着这样的朋友？"
        />
        <div class="action-row">
          <el-button type="primary" size="large" round @click="goNextLevel">
            [继续寻找生活中的AI朋友]
          </el-button>
        </div>
      </section>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Zone = 'left' | 'right'

interface LevelItem {
  id: string
  name: string
  targetZone: Zone
  placedZone: Zone | null
}

const router = useRouter()
const gameStore = useGameStore()

const draggingId = ref<string | null>(null)
const rewarded = ref(false)
const wrongDragId = ref('')

const items = ref<LevelItem[]>([
  { id: 'speaker', name: '智能音箱', targetZone: 'left', placedZone: null },
  { id: 'assistant', name: '手机语音助手', targetZone: 'left', placedZone: null },
  { id: 'car', name: '遥控小车', targetZone: 'right', placedZone: null },
  { id: 'toy', name: '普通毛绒玩具', targetZone: 'right', placedZone: null },
  { id: 'light-toy', name: '自动亮灯玩具', targetZone: 'right', placedZone: null },
  { id: 'pai', name: '小派', targetZone: 'right', placedZone: null },
])

const leftItems = computed(() => items.value.filter((item) => item.placedZone === 'left'))
const rightItems = computed(() => items.value.filter((item) => item.placedZone === 'right'))
const unplacedItems = computed(() => items.value.filter((item) => item.placedZone === null))
const isCompleted = computed(() => items.value.every((item) => item.placedZone === item.targetZone))
const totalCount = computed(() => items.value.length)
const placedCount = computed(() => leftItems.value.length + rightItems.value.length)
const progressPercent = computed(() => Math.round((placedCount.value / totalCount.value) * 100))

const itemEmoji: Record<string, string> = {
  speaker: '🔊',
  assistant: '📱',
  car: '🚗',
  toy: '🧸',
  'light-toy': '💡',
  pai: '🤖',
}

const correctMessages: Record<string, string> = {
  speaker: '答对了！你说一句，它就会听，还会回应你。',
  assistant: '没错！它能把你说的话变成文字，还能帮你完成任务。',
  car: '答对了！它会动，但不是靠听懂你的指令。',
  toy: '对啦！它只是普通玩具，不会听懂人说话。',
  'light-toy': '答对了！会自己亮，不代表会听懂你说话。',
  pai: '答对了！小派很有潜力，但现在还没有完全变成“会听话”的AI朋友。',
}

const wrongMessages: Record<string, Record<Zone, string>> = {
  speaker: {
    left: '',
    right: '再想想。它不仅能听到声音，还能根据你的话做出回应。',
  },
  assistant: {
    left: '',
    right: '再试试。手机里的语音助手就是会“听话”的AI朋友。',
  },
  car: {
    left: '再想想。它会动，是因为你按了遥控器，不是因为它听懂了你的话。',
    right: '',
  },
  toy: {
    left: '它很可爱，但不会听声音，也不会回应指令。',
    right: '',
  },
  'light-toy': {
    left: '它会自己亮起来，但不是因为听懂了你说话，而是按固定设定运行。',
    right: '',
  },
  pai: {
    left: '小派还差一点点。它现在会亮灯、会歪头，但还没有真正学会听懂你。',
    right: '',
  },
}

function onDragStart(id: string) {
  draggingId.value = id
}

function onDrop(targetZone: Zone) {
  if (!draggingId.value) return

  const item = items.value.find((v) => v.id === draggingId.value)
  const droppedId = draggingId.value
  draggingId.value = null
  if (!item) return

  if (item.targetZone === targetZone) {
    item.placedZone = targetZone
    ElMessage.success(correctMessages[item.id] || '答对了！')
    return
  }

  wrongDragId.value = droppedId
  window.setTimeout(() => {
    if (wrongDragId.value === droppedId) wrongDragId.value = ''
  }, 420)

  const wrongMsg = wrongMessages[item.id]?.[targetZone]
  ElMessage.warning(wrongMsg || '再想想。')
}

function goNextLevel() {
  router.push('/chapter1/level2')
}

watch(isCompleted, async (done) => {
  if (done && !rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly()
    gameStore.addStar()
  }
})
</script>

<style scoped>
.level1-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 8% 0%, rgb(228 180 132 / 18%) 0%, transparent 36%),
    radial-gradient(circle at 84% 4%, rgb(153 172 232 / 16%) 0%, transparent 36%),
    linear-gradient(180deg, #f7f4ed 0%, #f3efe5 100%);
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 20px;
  padding: 14px 14px 12px;
  position: relative;
  overflow: hidden;
  border: 2px solid #f0e2c8;
  background:
    radial-gradient(circle at top right, rgb(255 238 209 / 62%) 0%, transparent 36%),
    #f7f4ed;
  box-shadow:
    0 22px 36px rgb(222 170 88 / 18%),
    inset 0 0 0 2px rgb(255 255 255 / 42%);
}

.float-sticker {
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-size: 18px;
  background: linear-gradient(180deg, #fff8ea 0%, #ffecc8 100%);
  border: 1px solid rgb(206 156 68 / 45%);
  box-shadow: 0 6px 14px rgb(189 132 39 / 18%);
  z-index: 2;
}

.sticker-star {
  top: 12px;
  left: 12px;
}

.sticker-bell {
  top: 56px;
  left: 28px;
}

.sticker-ribbon {
  right: 16px;
  top: 14px;
}

.progress-hud {
  position: absolute;
  right: 18px;
  top: 54px;
  width: 170px;
  border-radius: 16px;
  border: 1px solid rgb(206 156 68 / 45%);
  background: linear-gradient(180deg, #fff8ea 0%, #ffefcf 100%);
  padding: 10px;
  box-shadow: 0 8px 16px rgb(189 132 39 / 16%);
}

.hud-title {
  margin: 0;
  font-size: 12px;
  color: #a16c1c;
  font-weight: 700;
}

.hud-number {
  margin: 4px 0 8px;
  color: #7d4f12;
  font-size: 18px;
  font-weight: 800;
}

.hud-bar {
  height: 8px;
  border-radius: 9999px;
  background: rgb(161 108 28 / 14%);
  overflow: hidden;
}

.hud-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffb040 0%, #ff8a3d 100%);
}

.head-meta {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.head-meta span {
  border-radius: 9999px;
  border: 1px solid rgb(28 28 28 / 30%);
  padding: 4px 10px;
  font-size: 12px;
  color: rgb(28 28 28 / 78%);
  background: rgb(28 28 28 / 5%);
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  font-size: clamp(28px, 4vw, 44px);
  color: #1c1c1c;
  letter-spacing: -0.8px;
  color: #8f560f;
}

.title-icon {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  margin-right: 6px;
  background: linear-gradient(180deg, #fff5dd 0%, #ffe8bf 100%);
  border: 1px solid rgb(206 156 68 / 45%);
  vertical-align: -7px;
}

.intro {
  margin: 0 0 10px;
  color: #5f5f5d;
  line-height: 1.9;
}

.tip-line {
  margin: 0 0 12px;
  color: #1c1c1c;
  border-left: 3px solid rgb(28 28 28 / 30%);
  padding-left: 10px;
  background: linear-gradient(90deg, rgb(28 28 28 / 6%) 0%, transparent 100%);
  border-radius: 8px;
}

.guide-text {
  margin: 0 0 16px;
  text-align: center;
  font-size: 18px;
  color: rgb(28 28 28 / 83%);
  font-weight: 400;
}

.zones {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.zone h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #8a601f;
  font-weight: 700;
}

.drop-area {
  min-height: 220px;
  border: 2px dashed rgb(28 28 28 / 24%);
  border-radius: 12px;
  background: rgb(252 251 248 / 68%);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placeholder {
  margin: auto;
  color: #8b8884;
}

.placed-card,
.drag-card {
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 400;
  color: #1c1c1c;
  border: 1px solid #eceae4;
  background: linear-gradient(180deg, #fffdfa 0%, #fffaef 100%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-emoji {
  width: 24px;
  height: 24px;
  display: inline-grid;
  place-items: center;
  border-radius: 9999px;
  background: rgb(255 190 120 / 24%);
  flex: 0 0 auto;
}

.pool {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.drag-card {
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.drag-card:hover {
  border-color: rgb(28 28 28 / 40%);
}

.drag-card:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.shake {
  animation: shake 0.42s ease;
}

.pool .shake {
  will-change: transform;
}

.result {
  margin-top: 20px;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .progress-hud {
    position: static;
    width: min(260px, 100%);
    margin: 0 auto 12px;
  }

  .float-sticker {
    display: none;
  }

  .zones {
    grid-template-columns: 1fr;
  }

  .pool {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
</style>
