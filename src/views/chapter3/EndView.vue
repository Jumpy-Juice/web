<template>
  <main class="end-view">
    <el-card class="end-card" shadow="hover">
      <div class="end-header">
        <h1>🎉 终极成长记录：唤醒成功！</h1>
        <p class="record-id">小派成长记录 03</p>
        <img 
          v-if="showHeaderImage" 
          class="header-icon"
          src="../../assets/chapter3/终极成长记录/IMG_20260413_012035.png" 
          alt="完成图标"
        />
      </div>

      <ul class="summary-list">
        <li v-for="(line, idx) in visibleLines" :key="idx" class="summary-item">{{ line }}</li>
      </ul>

      <section class="evo-stage">
        <div class="glow-ring" aria-hidden="true"></div>
        <div class="spark-layer" aria-hidden="true">
          <span v-for="n in 18" :key="n" class="spark"></span>
        </div>

        <div class="robot-wrap" :class="{ 'evo-on': evoOn }">
          <PaiRobot mode="interactive" />
        </div>

        <p class="reward-text">⭐ 终极奖励：小派解锁【指令互动模式】！完成最终成长形态！</p>
      </section>

      <p class="pai-line">"你好，小训练师！谢谢你教会我听懂这个世界！"</p>

      <p class="assistant-hint">
        小芽：小派的语音变得更自然、更清晰啦！点下面按钮，进入自由互动模式，随便试试三个口令吧～
      </p>

      <section class="engineer-box">
        <h2>工程师最终总结与沉淀</h2>
        <div class="card-grid">
          <button
            v-for="card in professionalCards"
            :key="card.id"
            class="mini-card"
            :class="{ locked: !isUnlocked(card.id) }"
            type="button"
            @click="openCard(card.id)"
          >
            <div class="mini-title">{{ isUnlocked(card.id) ? card.title : '？？？（未收集）' }}</div>
            <div class="mini-sub">{{ isUnlocked(card.id) ? '点击查看' : '继续闯关解锁' }}</div>
          </button>
        </div>
      </section>

      <div class="action-row">
        <el-button class="giant-btn" type="primary" size="large" round @click="goSandbox">
          [自由互动模式]
        </el-button>
        <el-button class="giant-btn" round @click="goHome">
          [返回首页]
        </el-button>
      </div>

      <section v-if="showResourceShowcase" class="resources-final">
        <p class="showcase-title">📸 第三章完整资源回顾：</p>
        <div class="resources-showcase">
          <div
            v-for="img in resourceImages"
            :key="img"
            class="resource-item"
          >
            <img :src="img" :alt="img" class="resource-thumb" />
          </div>
          <div
            v-for="video in resourceVideos"
            :key="video"
            class="resource-item resource-video-item"
          >
            <video :src="video" controls class="resource-thumb resource-video" />
          </div>
        </div>
      </section>
    </el-card>

    <KnowledgeCardModal
      v-model="showCardModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import { useGameStore } from '../../stores/gameStore'

interface ProfessionalCard {
  id: string
  title: string
  description?: string
}

const router = useRouter()
const gameStore = useGameStore()
const { unlockedItems, unlockedCards } = storeToRefs(gameStore)

const showHeaderImage = ref(false)
const showResourceShowcase = ref(false)
const visibleLines = ref<string[]>([])
const showScarfFx = ref(false)
const evoOn = ref(false)

const showCardModal = ref(false)
const activeCardId = ref('summary_intent_recognition')

const lines = [
  '✓ 规则映射：把"你说的话"映射到"要做什么"',
  '✓ 数据标注：为样本添加标签让AI学习',
  '✓ 测试验收：检验AI是否学会了指令',
  '✓ 调试优化：找出问题并改进AI的表现',
]

const chapter3Assets = import.meta.globEager('../../assets/chapter3/**/*.{png,jpg,jpeg,mp4}') as Record<
  string,
  { default: string }
>

const resourceImages = Object.values(chapter3Assets)
  .map((mod) => mod.default)
  .filter((url) => /\.(png|jpe?g)$/i.test(url))

const resourceVideos = Object.values(chapter3Assets)
  .map((mod) => mod.default)
  .filter((url) => /\.mp4$/i.test(url))

const professionalCards: ProfessionalCard[] = [
  { id: 'summary_intent_recognition', title: '意图识别研究' },
  { id: 'summary_data_labeling', title: '数据标注方法' },
  { id: 'summary_model_testing', title: '模型测试流程' },
  { id: 'summary_debugging', title: '问题调试技巧' },
]

const timers: number[] = []

function isUnlocked(cardId: string) {
  return unlockedCards.value.includes(cardId)
}

onMounted(() => {
  gameStore.unlockMode('interactive')
  if (!unlockedItems.value.includes('scarf')) {
    gameStore.unlockItem('scarf')
  }

  window.setTimeout(() => {
    showHeaderImage.value = true
  }, 400)

  lines.forEach((line, index) => {
    const t = window.setTimeout(() => {
      visibleLines.value.push(line)
    }, 450 * (index + 1))
    timers.push(t)
  })

  const fxTimer = window.setTimeout(() => {
    showScarfFx.value = true
    evoOn.value = true
  }, 500)
  timers.push(fxTimer)

  const resourceTimer = window.setTimeout(() => {
    showResourceShowcase.value = true
  }, 2500)
  timers.push(resourceTimer)
})

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearTimeout(t))
})

function openCard(cardId: string) {
  gameStore.unlockCard(cardId)
  activeCardId.value = cardId
  showCardModal.value = true
}

function goSandbox() {
  router.push('/sandbox')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.end-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.end-card {
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

.end-header {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.end-header h1 {
  margin: 0 0 8px;
  color: #1f2d3d;
}

.record-id {
  margin: 0 0 12px;
  color: #0f766e;
  font-weight: 600;
  font-size: 14px;
}

.header-icon {
  width: 60px;
  height: 60px;
  animation: pop-in 0.6s ease-out;
  margin-top: 8px;
}

.summary-list {
  margin: 16px 0;
  padding-left: 20px;
}

.summary-item {
  margin: 10px 0;
  color: #0f766e;
  font-weight: 600;
  animation: line-in 0.35s ease;
}

.evo-stage {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 360px;
}

.glow-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%);
  transform: translate(-50%, -50%);
  animation: glow-pulse 2s ease-in-out infinite;
}

.spark-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 280px;
  height: 280px;
  transform: translate(-50%, -50%);
}

.spark {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: spark-fly 2s ease-out infinite;
}

.robot-wrap {
  position: relative;
  width: 300px;
  min-height: 300px;
  display: grid;
  place-items: center;
}

.robot-wrap.evo-on {
  animation: robot-glow 1.2s ease-out;
}

.reward-text {
  margin-top: 12px;
  color: #10b981;
  font-weight: 700;
  text-align: center;
  animation: bounce-in 0.8s ease-out 0.5s both;
}

.pai-line {
  margin: 20px 0;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  color: #065f46;
  text-align: center;
  font-style: italic;
}

.assistant-hint {
  margin: 16px 0;
  padding: 12px;
  background: #dbeafe;
  border-radius: 8px;
  color: #0c4a6e;
  text-align: center;
  font-size: 14px;
}

.engineer-box {
  margin: 24px 0;
  padding: 20px;
  background: #f9f5ff;
  border-radius: 8px;
  border-left: 4px solid #a855f7;
}

.engineer-box h2 {
  margin: 0 0 16px;
  color: #6b21a8;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.mini-card {
  padding: 12px;
  background: white;
  border: 2px solid #c084fc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.mini-card:hover:not(.locked) {
  background: #f3e8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
}

.mini-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.mini-title {
  margin: 0;
  font-weight: 700;
  color: #6b21a8;
  font-size: 13px;
}

.mini-sub {
  margin: 4px 0 0;
  font-size: 11px;
  color: #9333ea;
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.giant-btn {
  min-width: 180px;
}

.resources-final {
  margin-top: 32px;
  padding: 20px;
  background: #fffbeb;
  border-radius: 8px;
  border: 2px dashed #f59e0b;
}

.showcase-title {
  margin: 0 0 16px;
  font-weight: 700;
  color: #92400e;
}

.resources-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.resource-item {
  padding: 8px;
  background: white;
  border-radius: 6px;
  overflow: hidden;
}

.resource-thumb {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.resource-video {
  width: 100%;
  height: auto;
  min-height: 80px;
  border-radius: 4px;
  background: #000;
}

.resource-video-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes spark-fly {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(calc(cos(var(--angle)) * 140px), calc(sin(var(--angle)) * 140px)) scale(0);
  }
}

@keyframes robot-glow {
  0% {
    filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0));
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
