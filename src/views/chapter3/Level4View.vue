<template>
  <main class="level4-view">
    <el-card class="level-card" shadow="hover">
      <div class="level-header">
        <h1>🐛 Level 4：调试室 Debug - 找出问题所在</h1>
        <img 
          v-if="showDecor" 
          class="level-decor debug-icon"
          src="../../assets/chapter3/系统语/image_1776015157757.png" 
          alt="Debug工具"
        />
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="小芽提示"
        description="工程师在训练AI时也会经常遇到错误。我们找找哪里出了问题。"
        style="margin: 16px 0"
      />

      <section class="panel">
        <h2>🔍 检查面板</h2>
        <div class="term-row">
          <el-button size="small" round @click="openCard('tip_dataset')">数据集</el-button>
          <el-button size="small" round @click="openCard('tip_generalization')">泛化能力</el-button>
        </div>
        <div class="options">
          <el-button
            round
            :disabled="resolved"
            @click="choose('mic')"
            class="option-btn"
          >
            [是因为麦克风坏了吗？]
          </el-button>
          <el-button
            type="primary"
            round
            :disabled="resolved"
            @click="choose('rule')"
            class="option-btn"
          >
            [是因为动作规则绑错了吗？]
          </el-button>
        </div>

        <p v-if="feedback" class="feedback" :class="{ success: resolved }">{{ feedback }}</p>
      </section>

      <div v-if="resolved" class="action-row action-row--primary">
        <el-button type="primary" size="large" round @click="goEnd">
          [唤醒最终形态小派！]
        </el-button>
      </div>

      <section v-if="resolved" class="panel panel--after-cta">
        <el-alert
          class="xiaoya-summary"
          type="success"
          :closable="false"
          show-icon
          title="小芽总结"
          description="样本太少、环境太吵、规则设错……这些都会让AI变'笨'。不断发现问题并调试，AI才会越来越聪明！这就是真正的工程师做的事。"
        />
      </section>

      <section v-if="resolved" class="resources-showcase">
        <p class="showcase-title">📚 本次训练使用的资源：</p>
        <div class="resources-grid">
          <div class="resource-card">
            <img 
              src="../../assets/chapter3/系统语/image_1776015159660.png" 
              alt="系统语言1"
              class="resource-img"
            />
            <p class="resource-label">系统提示语</p>
          </div>
          <div class="resource-card">
            <video class="resource-img" controls width="80">
              <source src="../../assets/chapter3/小歪头招手跳舞图和视频/video_1776015086741.mp4" type="video/mp4" />
            </video>
            <p class="resource-label">训练视频1</p>
          </div>
          <div class="resource-card">
            <video class="resource-img" controls width="80">
              <source src="../../assets/chapter3/小歪头招手跳舞图和视频/video_1776015093825.mp4" type="video/mp4" />
            </video>
            <p class="resource-label">训练视频2</p>
          </div>
          <div class="resource-card">
            <video class="resource-img" controls width="80">
              <source src="../../assets/chapter3/小歪头招手跳舞图和视频/video_1776015096831.mp4" type="video/mp4" />
            </video>
            <p class="resource-label">训练视频3</p>
          </div>
          <div class="resource-card">
            <video class="resource-img" controls width="80">
              <source src="../../assets/chapter3/小歪头招手跳舞图和视频/video_1776015114120.mp4" type="video/mp4" />
            </video>
            <p class="resource-label">训练视频4</p>
          </div>
          <div class="resource-card">
            <img 
              src="../../assets/chapter3/系统语/image_1776015161220.png" 
              alt="系统语言2"
              class="resource-img"
            />
            <p class="resource-label">系统提示语2</p>
          </div>
        </div>
      </section>
    </el-card>

    <div v-if="showJackpot" class="jackpot">
      <div class="jackpot-inner">
        <p class="jackpot-title">恭喜你完成最后一关！</p>
        <p class="jackpot-sub">集齐了全部 {{ maxStars }} 颗能量星！</p>
      </div>
    </div>

    <KnowledgeCardModal
      v-model="showCardModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Choice = 'mic' | 'rule'

const router = useRouter()
const gameStore = useGameStore()
const { energyStars, maxStars } = storeToRefs(gameStore)

const showDecor = ref(false)
const feedback = ref('')
const resolved = ref(false)
const rewarded = ref(false)
const showJackpot = ref(false)
const showCardModal = ref(false)
const activeCardId = ref('tip_dataset')

const isMax = computed(() => energyStars.value >= maxStars.value)

async function choose(choice: Choice) {
  if (resolved.value) return

  if (choice === 'mic') {
    feedback.value = '❌ 不对哦，它听见了，只是动作做错了。'
    ElMessage.warning(feedback.value)
    return
  }

  feedback.value = '✅ 答对啦！原来"跳个舞"的动作卡片没插紧。重新插好，问题解决！'
  resolved.value = true
  ElMessage.success(feedback.value)

  if (!rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly()
    gameStore.addStar()
  }

  showJackpot.value = true
  window.dispatchEvent(new CustomEvent('stars-jackpot'))
  window.setTimeout(() => {
    showJackpot.value = false
    if (!isMax.value) {
      ElMessage.info(`当前能量星：${energyStars.value}/${maxStars.value}`)
    }
  }, 1400)
}

function goEnd() {
  router.push('/chapter3/end')
}

function openCard(cardId: string) {
  gameStore.unlockCard(cardId)
  activeCardId.value = cardId
  showCardModal.value = true
}

if (typeof window !== 'undefined') {
  window.setTimeout(() => {
    showDecor.value = true
  }, 600)
}
</script>

<style scoped>
.level4-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
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
  margin-bottom: 20px;
}

.level-header h1 {
  margin: 0;
  color: #1f2d3d;
  flex: 1;
}

.debug-icon {
  width: 70px;
  height: 70px;
  animation: bounce-in 0.6s ease-out;
}

.panel {
  margin: 20px 0;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #0284c7;
}

.panel h2 {
  margin: 0 0 16px;
  color: #0c4a6e;
}

.term-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.option-btn {
  justify-content: flex-start;
  text-align: left;
}

.feedback {
  margin-top: 12px;
  padding: 12px;
  background: #fecaca;
  border-radius: 6px;
  color: #7f1d1d;
  font-weight: 600;
}

.feedback.success {
  background: #d1fae5;
  color: #065f46;
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.action-row--primary {
  margin-top: 32px;
}

.panel--after-cta {
  margin-top: 32px;
  background: #f0fdf4;
  border-left-color: #10b981;
}

.xiaoya-summary {
  margin: 0;
}

.resources-showcase {
  margin-top: 32px;
  padding: 20px;
  background: #fef3c7;
  border-radius: 8px;
}

.showcase-title {
  margin: 0 0 16px;
  font-weight: 700;
  color: #92400e;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.resource-card {
  padding: 12px;
  background: white;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #f59e0b;
}

.resource-img {
  max-width: 100%;
  max-height: 80px;
  margin: 0 auto 8px;
  display: block;
  border-radius: 4px;
}

.resource-label {
  margin: 0;
  font-size: 12px;
  color: #92400e;
  font-weight: 600;
}

.jackpot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  animation: pop-in 0.5s ease-out;
}

.jackpot-inner {
  padding: 20px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
}

.jackpot-title {
  margin: 0;
  font-weight: 800;
  font-size: 18px;
}

.jackpot-sub {
  margin: 8px 0 0;
  font-size: 14px;
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

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
