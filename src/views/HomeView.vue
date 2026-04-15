<template>
  <main class="home-view">
    <div class="bg-orb orb-left"></div>
    <div class="bg-orb orb-right"></div>
    <el-card class="home-card" shadow="hover">
      <div class="hero-icons" aria-hidden="true">
        <span class="hero-icon">🤖</span>
        <span class="hero-icon">🎧</span>
        <span class="hero-icon">✨</span>
      </div>
      <div class="badge-row">
        <span class="mission-badge">AI TRAINING STATION</span>
        <span class="mission-badge soft">Warm-up Mission</span>
      </div>

      <h1>听见指令，唤醒小派</h1>
      <h2>和你的 AI 宠物机器人一起，解锁“听懂你”的秘密</h2>

      <p class="intro-text">
        欢迎来到 AI 训练站。今天，你将得到一只全新的 AI 宠物机器人——小派。它很可爱，也很想和你做朋友。可是现在，它还不会听懂你的话。你愿意陪它一起成长，教会它“听见”“分辨”“回应”吗？
      </p>

      <section class="feature-grid" aria-label="训练亮点">
        <article class="feature-item">
          <p class="feature-title">听见</p>
          <p>理解声音输入，让小派先学会“听到你”。</p>
        </article>
        <article class="feature-item">
          <p class="feature-title">分辨</p>
          <p>识别不同指令，建立“词语—动作”关系。</p>
        </article>
        <article class="feature-item">
          <p class="feature-title">回应</p>
          <p>完成动作反馈，让训练结果看得见。</p>
        </article>
      </section>

      <div class="action-row">
        <el-button type="primary" size="large" round @click="handleStart">[开始唤醒小派]</el-button>
      </div>
    </el-card>

    <KnowledgeCardModal
      v-model="showTipModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import KnowledgeCardModal from '../components/KnowledgeCardModal.vue'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const showTipModal = ref(false)
const pendingGoIntro = ref(false)
const activeCardId = ref('tip_pai_intro')
let timer: number | undefined

function handleStart() {
  activeCardId.value = 'tip_pai_intro'
  gameStore.unlockCard(activeCardId.value)
  pendingGoIntro.value = true
  showTipModal.value = true
}

onMounted(() => {
  // 拦截卡片 2：停留 3 秒触发“什么是AI宠物？”
  timer = window.setTimeout(() => {
    if (showTipModal.value) return
    activeCardId.value = 'tip_what_is_ai_pet'
    gameStore.unlockCard(activeCardId.value)
    showTipModal.value = true
  }, 3000)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearTimeout(timer)
})

watch(showTipModal, (open) => {
  if (!open && pendingGoIntro.value) {
    pendingGoIntro.value = false
    router.push('/intro')
  }
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(180deg, #f8f4eb 0%, #f4f0e6 100%);
  position: relative;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 9999px;
  filter: blur(8px);
  pointer-events: none;
}

.orb-left {
  background: radial-gradient(circle, rgb(242 187 129 / 28%) 0%, rgb(242 187 129 / 0%) 70%);
  top: -80px;
  left: -70px;
}

.orb-right {
  background: radial-gradient(circle, rgb(149 170 235 / 24%) 0%, rgb(149 170 235 / 0%) 70%);
  right: -90px;
  bottom: -110px;
}

.home-card {
  width: min(900px, 100%);
  border-radius: 20px;
  padding: 10px 6px;
  position: relative;
}

.hero-icons {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 10px;
}

.hero-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  font-size: 34px;
  border: 1px solid rgb(206 156 68 / 42%);
  background: radial-gradient(circle at 35% 28%, #fffef9 0%, #ffe2ad 76%);
  box-shadow:
    0 0 22px rgb(255 189 86 / 35%),
    inset 0 0 0 2px rgb(255 255 255 / 50%);
}

.badge-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.mission-badge {
  border: 1px solid rgb(28 28 28 / 35%);
  background: rgb(28 28 28 / 6%);
  color: #1c1c1c;
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 12px;
  letter-spacing: 0.4px;
}

.mission-badge.soft {
  background: rgb(252 251 248 / 80%);
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(30px, 4.8vw, 48px);
  line-height: 1.12;
  letter-spacing: -0.9px;
  text-align: center;
  color: #1c1c1c;
}

h2 {
  margin: 0 0 16px;
  font-size: clamp(18px, 2.6vw, 24px);
  line-height: 1.4;
  letter-spacing: -0.25px;
  text-align: center;
  color: rgb(28 28 28 / 83%);
  font-weight: 400;
}

.intro-text {
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  color: #5f5f5d;
}

.feature-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.feature-item {
  border: 1px solid #eceae4;
  border-radius: 14px;
  padding: 12px;
  background: rgb(252 251 248 / 72%);
}

.feature-title {
  margin: 0 0 4px;
  color: #1c1c1c;
  font-size: 18px;
  letter-spacing: -0.2px;
}

.feature-item:nth-child(1) .feature-title::before {
  content: '🎤 ';
}

.feature-item:nth-child(2) .feature-title::before {
  content: '🧠 ';
}

.feature-item:nth-child(3) .feature-title::before {
  content: '🤝 ';
}

.feature-item p {
  margin: 0;
  color: #5f5f5d;
  line-height: 1.7;
}

.action-row {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .hero-icon {
    width: 54px;
    height: 54px;
    font-size: 28px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
