<template>
  <main class="level3-view">
    <el-card class="quiz-card" shadow="hover">
      <h1>如果AI尝试分析声音，有时候会把发音相近的词搞混。请你帮它选出真正的意思吧！</h1>

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

      <div v-if="finished" class="action-row">
        <el-button type="primary" size="large" round @click="goEnd">[查看小派的成长变化]</el-button>
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
    tip: '它把你好听成了你号！发音太像啦。',
  },
  {
    wrongWord: '转卷',
    options: [
      { text: '转圈', correct: true },
      { text: '专权', correct: false },
    ],
    tip: '原来是转圈呀，AI有时候也会写错别字呢。',
  },
  {
    wrongWord: '跳个五',
    options: [
      { text: '跳个舞', correct: true },
      { text: '挑个物', correct: false },
    ],
    tip: '纠正成功！看来光能听懂字面意思还不够，还需要我们好好教教它规则！',
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

const currentItem = computed(() => items[index.value])

function choose(text: string) {
  if (!currentItem.value || answered.value) return
  const option = currentItem.value.options.find((o) => o.text === text)
  if (!option) return

  selected.value = text
  answered.value = true

  if (!option.correct) {
    ElMessage.error('这个词还不太对，再想想。')
    return
  }

  ElMessage.success('纠正成功！')

  // 先触发错误词碎裂/震动淡出，再让正确词发光显现
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

async function toNext() {
  if (index.value >= items.length - 1) {
    showTip.value = false
    finished.value = true
    // 通关 -> 触发卡片 -> 关闭后再飞星+加星
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
  if (!answered.value || selected.value !== option.text) return ''
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
  ElMessage.success('本关完成，获得 1 颗小派能量星！')
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
  margin: 0 0 16px;
  text-align: center;
  color: #1f2d3d;
  line-height: 1.6;
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

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
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
