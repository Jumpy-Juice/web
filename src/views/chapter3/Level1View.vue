<template>
  <main class="level1-view" :class="{ 'dialogue-open': showDialogue }">
    <el-card class="level-card" shadow="hover">
      <h1>规则连线：指令 → 动作</h1>
      <p class="tip-line">
        小提示：把“你说的话”变成“要做什么”，这一步叫
        <button class="term-btn" type="button" @click="openCard('tip_intent_recognition')">【意图识别】</button>
      </p>

      <section ref="boardRef" class="board">
        <svg class="link-layer" aria-hidden="true">
          <line
            v-for="ln in lines"
            :key="ln.id"
            :x1="ln.x1"
            :y1="ln.y1"
            :x2="ln.x2"
            :y2="ln.y2"
            :class="['link-line', ln.status]"
          />
        </svg>

        <div class="col">
          <h2>听到什么(指令)</h2>
          <div class="card-list">
            <button
              v-for="cmd in commands"
              :key="cmd.id"
              type="button"
              class="rule-card"
              :data-cmd-id="cmd.id"
              :class="cardClass('command', cmd.id)"
              :disabled="isLocked('command', cmd.id)"
              @click="selectCommand(cmd.id)"
            >
              {{ cmd.text }}
            </button>
          </div>
        </div>

        <div class="col">
          <h2>做什么(动作)</h2>
          <div class="card-list">
            <button
              v-for="act in actions"
              :key="act.id"
              type="button"
              class="rule-card"
              :data-act-id="act.id"
              :class="cardClass('action', act.id)"
              :disabled="isLocked('action', act.id)"
              @click="selectAction(act.id)"
            >
              {{ act.text }}
            </button>
          </div>
        </div>
      </section>

      <section class="pairs">
        <p class="pairs-title">已配对：</p>
        <div v-if="matchedPairs.length === 0" class="pairs-empty">还没有配对，先从左边选一条指令吧。</div>
        <div v-else class="pairs-list">
          <div v-for="pair in matchedPairs" :key="pair.commandId" class="pair-row">
            <span class="pair-pill">{{ pair.commandText }}</span>
            <span class="pair-line"></span>
            <span class="pair-pill">{{ pair.actionText }}</span>
          </div>
        </div>
      </section>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goNext">[去准备训练样本]</el-button>
      </div>
    </el-card>

    <DialogueBox
      v-if="showDialogue"
      speaker-name="小芽"
      avatar-text="芽"
      content="太棒了！规则定好了，接下来我们需要准备大量的‘样本’来教它认识这些指令。"
      @next="ackDialogue"
    />

    <KnowledgeCardModal
      v-model="showCardModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DialogueBox from '../../components/DialogueBox.vue'
import { useGameStore } from '../../stores/gameStore'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Side = 'command' | 'action'

interface Item {
  id: string
  text: string
}

type LineStatus = 'correct' | 'wrong'
interface LinkLine {
  id: string
  commandId: string
  actionId: string
  x1: number
  y1: number
  x2: number
  y2: number
  status: LineStatus
}

const router = useRouter()
const gameStore = useGameStore()

const commands: Item[] = [
  { id: 'hello', text: '你好' },
  { id: 'spin', text: '转圈' },
  { id: 'dance', text: '跳个舞' },
]

const actions: Item[] = [
  { id: 'wave', text: '挥手' },
  { id: 'rotate', text: '身体旋转360°' },
  { id: 'rotate-jump', text: '先旋转，再跳跃' },
]

const correctMap: Record<string, string> = {
  hello: 'wave',
  spin: 'rotate',
  dance: 'rotate-jump',
}

const selectedCommandId = ref<string>('')
const boardRef = ref<HTMLElement | null>(null)
const matched = ref<Map<string, string>>(new Map()) // commandId -> actionId
const reverseMatched = computed(() => {
  const m = new Map<string, string>() // actionId -> commandId
  matched.value.forEach((actionId, commandId) => m.set(actionId, commandId))
  return m
})

const flashWrongCommandId = ref('')
const flashWrongActionId = ref('')
const showDialogue = ref(false)
const showNextButton = ref(false)
const rewarded = ref(false)

const showCardModal = ref(false)
const activeCardId = ref('tip_intent_recognition')

const lines = ref<LinkLine[]>([])
let lineSeq = 0
let resizeHandler: (() => void) | undefined

const matchedPairs = computed(() => {
  return Array.from(matched.value.entries()).map(([commandId, actionId]) => {
    const cmd = commands.find((c) => c.id === commandId)!
    const act = actions.find((a) => a.id === actionId)!
    return { commandId, actionId, commandText: cmd.text, actionText: act.text }
  })
})

const isCompleted = computed(() => matched.value.size === 3)

function isLocked(side: Side, id: string) {
  if (side === 'command') return matched.value.has(id)
  return reverseMatched.value.has(id)
}

function selectCommand(id: string) {
  if (isLocked('command', id)) return
  selectedCommandId.value = id
}

async function selectAction(actionId: string) {
  if (!selectedCommandId.value) return
  if (isLocked('action', actionId)) return

  const commandId = selectedCommandId.value
  const isCorrect = correctMap[commandId] === actionId

  // 画线：以 board 作为坐标系
  await nextTick()
  const pts = calcLinePoints(commandId, actionId)
  const line: LinkLine = {
    id: `ln_${++lineSeq}`,
    commandId,
    actionId,
    x1: pts?.x1 ?? 0,
    y1: pts?.y1 ?? 0,
    x2: pts?.x2 ?? 0,
    y2: pts?.y2 ?? 0,
    status: isCorrect ? 'correct' : 'wrong',
  }
  lines.value.push(line)

  if (!isCorrect) {
    flashWrongCommandId.value = commandId
    flashWrongActionId.value = actionId
    selectedCommandId.value = ''
    window.setTimeout(() => {
      flashWrongCommandId.value = ''
      flashWrongActionId.value = ''
    }, 420)

    // 错线：红色闪烁 1 秒后消失
    const removeId = line.id
    window.setTimeout(() => {
      const idx = lines.value.findIndex((l) => l.id === removeId)
      if (idx !== -1 && lines.value[idx].status === 'wrong') {
        lines.value.splice(idx, 1)
      }
    }, 1000)
    return
  }

  matched.value.set(commandId, actionId)
  selectedCommandId.value = ''

  if (isCompleted.value) {
    showDialogue.value = true
    if (!rewarded.value) {
      rewarded.value = true
      await playEnergyStarFly()
      gameStore.addStar()
    }
  }
}

function cardClass(side: Side, id: string) {
  const classes: Record<string, boolean> = {}

  const locked = isLocked(side, id)
  if (locked) classes.locked = true

  if (side === 'command' && selectedCommandId.value === id) classes.selected = true
  if (side === 'command' && flashWrongCommandId.value === id) classes.wrong = true
  if (side === 'action' && flashWrongActionId.value === id) classes.wrong = true

  return classes
}

function ackDialogue() {
  showDialogue.value = false
  showNextButton.value = true
}

function goNext() {
  router.push('/chapter3/level2')
}

function openCard(cardId: string) {
  gameStore.unlockCard(cardId)
  activeCardId.value = cardId
  showCardModal.value = true
}

function getButtonCenter(el: Element) {
  const rect = el.getBoundingClientRect()
  return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 }
}

function calcLinePoints(commandId: string, actionId: string) {
  const boardEl = boardRef.value
  if (!boardEl) return null

  const cmdEl = boardEl.querySelector(`[data-cmd-id="${commandId}"]`)
  const actEl = boardEl.querySelector(`[data-act-id="${actionId}"]`)
  if (!cmdEl || !actEl) return null

  const boardRect = boardEl.getBoundingClientRect()
  const c1 = getButtonCenter(cmdEl)
  const c2 = getButtonCenter(actEl)

  return {
    x1: c1.cx - boardRect.left,
    y1: c1.cy - boardRect.top,
    x2: c2.cx - boardRect.left,
    y2: c2.cy - boardRect.top,
  }
}

function recomputeAllLines() {
  lines.value = lines.value.map((ln) => {
    const pts = calcLinePoints(ln.commandId, ln.actionId)
    if (!pts) return ln
    return { ...ln, ...pts }
  })
}

onMounted(() => {
  resizeHandler = () => recomputeAllLines()
  window.addEventListener('resize', resizeHandler)
  nextTick(() => recomputeAllLines())
})

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.level1-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.level1-view.dialogue-open {
  padding-bottom: 220px;
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 16px;
  padding-bottom: 72px;
}

h1 {
  margin: 0 0 14px;
  text-align: center;
  color: #1f2d3d;
}

.tip-line {
  margin: 0 0 12px;
  text-align: center;
  color: #334155;
  font-weight: 600;
}

.term-btn {
  border: 0;
  background: transparent;
  color: #2563eb;
  font-weight: 900;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 8px;
  animation: term-glow 1.4s ease-in-out infinite;
}

.term-btn:hover {
  text-decoration: underline;
}

.board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.link-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.col {
  position: relative;
  z-index: 2;
}

.link-line {
  stroke-width: 4;
  stroke-linecap: round;
  opacity: 0.95;
  filter: drop-shadow(0 6px 12px rgb(0 0 0 / 12%));
}

.link-line.correct {
  stroke: #22c55e;
}

.link-line.wrong {
  stroke: #ef4444;
  animation: wrong-line 1s ease;
}

h2 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #334155;
}

.card-list {
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-card {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition: transform 0.08s ease, border-color 0.2s ease, background 0.2s ease;
}

.rule-card:hover:not(:disabled) {
  border-color: #60a5fa;
}

.rule-card.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.rule-card.locked {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #166534;
  cursor: not-allowed;
}

.rule-card.wrong {
  border-color: #ef4444;
  background: #fef2f2;
  animation: wrong-flash 0.42s ease;
}

.rule-card:disabled {
  opacity: 1;
}

.pairs {
  margin-top: 14px;
  border-top: 1px dashed #cbd5e1;
  padding-top: 14px;
}

.pairs-title {
  margin: 0 0 8px;
  font-weight: 800;
  color: #334155;
}

.pairs-empty {
  color: #64748b;
}

.pairs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pair-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.pair-pill {
  border-radius: 999px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #22c55e;
  color: #166534;
  font-weight: 800;
}

.pair-line {
  height: 2px;
  background: linear-gradient(90deg, #22c55e 0%, #86efac 50%, #22c55e 100%);
  border-radius: 999px;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@keyframes wrong-flash {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

@keyframes wrong-line {
  0%,
  100% {
    opacity: 0.15;
  }
  20%,
  60% {
    opacity: 1;
  }
}

@keyframes term-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(37 99 235 / 0%);
    background: rgb(37 99 235 / 0%);
  }
  50% {
    box-shadow: 0 0 0 10px rgb(37 99 235 / 10%);
    background: rgb(37 99 235 / 8%);
  }
}

@media (max-width: 900px) {
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
