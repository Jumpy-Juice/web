<template>
  <main class="level2-view">
    <el-card class="level-card" shadow="hover">
      <div class="level-header">
        <h1>🏷️ Level 2：样本打标 - 教小派认识指令</h1>
        <img 
          v-if="showDecor" 
          class="level-decor" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015117805.png" 
          alt="打标图标"
        />
      </div>

      <p class="tip-line">
        小提示：把样本句子贴上正确标签，这一步叫
        <button class="term-btn" type="button" @click="openCard('tip_data_labeling')">【数据标注】</button>
      </p>

      <section class="progress-wrap" aria-label="训练进度">
        <el-steps :active="activeStep" align-center finish-status="success">
          <el-step title="你好"></el-step>
          <el-step title="转圈"></el-step>
          <el-step title="跳个舞"></el-step>
        </el-steps>
      </section>

      <section class="sample-area">
        <div class="sample-box">
          <p class="sample-title">📝 样本生成区</p>
          <div class="sample-display">
            <p v-if="currentSample" class="sample-text">
              {{ currentSample }}
            </p>
            <p v-else class="sample-placeholder">
              点击下方按钮生成一个样本
            </p>
          </div>
        </div>

        <el-button
          type="primary"
          size="large"
          round
          :disabled="isFinished || !!currentSample"
          @click="addSample"
        >
          [添加样本]
        </el-button>
      </section>

      <section class="labels">
        <p class="labels-title">👉 请为样本选择正确的标签：</p>
        <div class="label-buttons">
          <el-button
            round
            :disabled="isFinished || !currentSample"
            @click="chooseLabel('hello')"
          >
            [你好]
          </el-button>
          <el-button
            round
            :disabled="isFinished || !currentSample"
            @click="chooseLabel('spin')"
          >
            [转圈]
          </el-button>
          <el-button
            round
            :disabled="isFinished || !currentSample"
            @click="chooseLabel('dance')"
          >
            [跳个舞]
          </el-button>
        </div>
      </section>

      <div class="examples-hint">
        <p>💡 示例：</p>
        <ul>
          <li>"Hi"、"你好吗"、"嗨" → 【你好】</li>
          <li>"转个圈"、"自转"、"旋转" → 【转圈】</li>
          <li>"舞蹈"、"跳一个舞"、"跳舞吧" → 【跳个舞】</li>
        </ul>
      </div>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel3">
          [去验收训练成果]
        </el-button>
      </div>
    </el-card>

    <VideoPlayerModal
      v-model="showVideoOverlay"
      video-src=""
      @video-ended="onVideoEnded"
    />

    <KnowledgeCardModal
      v-model="showCardModal"
      :card-id="activeCardId"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import KnowledgeCardModal from '../../components/KnowledgeCardModal.vue'
import VideoPlayerModal from '../../components/VideoPlayerModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type LabelKey = 'hello' | 'spin' | 'dance'

const router = useRouter()
const gameStore = useGameStore()

const showDecor = ref(false)
const currentSample = ref<string>('')
const showVideoOverlay = ref(false)
const rewarded = ref(false)
const showNextButton = ref(false)

const showCardModal = ref(false)
const activeCardId = ref('tip_data_labeling')

const samplesByLabel: Record<LabelKey, string[]> = {
  hello: [
    '你好',
    'Hi',
    '嗨',
    '早上好',
    '你好吗',
    '嘿',
    '大家好',
    '你们好',
  ],
  spin: [
    '转圈',
    '转一圈',
    '自转',
    '旋转',
    '转圈圈',
    '转起来',
    '360度旋转',
    '转身',
  ],
  dance: [
    '跳舞',
    '跳个舞',
    '舞蹈',
    '跳起来',
    '跳一个舞',
    '跳舞吧',
    '让我们跳舞',
    '舞动起来',
  ],
}

const labelCounts = ref<Record<LabelKey, number>>({
  hello: 0,
  spin: 0,
  dance: 0,
})

const activeStep = computed(() => {
  const counts = [labelCounts.value.hello, labelCounts.value.spin, labelCounts.value.dance]
  return Math.max(...counts)
})

const isFinished = computed(() => {
  return Object.values(labelCounts.value).every((c) => c >= 3)
})

function addSample() {
  if (currentSample.value) return

  const randomLabel = (['hello', 'spin', 'dance'] as LabelKey[]).sort(
    () => Math.random() - 0.5
  )[0]

  const samples = samplesByLabel[randomLabel]
  const randomSample = samples[Math.floor(Math.random() * samples.length)]
  currentSample.value = randomSample
}

function chooseLabel(label: LabelKey) {
  if (!currentSample.value || isFinished.value) return

  const correctLabel = Object.entries(samplesByLabel).find(([_, samples]) =>
    samples.includes(currentSample.value)
  )?.[0] as LabelKey | undefined

  if (label !== correctLabel) {
    ElMessage.warning(`标签不对，这句话应该属于【${correctLabel}】`)
    return
  }

  labelCounts.value[label]++
  currentSample.value = ''

  ElMessage.success('标签正确！')

  if (isFinished.value) {
    showNextButton.value = true
    if (!rewarded.value) {
      rewarded.value = true
      playEnergyStarFly().then(() => {
        gameStore.addStar()
      })
    }
  }
}

function goLevel3() {
  router.push('/chapter3/level3')
}

function onVideoEnded() {
  showVideoOverlay.value = false
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
.level2-view {
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

.progress-wrap {
  margin: 20px 0;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
}

.sample-area {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sample-box {
  padding: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 2px dashed #f59e0b;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sample-title {
  margin: 0 0 12px;
  font-weight: 700;
  color: #92400e;
}

.sample-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.sample-text {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #b45309;
  text-align: center;
  animation: pop-in 0.4s ease-out;
}

.sample-placeholder {
  margin: 0;
  color: #d97706;
  font-style: italic;
}

.labels {
  margin: 24px 0;
  padding: 20px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.labels-title {
  margin: 0 0 12px;
  font-weight: 700;
  color: #065f46;
}

.label-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.examples-hint {
  margin: 20px 0;
  padding: 16px;
  background: #dbeafe;
  border-radius: 8px;
  border-left: 4px solid #0284c7;
  color: #0c4a6e;
}

.examples-hint p {
  margin: 0 0 8px;
  font-weight: 700;
}

.examples-hint ul {
  margin: 0;
  padding-left: 20px;
}

.examples-hint li {
  margin: 4px 0;
  font-size: 13px;
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
