<template>
  <main class="level2-view">
    <el-card class="level-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 3 · Level 2</span>
        <span>Label Training</span>
      </div>
      <h1>样本打标：教小派认识指令</h1>
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
          <p class="sample-title">样本生成区</p>
          <p class="sample-text">
            <span v-if="currentSample">{{ currentSample }}</span>
            <span v-else class="sample-placeholder">点击下方按钮生成一个样本</span>
          </p>
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
      </section>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel3">[去验收训练成果]</el-button>
      </div>
    </el-card>

    <VideoPlayerModal
      v-model="showVideoOverlay"
      video-src="/videos/dance.mp4"
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
type Round = 1 | 2 | 3

const router = useRouter()
const gameStore = useGameStore()

const round = ref<Round>(1)
const currentSample = ref<string>('')
const showVideoOverlay = ref(false)
const rewarded = ref(false)
const showNextButton = ref(false)
const finished = ref(false)
const showCardModal = ref(false)
const activeCardId = ref('tip_data_labeling')

const activeStep = computed(() => {
  // el-steps active is 0-based-ish in UI expectation; it highlights <= active
  // We'll map: round 1 -> 0, round 2 -> 1, round 3 -> 2, finished -> 3
  if (finished.value) return 3
  return round.value - 1
})

const isFinished = computed(() => finished.value)

const pools: Record<LabelKey, string[]> = {
  hello: ['你好，小派！', '嗨，小派！'],
  spin: ['转个圈吧！', '小派转圈！'],
  dance: ['跳个舞给我看！', '小派跳舞！'],
}

const roundTargetLabel = computed<LabelKey>(() => {
  if (round.value === 1) return 'hello'
  if (round.value === 2) return 'spin'
  return 'dance'
})

function pickRandom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function addSample() {
  if (currentSample.value) return
  const key = roundTargetLabel.value
  currentSample.value = pickRandom(pools[key])
}

function chooseLabel(label: LabelKey) {
  if (!currentSample.value) return

  const target = roundTargetLabel.value
  if (label !== target) {
    ElMessage.error('标签不对，再看看这句话更像哪条指令。')
    return
  }

  ElMessage.success('标注正确！已加入训练样本。')
  currentSample.value = ''

  if (round.value < 3) {
    round.value = (round.value + 1) as Round
    return
  }

  // 第3轮完成
  showVideoOverlay.value = true
}

async function onVideoEnded() {
  if (!rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly()
    gameStore.addStar()
    showNextButton.value = true
    finished.value = true
    ElMessage.success('训练完成！获得 1 颗小派能量星。')
  }
}

function goLevel3() {
  router.push('/chapter3/level3')
}

function openCard(cardId: string) {
  gameStore.unlockCard(cardId)
  activeCardId.value = cardId
  showCardModal.value = true
}
</script>

<style scoped>
.level2-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 8% -2%, rgb(255 190 120 / 28%) 0%, transparent 36%),
    radial-gradient(circle at 94% 8%, rgb(123 197 255 / 20%) 0%, transparent 34%),
    linear-gradient(180deg, #f8edcf 0%, #f8f0dc 100%);
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 26px;
  padding: 10px 10px 16px;
  border: 2px solid #f0e2c8;
  background:
    radial-gradient(circle at top right, rgb(255 238 209 / 62%) 0%, transparent 36%),
    #f7f4ed;
  box-shadow:
    0 22px 36px rgb(222 170 88 / 18%),
    inset 0 0 0 2px rgb(255 255 255 / 42%);
}

.head-meta {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.head-meta span {
  border-radius: 9999px;
  border: 1px solid rgb(206 156 68 / 50%);
  background: linear-gradient(180deg, #fff3dd 0%, #ffe9c6 100%);
  padding: 5px 12px;
  font-size: 12px;
  color: #9f6a17;
  font-weight: 700;
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  color: #8f560f;
  font-size: clamp(28px, 4.4vw, 46px);
  letter-spacing: -0.8px;
}

.tip-line {
  margin: 0 0 10px;
  text-align: center;
  color: #8a601f;
  font-weight: 600;
}

.term-btn {
  border: 0;
  background: transparent;
  color: #d97706;
  font-weight: 900;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 8px;
  animation: term-glow 1.4s ease-in-out infinite;
}

.term-btn:hover {
  text-decoration: underline;
}

.progress-wrap {
  margin: 10px 0 18px;
}

.sample-area {
  display: grid;
  gap: 14px;
  justify-items: center;
}

.sample-box {
  width: min(760px, 100%);
  border-radius: 14px;
  border: 2px dashed #f1be73;
  background: linear-gradient(180deg, #fffdf7 0%, #fff3df 100%);
  padding: 16px 14px;
  text-align: center;
}

.sample-title {
  margin: 0 0 8px;
  font-weight: 800;
  color: #8a601f;
}

.sample-text {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #7a4d12;
  min-height: 34px;
}

.sample-placeholder {
  color: #bd9362;
  font-weight: 600;
  font-size: 16px;
}

.labels {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

@keyframes term-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(217 119 6 / 0%);
    background: rgb(217 119 6 / 0%);
  }
  50% {
    box-shadow: 0 0 0 10px rgb(217 119 6 / 12%);
    background: rgb(217 119 6 / 10%);
  }
}
</style>
