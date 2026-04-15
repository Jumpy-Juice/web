<template>
  <main class="level3-view">
    <el-card class="quiz-card" shadow="hover">
      <h1>第二关：为什么会听错，怎么帮它改正？</h1>

      <p class="narration">
        <strong>小芽：</strong>
        把这些麻烦排除以后，小派有时候还是会把发音相近的词听混。现在轮到你帮它改一改啦！
      </p>
      <p class="guide-text">请从错误结果里，帮小派选出真正应该听到的指令。</p>

      <section class="robot-area" aria-label="小派状态反馈区">
        <PaiRobot mode="listening" />
        <div v-if="lightFlash" class="light-flash" aria-hidden="true"></div>
      </section>

      <section v-if="currentItem" class="quiz-area">
        <p class="result-line">
          小派识别结果：
          <strong class="word-box" :class="wordFxStage">【{{ displayWord }}】</strong>
        </p>

        <div class="options">
          <button
            v-for="option in currentItem.options"
            :key="option.text"
            class="option-btn"
            :class="getOptionClass(option)"
            :disabled="answered"
            @click="choose(option.text)"
          >
            <span>{{ option.text }}</span>
            <span v-if="answered && selected === option.text" class="mark">
              {{ option.correct ? '✓' : '✕' }}
            </span>
          </button>
        </div>
      </section>

      <el-alert
        v-if="showTip && currentItem"
        class="tip"
        type="success"
        :closable="false"
        show-icon
        :title="currentItem.tip"
      />

      <section v-if="finished" class="final-summary">
        <p>
          <strong>小芽：</strong>
          太棒了！当AI听错的时候，人类可以帮它指出哪里错了、应该改成什么。这样，它下次就更有机会听对。
        </p>
        <p>
          <strong>小芽总结：</strong>
          今天你帮小派学会了两件很重要的事：第一，找到“为什么听错”的原因；第二，听错以后，及时帮它改正。
          这就是训练AI很重要的一步——发现问题，再一点点修正问题。
        </p>
      </section>

      <div v-if="finished" class="action-row">
        <el-button type="primary" size="large" round @click="goEnd">[记住啦，继续训练小派！]</el-button>
      </div>
    </el-card>

    <KnowledgeCardModal v-model="showTipModal" :card-id="activeCardId" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import { playEnergyStarFly } from '../../utils/energyStarFly'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import PaiRobot from '../../components/PaiRobot.vue'

interface QuizOption {
  text: string
  correct: boolean
}

interface QuizItem {
  wrongWord: string
  options: QuizOption[]
  tip: string
}

const router = useRouter()
const gameStore = useGameStore()

const items: QuizItem[] = [
  {
    wrongWord: '你号',
    options: [
      { text: '泥好', correct: false },
      { text: '你好', correct: true },
    ],
    tip: '小芽：好样的！“你号”应该是【你好】。',
  },
  {
    wrongWord: '转卷',
    options: [
      { text: '转圈', correct: true },
      { text: '专权', correct: false },
    ],
    tip: '小芽：纠正成功！“转卷”应该是【转圈】。',
  },
  {
    wrongWord: '跳个五',
    options: [
      { text: '跳个舞', correct: true },
      { text: '挑个物', correct: false },
    ],
    tip: '小芽：太棒了！“跳个五”应该是【跳个舞】。',
  },
]

const index = ref(0)
const answered = ref(false)
const selected = ref('')
const showTip = ref(false)
const finished = ref(false)
const rewarded = ref(false)
const displayWord = ref(items[0].wrongWord)
const wordFxStage = ref<'idle' | 'break' | 'correct'>('idle')
const showTipModal = ref(false)
const activeCardId = ref('tip_hear_vs_understand')
const pendingReward = ref(false)
const lightFlash = ref(false)
const wrongShake = ref(false)

const currentItem = computed(() => items[index.value])

function choose(text: string) {
  if (!currentItem.value || answered.value) return
  const option = currentItem.value.options.find((o) => o.text === text)
  if (!option) return

  selected.value = text

  if (!option.correct) {
    ElMessage.error('这个词还不太对，再想想。')
    wrongShake.value = true
    window.setTimeout(() => {
      wrongShake.value = false
      if (!answered.value && selected.value === text) selected.value = ''
    }, 420)
    return
  }

  answered.value = true
  ElMessage.success('纠正成功！')
  triggerLightFlash()

  wordFxStage.value = 'break'
  window.setTimeout(() => {
    displayWord.value = option.text
    wordFxStage.value = 'correct'
  }, 280)

  window.setTimeout(() => {
    showTip.value = true
  }, 720)

  window.setTimeout(() => {
    toNext()
  }, 2000)
}

function triggerLightFlash() {
  lightFlash.value = true
  window.setTimeout(() => {
    lightFlash.value = false
  }, 360)
}

function playSuccessBeep() {
  if (typeof window === 'undefined') return
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18)

  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.24)

  osc.onended = () => {
    void ctx.close()
  }
}

async function toNext() {
  if (index.value >= items.length - 1) {
    showTip.value = false
    finished.value = true
    playSuccessBeep()
    activeCardId.value = 'tip_hear_vs_understand'
    gameStore.unlockCard(activeCardId.value)
    pendingReward.value = true
    showTipModal.value = true
    return
  }

  index.value += 1
  answered.value = false
  selected.value = ''
  showTip.value = false
  displayWord.value = items[index.value].wrongWord
  wordFxStage.value = 'idle'
}

function getOptionClass(option: QuizOption) {
  if (selected.value !== option.text) return ''
  if (!answered.value) return wrongShake.value ? 'wrong shake-error' : 'wrong'
  return option.correct ? 'correct' : 'wrong'
}

function goEnd() {
  router.push('/chapter2/end')
}

watch(showTipModal, async (open) => {
  if (open) return
  if (!pendingReward.value || rewarded.value) return

  pendingReward.value = false
  rewarded.value = true
  await playEnergyStarFly()
  gameStore.addStar()
  ElMessage.success('恭喜你完成第二关！获得：小派能量星 ×1')
})
</script>

<style scoped>
.level3-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.quiz-card {
  width: min(960px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  color: #1f2d3d;
  line-height: 1.6;
}

.narration,
.guide-text {
  margin: 0 0 10px;
  color: #334155;
  line-height: 1.8;
}

.robot-area {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 240px;
  margin-top: 2px;
}

.light-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -56%);
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, rgb(250 204 21 / 45%) 0%, rgb(250 204 21 / 0%) 70%);
  animation: flash-pop 0.36s ease;
}

.result-line {
  margin: 0 0 12px;
  text-align: center;
  font-size: 22px;
  color: #334155;
}

.word-box {
  display: inline-block;
  transform-origin: center center;
}

.word-box.break {
  animation: word-break 0.28s ease forwards;
}

.word-box.correct {
  animation: word-correct 0.75s ease;
}

.options {
  display: grid;
  gap: 10px;
}

.option-btn {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
  color: #0f172a;
  min-height: 56px;
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.option-btn.correct {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #166534;
}

.option-btn.wrong {
  border-color: #ef4444;
  background: #fef2f2;
  color: #991b1b;
}

.mark {
  font-size: 20px;
  font-weight: 800;
}

.tip {
  margin-top: 14px;
}

.final-summary {
  margin-top: 14px;
  border-top: 1px dashed #cbd5e1;
  padding-top: 12px;
  color: #334155;
  line-height: 1.9;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@keyframes flash-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -56%) scale(0.75);
  }
  40% {
    opacity: 1;
    transform: translate(-50%, -56%) scale(1.05);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -56%) scale(1.18);
  }
}

@keyframes word-break {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: none;
  }
  40% {
    transform: translateX(-2px) translateY(1px) scale(1.03);
  }
  100% {
    opacity: 0.15;
    transform: translateY(-6px) scale(0.92);
    text-shadow: 0 0 14px rgb(239 68 68 / 55%);
  }
}

@keyframes word-correct {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.75);
    text-shadow: 0 0 0 rgb(34 197 94 / 0%);
  }
  55% {
    opacity: 1;
    transform: translateY(-2px) scale(1.1);
    text-shadow: 0 0 18px rgb(34 197 94 / 65%);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: 0 0 8px rgb(34 197 94 / 30%);
  }
}
</style>
