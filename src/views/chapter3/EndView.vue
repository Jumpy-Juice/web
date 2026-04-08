<template>
  <main class="end-view">
    <el-card class="end-card" shadow="hover">
      <h1>终极成长记录：唤醒成功！</h1>

      <ul class="summary-list">
        <li>√ 按规则理解指令</li>
        <li>√ 根据样本识别三种基础口令</li>
        <li>√ 执行动作并在调试后变得更稳定</li>
      </ul>

      <section class="evo-stage">
        <div class="glow-ring" aria-hidden="true"></div>
        <div class="spark-layer" aria-hidden="true">
          <span v-for="n in 18" :key="n" class="spark"></span>
        </div>

        <div class="robot-wrap" :class="{ 'evo-on': evoOn }">
          <PaiRobot mode="interactive" />
        </div>

        <p class="reward-text">终极奖励：小派解锁【指令互动模式】！</p>
      </section>

      <p class="pai-line">“你好，小训练师！谢谢你教会我听懂这个世界！”</p>

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
          [进入自由互动模式]
        </el-button>
      </div>
    </el-card>

    <KnowledgeCardModal
      v-model="showCardModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'
import { storeToRefs } from 'pinia'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'

const router = useRouter()
const gameStore = useGameStore()
const { unlockedCards } = storeToRefs(gameStore)

const evoOn = ref(false)
let timer: number | undefined
const showCardModal = ref(false)
const activeCardId = ref('tip_intent_recognition')

const professionalCards = [
  { id: 'tip_intent_recognition', title: '意图识别' },
  { id: 'tip_data_labeling', title: '数据标注' },
  { id: 'tip_dataset', title: '数据集' },
  { id: 'tip_generalization', title: '泛化能力' },
]

onMounted(() => {
  gameStore.unlockMode('interactive')
  evoOn.value = true
  timer = window.setTimeout(() => {
    evoOn.value = false
  }, 1600)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearTimeout(timer)
})

function goSandbox() {
  router.push('/sandbox')
}

function isUnlocked(cardId: string) {
  return unlockedCards.value.includes(cardId)
}

function openCard(cardId: string) {
  if (!isUnlocked(cardId)) return

  activeCardId.value = cardId
  showCardModal.value = true
}
</script>

<style scoped>
.end-view {
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at 30% 10%, #fff7ed 0%, #f7fbff 35%, #eef8f3 100%);
}

.end-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  font-size: 34px;
  font-weight: 900;
  color: #1f2d3d;
  letter-spacing: 1px;
}

.summary-list {
  margin: 0;
  padding-left: 20px;
  max-width: 820px;
  margin-inline: auto;
}

.summary-list li {
  margin: 10px 0;
  color: #0f766e;
  font-weight: 700;
  font-size: 16px;
}

.evo-stage {
  position: relative;
  margin-top: 10px;
  min-height: 340px;
  display: grid;
  place-items: center;
}

.robot-wrap {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 18px 42px rgb(0 0 0 / 16%));
}

.glow-ring {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  z-index: 0;
  background: radial-gradient(circle, rgb(245 158 11 / 38%) 0%, rgb(245 158 11 / 0%) 60%);
  animation: ring-pulse 1.4s ease-in-out infinite;
}

.spark-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.spark {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #f59e0b;
  box-shadow: 0 0 12px rgb(245 158 11 / 65%);
  opacity: 0.9;
  transform: translate(-50%, -50%) rotate(var(--r)) translateX(150px);
  animation: spark-fly 1.2s ease-out infinite;
}

.spark:nth-child(1) { --r: 0deg; animation-delay: 0ms; }
.spark:nth-child(2) { --r: 20deg; animation-delay: 80ms; }
.spark:nth-child(3) { --r: 40deg; animation-delay: 160ms; }
.spark:nth-child(4) { --r: 60deg; animation-delay: 240ms; }
.spark:nth-child(5) { --r: 80deg; animation-delay: 320ms; }
.spark:nth-child(6) { --r: 100deg; animation-delay: 400ms; }
.spark:nth-child(7) { --r: 120deg; animation-delay: 480ms; }
.spark:nth-child(8) { --r: 140deg; animation-delay: 560ms; }
.spark:nth-child(9) { --r: 160deg; animation-delay: 640ms; }
.spark:nth-child(10) { --r: 180deg; animation-delay: 720ms; }
.spark:nth-child(11) { --r: 200deg; animation-delay: 800ms; }
.spark:nth-child(12) { --r: 220deg; animation-delay: 880ms; }
.spark:nth-child(13) { --r: 240deg; animation-delay: 960ms; }
.spark:nth-child(14) { --r: 260deg; animation-delay: 1040ms; }
.spark:nth-child(15) { --r: 280deg; animation-delay: 1120ms; }
.spark:nth-child(16) { --r: 300deg; animation-delay: 1200ms; }
.spark:nth-child(17) { --r: 320deg; animation-delay: 1280ms; }
.spark:nth-child(18) { --r: 340deg; animation-delay: 1360ms; }

.robot-wrap.evo-on {
  animation: evo-pop 1.6s ease;
}

.reward-text {
  margin: 10px 0 0;
  font-weight: 900;
  color: #92400e;
  text-align: center;
}

.pai-line {
  margin: 10px auto 0;
  max-width: 860px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #1f2d3d;
}

.engineer-box {
  margin-top: 16px;
  border-top: 1px dashed rgb(148 163 184 / 60%);
  padding-top: 14px;
}

.engineer-box h2 {
  margin: 0 0 10px;
  text-align: center;
  font-size: 18px;
  color: #334155;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  max-width: 860px;
  margin: 0 auto;
}

.mini-card {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgb(59 130 246 / 20%);
  background: linear-gradient(135deg, rgb(224 242 254 / 60%) 0%, #fff 60%);
  padding: 12px;
  cursor: pointer;
}

.mini-card.locked {
  border-color: rgb(148 163 184 / 50%);
  background: linear-gradient(135deg, rgb(226 232 240 / 60%) 0%, #fff 60%);
  color: #64748b;
  cursor: not-allowed;
}

.mini-title {
  font-weight: 900;
  color: #0f172a;
}

.mini-card.locked .mini-title {
  color: #64748b;
}

.mini-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #334155;
}

.mini-card.locked .mini-sub {
  color: #94a3b8;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.giant-btn {
  font-size: 18px;
  padding: 14px 28px;
  box-shadow: 0 14px 30px rgb(37 99 235 / 25%);
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes spark-fly {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--r)) translateX(110px) scale(0.5);
  }
  25% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--r)) translateX(190px) scale(1.1);
  }
}

@keyframes evo-pop {
  0% {
    transform: scale(0.92);
    filter: drop-shadow(0 0 0 rgb(245 158 11 / 0%));
  }
  35% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 22px rgb(245 158 11 / 30%));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 18px 42px rgb(0 0 0 / 16%));
  }
}

@media (max-width: 720px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
