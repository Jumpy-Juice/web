<template>
  <main class="level2-view">
    <el-card class="quiz-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 2 · Level 2</span>
        <span>Error Diagnosis</span>
      </div>
      <h1>第二关：为什么会听错，怎么帮它改正？</h1>

      <p class="narration">
        <strong>小芽：</strong>
        小派现在已经能听到声音了，可它有时候还是会听错。别担心，很多时候不是它不认真，而是遇到了麻烦。我们一起来当“小侦探”，找出问题出在哪里吧！
      </p>

      <p class="guide-text">请看看下面的情况，帮小派选出更容易“听清”的那一边。</p>

      <section v-if="currentQuestion" class="question-section">
        <h2>{{ currentQuestion.sceneTitle }}</h2>
        <p class="question-line">题目：{{ currentQuestion.question }}</p>

        <div class="options">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="option-btn"
            :class="getOptionClass(option)"
            :disabled="isAnsweredCurrent"
            @click="chooseOption(option.id)"
          >
            <span>{{ option.text }}</span>
            <span v-if="isAnsweredCurrent && option.id === selectedOptionId" class="mark">✓</span>
          </button>
        </div>
      </section>

      <el-alert
        v-if="showExplanation && currentQuestion"
        class="explain"
        type="success"
        :closable="false"
        show-icon
        :title="currentQuestion.explanation"
      />

      <section v-if="isFinished" class="summary-box">
        <p class="summary-title"><strong>小芽：</strong>你发现了吗？小派听错，常常不是因为它“笨”，而是因为遇到了四种常见麻烦：</p>
        <ul>
          <li>周围太吵</li>
          <li>说话太快或不清楚</li>
          <li>遇到没学过的内容</li>
          <li>耳麦被挡住或设备出了问题</li>
        </ul>
        <p class="knowledge-line">
          一句话知识点：AI“听不清”，不只和它自己有关，也和环境、输入内容和硬件状态有关。
        </p>

        <div class="action-row">
          <el-button type="primary" size="large" round @click="goLevel3">[继续进入纠错训练]</el-button>
        </div>
      </section>
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

interface QuestionOption {
  id: string
  text: string
  correct: boolean
}

interface QuizQuestion {
  sceneTitle: string
  question: string
  options: [QuestionOption, QuestionOption]
  explanation: string
}

const router = useRouter()
const gameStore = useGameStore()

const questions: QuizQuestion[] = [
  {
    sceneTitle: '场景1：环境太吵',
    question: '小派在哪种地方更容易听懂指令？',
    options: [
      { id: 'q1-a', text: '安静的房间', correct: true },
      { id: 'q1-b', text: '吵闹的菜市场', correct: false },
    ],
    explanation:
      '小芽：答对啦！周围太吵时，杂音会一起跑进麦克风，小派就更难分清哪一个才是你的声音。',
  },
  {
    sceneTitle: '场景2：说话太快',
    question: '怎么说话，小派听得更清楚？',
    options: [
      { id: 'q2-a', text: '又快又含糊', correct: false },
      { id: 'q2-b', text: '吐字清楚，语速适中', correct: true },
    ],
    explanation:
      '小芽：没错！说得太快、太含糊，声音信息就容易乱掉，小派当然更容易听错。',
  },
  {
    sceneTitle: '场景3：没学过的新词',
    question: '你说了一句小派没学过的话，它没听懂，可能是因为？',
    options: [
      { id: 'q3-a', text: '它没学过', correct: true },
      { id: 'q3-b', text: '它故意不回答', correct: false },
    ],
    explanation:
      '小芽：真聪明！AI更容易听懂它学过的内容，没见过的新词、新说法，就可能认不出来。',
  },
  {
    sceneTitle: '场景4：耳麦被挡住了',
    question: '如果小派的耳麦被帽子挡住了，会发生什么？',
    options: [
      { id: 'q4-a', text: '听不清声音', correct: true },
      { id: 'q4-b', text: '突然不想理人', correct: false },
    ],
    explanation: '小芽：对啦！声音进不去，它当然就没法继续识别了。',
  },
]

const currentIndex = ref(0)
const selectedOptionId = ref('')
const showExplanation = ref(false)
const isAnsweredCurrent = ref(false)
const isFinished = ref(false)
const rewarded = ref(false)
const wrongShakeId = ref('')
const showTipModal = ref(false)
const activeCardId = ref('tip_affect_asr')
const pendingReward = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])

function chooseOption(optionId: string) {
  if (!currentQuestion.value || isAnsweredCurrent.value) return

  const option = currentQuestion.value.options.find((o) => o.id === optionId)
  if (!option) return

  selectedOptionId.value = optionId

  if (option.correct) {
    isAnsweredCurrent.value = true
    ElMessage.success('答对了！')
    showExplanation.value = true
    window.setTimeout(() => {
      toNextQuestion()
    }, 1400)
    return
  }

  ElMessage.error('再想一想，这个原因不太对。')
  wrongShakeId.value = optionId
  window.setTimeout(() => {
    if (wrongShakeId.value === optionId) wrongShakeId.value = ''
    if (selectedOptionId.value === optionId) selectedOptionId.value = ''
  }, 420)
}

async function toNextQuestion() {
  if (currentIndex.value >= questions.length - 1) {
    showExplanation.value = false
    isFinished.value = true
    activeCardId.value = 'tip_affect_asr'
    gameStore.unlockCard(activeCardId.value)
    pendingReward.value = true
    showTipModal.value = true
    return
  }

  currentIndex.value += 1
  selectedOptionId.value = ''
  isAnsweredCurrent.value = false
  showExplanation.value = false
  wrongShakeId.value = ''
}

function getOptionClass(option: QuestionOption) {
  const classes: Record<string, boolean> = {}

  if (isAnsweredCurrent.value && option.id === selectedOptionId.value) {
    classes.correct = true
  }

  if (!isAnsweredCurrent.value && option.id === selectedOptionId.value && !option.correct) {
    classes.wrong = true
  }

  if (wrongShakeId.value === option.id) classes['shake-error'] = true
  return classes
}

function goLevel3() {
  router.push('/chapter2/level3')
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
.level2-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 10% 2%, rgb(230 181 134 / 18%) 0%, transparent 36%),
    radial-gradient(circle at 86% 5%, rgb(148 168 233 / 16%) 0%, transparent 34%),
    linear-gradient(180deg, #f7f4ed 0%, #f3efe5 100%);
}

.quiz-card {
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 20px;
  padding: 10px 8px;
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
  margin: 0 0 14px;
  text-align: center;
  color: #1c1c1c;
  line-height: 1.5;
  font-size: clamp(28px, 4vw, 42px);
  letter-spacing: -0.8px;
}

.narration,
.guide-text {
  margin: 0 0 10px;
  color: #5f5f5d;
  line-height: 1.8;
}

.question-line {
  margin: 0 0 12px;
  font-weight: 400;
  color: #1c1c1c;
}

h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1c1c1c;
}

.options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.option-btn {
  border: 1px solid #eceae4;
  border-radius: 12px;
  background: #fcfbf8;
  color: #1c1c1c;
  min-height: 56px;
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.option-btn:hover:not(:disabled) {
  border-color: rgb(28 28 28 / 40%);
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.95;
}

.option-btn.correct {
  border-color: rgb(34 116 61 / 45%);
  background: rgb(209 236 217 / 85%);
  color: #174428;
}

.option-btn.wrong {
  border-color: rgb(155 56 56 / 50%);
  background: rgb(241 203 203 / 78%);
  color: #7c2626;
}

.option-btn.shake-error {
  animation: shake-error 0.42s ease;
}

.mark {
  font-size: 20px;
  font-weight: 800;
}

.explain {
  margin-top: 14px;
}

.summary-box {
  margin-top: 16px;
  border-top: 1px dashed rgb(28 28 28 / 28%);
  padding-top: 12px;
}

.summary-title,
.knowledge-line {
  margin: 0 0 8px;
  color: #5f5f5d;
  line-height: 1.8;
}

.summary-box ul {
  margin: 0 0 8px;
  padding-left: 20px;
}

.summary-box li {
  margin: 6px 0;
  color: #5f5f5d;
  font-weight: 400;
}

.action-row {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

@keyframes shake-error {
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
