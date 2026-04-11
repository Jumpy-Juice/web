<template>
  <main class="level1-view">
    <el-card class="level-card" shadow="hover">
      <h1>第一关：AI朋友在哪里</h1>
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
          <h3>会听话的 AI 朋友</h3>
          <div class="drop-area" @dragover.prevent @drop="onDrop('left')">
            <div v-for="item in leftItems" :key="item.id" class="placed-card">
              {{ item.name }}
            </div>
            <p v-if="leftItems.length === 0" class="placeholder">拖到这里</p>
          </div>
        </div>

        <div class="zone">
          <h3>还不是 / 不完全是</h3>
          <div class="drop-area" @dragover.prevent @drop="onDrop('right')">
            <div v-for="item in rightItems" :key="item.id" class="placed-card">
              {{ item.name }}
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
          {{ item.name }}
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
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  font-size: 28px;
  color: #1f2d3d;
}

.intro {
  margin: 0 0 10px;
  color: #334155;
  line-height: 1.9;
}

.tip-line {
  margin: 0 0 12px;
  color: #2563eb;
  font-weight: 700;
}

.guide-text {
  margin: 0 0 16px;
  text-align: center;
  font-size: 18px;
  color: #334155;
}

.zones {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.zone h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #334155;
}

.drop-area {
  min-height: 220px;
  border: 2px dashed #93c5fd;
  border-radius: 12px;
  background: #f8fbff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placeholder {
  margin: auto;
  color: #94a3b8;
}

.placed-card,
.drag-card {
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  background: #fff;
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
  transition: transform 0.2s ease;
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
