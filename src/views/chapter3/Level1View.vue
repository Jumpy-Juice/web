<template>
  <main class="level1-view" :class="{ 'dialogue-open': showDialogue }">
    <el-card class="level-card" shadow="hover">
      <div class="level-header">
        <h1>🎯 Level 1：规则连线 - 指令 → 动作</h1>
        <img 
          v-if="showDecor" 
          class="level-decor" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015117151.png" 
          alt="关卡装饰"
        />
      </div>

      <p class="tip-line">
        小提示：把"你说的话"变成"要做什么"，这一步叫
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
        <p class="pairs-title">✅ 已配对：</p>
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
      content="太棒了！规则定好了，接下来我们需要准备大量的'样本'来教它认识这些指令。"
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

const showDecor = ref(false)
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
const matched = ref<Map<string, string>>(new Map())
const reverseMatched = computed(() => {
  const m = new Map<string, string>()
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
  window.setTimeout(() => {
    showDecor.value = true
  }, 600)
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
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

.level-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.level-header h1 {
  margin: 0;
  color: #1f2d3d;
  flex: 1;
}

.level-decor {
  width: 70px;
  height: 70px;
  animation: bounce-in 0.6s ease-out;
}

.tip-line {
  margin: 12px 0;
  color: #0f766e;
  font-size: 14px;
}

.term-btn {
  background: none;
  border: none;
  color: #0284c7;
  cursor: pointer;
  font-weight: 600;
  padding: 0 2px;
  text-decoration: underline;
}

.term-btn:hover {
  color: #0369a1;
}

.board {
  margin: 24px 0;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 300px;
}

.link-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.link-line {
  stroke: #cbd5e1;
  stroke-width: 2;
  transition: stroke 0.3s;
}

.link-line.correct {
  stroke: #10b981;
  opacity: 0.8;
}

.link-line.wrong {
  stroke: #ef4444;
  animation: wrong-flash 0.5s ease;
}

.col h2 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #0f766e;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rule-card {
  padding: 12px 16px;
  background: #dbeafe;
  border: 2px solid #0284c7;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  color: #0c4a6e;
}

.rule-card:hover:not(:disabled) {
  background: #0284c7;
  color: white;
  transform: translateX(4px);
}

.rule-card.selected {
  background: #0284c7;
  color: white;
  box-shadow: 0 0 8px rgba(2, 132, 199, 0.6);
}

.rule-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.rule-card.wrong {
  animation: shake 0.4s;
}

.pairs {
  margin: 20px 0;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.pairs-title {
  margin: 0 0 12px;
  font-weight: 700;
  color: #065f46;
}

.pairs-empty {
  color: #92400e;
  font-style: italic;
}

.pairs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pair-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pair-pill {
  padding: 6px 12px;
  background: white;
  border: 1px solid #10b981;
  border-radius: 16px;
  font-size: 13px;
  color: #065f46;
}

.pair-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #7ee8c1);
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-4px); }
  20% { transform: translateX(4px); }
  30% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
}

@keyframes wrong-flash {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
