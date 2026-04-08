<template>
  <main class="level2-view">
    <el-card class="quiz-card" shadow="hover">
      <h1>小派的耳朵有时候很灵，有时候又像失灵了。你能帮它找出原因吗？</h1>

      <section v-if="currentQuestion" class="question-section">
        <h2>题目 {{ currentIndex + 1 }}：{{ currentQuestion.question }}</h2>

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
            <span v-if="isAnsweredCurrent && option.id === selectedOptionId" class="mark">
              {{ option.correct ? '✓' : '✕' }}
            </span>
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

      <div v-if="isFinished" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel3">[帮小派纠正错别字]</el-button>
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

interface QuestionOption {
  id: string
  text: string
  correct: boolean
}

interface QuizQuestion {
  question: string
  options: [QuestionOption, QuestionOption]
  explanation: string
}

const router = useRouter()
const gameStore = useGameStore()

const questions: QuizQuestion[] = [
  {
    question: '小派在哪个环境里更容易听懂指令？',
    options: [
      { id: 'q1-a', text: '安静的房间', correct: true },
      { id: 'q1-b', text: '吵闹的菜市场', correct: false },
    ],
    explanation:
      '答对啦！环境太吵，AI的麦克风里混进太多杂音，它就不知道哪个才是你的声音了。',
  },
  {
    question: '怎么对小派说话，它听得更清楚？',
    options: [
      { id: 'q2-a', text: '像念机关枪一样又快又含糊', correct: false },
      { id: 'q2-b', text: '吐字清晰，语速适中', correct: true },
    ],
    explanation: '没错！说话太快或者含糊，AI提取出的声音信息就会变成一团乱麻哦。',
  },
  {
    question: '你对小派说了一句法语，它没听懂，是因为？',
    options: [
      { id: 'q3-a', text: '小派的耳朵坏了', correct: false },
      { id: 'q3-b', text: '小派的“字典”里还没学过这句外语', correct: true },
    ],
    explanation: '真聪明！AI只能听懂它已经学过的东西，没见过的词汇它是认不出来的。',
  },
  {
    question: '给小派戴上了厚厚的帽子把耳麦捂住了，它没反应，是因为？',
    options: [
      { id: 'q4-a', text: '小派生气了', correct: false },
      { id: 'q4-b', text: '麦克风被挡住，收不到音', correct: true },
    ],
    explanation: '对啦！硬件被挡住或者坏掉，声音根本进不到小派的身体里呢。',
  },
]

const currentIndex = ref(0)
const selectedOptionId = ref('')
const showExplanation = ref(false)
const isAnsweredCurrent = ref(false)
const isFinished = ref(false)
const rewarded = ref(false)
const wrongShakeId = ref('')
const rightParticleId = ref('')
const showTipModal = ref(false)
const activeCardId = ref('tip_affect_asr')
const pendingReward = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])

function chooseOption(optionId: string) {
  if (!currentQuestion.value || isAnsweredCurrent.value) return

  const option = currentQuestion.value.options.find((o) => o.id === optionId)
  if (!option) return

  selectedOptionId.value = optionId
  isAnsweredCurrent.value = true

  if (option.correct) {
    ElMessage.success('答对了！')
    showExplanation.value = true
    rightParticleId.value = optionId
    window.setTimeout(() => {
      toNextQuestion()
    }, 1400)
  } else {
    ElMessage.error('再想一想，这个原因不太对。')
    wrongShakeId.value = optionId
    window.setTimeout(() => {
      if (wrongShakeId.value === optionId) wrongShakeId.value = ''
    }, 420)
  }
}

async function toNextQuestion() {
  if (currentIndex.value >= questions.length - 1) {
    showExplanation.value = false
    isFinished.value = true
    // 通关 -> 触发卡片 -> 关闭后再飞星+加星
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
  rightParticleId.value = ''
}

function getOptionClass(option: QuestionOption) {
  const classes: Record<string, boolean> = {}
  if (isAnsweredCurrent.value && option.id === selectedOptionId.value) {
    classes[option.correct ? 'correct' : 'wrong'] = true
  }
  if (wrongShakeId.value === option.id) classes['shake-error'] = true
  if (rightParticleId.value === option.id) classes['particle-success'] = true
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
  ElMessage.success('四题完成！获得 1 颗小派能量星。')
})
</script>

<style scoped>
.level2-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.quiz-card {
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

h1 {
  margin: 0 0 16px;
  text-align: center;
  color: #1f2d3d;
  line-height: 1.6;
}

h2 {
  margin: 0 0 12px;
  font-size: 22px;
  color: #334155;
}

.options {
  display: grid;
  grid-template-columns: 1fr;
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
  font-weight: 600;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.option-btn:hover:not(:disabled) {
  border-color: #60a5fa;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.95;
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

.option-btn.shake-error {
  animation: shake-error 0.42s ease;
}

.option-btn.particle-success {
  /* TODO: 待动画同学替换真实粒子特效 */
}

.mark {
  font-size: 20px;
  font-weight: 800;
}

.explain {
  margin-top: 14px;
}

.action-row {
  margin-top: 18px;
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
