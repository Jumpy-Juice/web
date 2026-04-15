<template>
  <main class="level2-view">
    <el-card class="level-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 1 · Level 2</span>
        <span>Scene Discovery</span>
      </div>
      <h1>第一关：AI朋友在哪里</h1>
      <p class="guide">原来，会听声音的AI朋友早就在我们身边啦。请你到不同场景里找一找，哪些设备会“听话”？</p>

      <section class="knowledge-card">
        <h2>🎤 它们是怎么“听话”的？——认识“语音识别技术”</h2>
        <p>语音识别技术主要负责：把“听见”的声音，变成AI能“看懂”的文字。它是AI“听懂你”的第一步，也是最关键的一步。</p>
        <p class="one-line">一句话总结：语音识别技术 = 把声音变成文字的“翻译官”。</p>
      </section>

      <section class="scene-switcher">
        <el-button circle @click="prevScene">&lt;</el-button>
        <div class="scene-title">{{ currentScene.name }}</div>
        <el-button circle @click="nextScene">&gt;</el-button>
      </section>

      <section class="scene-stage">
        <div class="scene-bg" :class="`scene-${currentScene.key}`">
          <div class="scene-anim-layer" aria-hidden="true">
            <template v-if="currentScene.key === 'living-room'">
              <div class="deco wall-line"></div>
              <div class="deco window"></div>
              <div class="deco curtain-left"></div>
              <div class="deco curtain-right"></div>
              <div class="deco sofa"></div>
              <div class="deco cushion c1"></div>
              <div class="deco cushion c2"></div>
              <div class="deco tea-table"></div>
              <div class="deco tv"></div>
              <div class="deco tv-stand"></div>
              <div class="deco lamp"></div>
              <div class="deco carpet"></div>
              <div class="deco plant"></div>
            </template>
            <template v-else-if="currentScene.key === 'bed-room'">
              <div class="deco wall-line"></div>
              <div class="deco moon-window"></div>
              <div class="deco bed"></div>
              <div class="deco blanket"></div>
              <div class="deco pillow"></div>
              <div class="deco desk"></div>
              <div class="deco chair2"></div>
              <div class="deco curtain"></div>
              <div class="deco shelf"></div>
              <div class="deco rug2"></div>
            </template>
            <template v-else>
              <div class="deco wall-line"></div>
              <div class="deco sign-strip"></div>
              <div class="deco board"></div>
              <div class="deco machine"></div>
              <div class="deco chair"></div>
              <div class="deco gate"></div>
              <div class="deco kiosk"></div>
              <div class="deco ceiling-light l1"></div>
              <div class="deco ceiling-light l2"></div>
            </template>
          </div>
          <div
            v-for="hotspot in currentScene.hotspots"
            :key="hotspot.id"
            class="hotspot"
            :class="{
              correct: foundSet.has(hotspot.id),
              wrong: clickedWrongId === hotspot.id,
            }"
            :style="{
              left: hotspot.x + '%',
              top: hotspot.y + '%',
              width: hotspot.w + 'px',
              height: hotspot.h + 'px',
            }"
            @click="handleHotspotClick(hotspot)"
          >
            <span>{{ hotspot.label }}</span>
          </div>
        </div>
      </section>

      <p class="progress">已找到会听话设备：{{ foundCount }} / 6</p>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel3">
          [继续，看看真正“会听话”的样子]
        </el-button>
      </div>
    </el-card>

    <VideoPlayerModal
      v-model="showVideoModal"
      video-src="/videos/life.mp4"
      @video-ended="onVideoEnded"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGameStore } from '../../stores/gameStore'
import VideoPlayerModal from '../../components/VideoPlayerModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

interface Hotspot {
  id: string
  label: string
  correct: boolean
  x: number
  y: number
  w: number
  h: number
  wrongTip?: string
}

interface SceneData {
  key: string
  name: string
  hotspots: Hotspot[]
}

const router = useRouter()
const gameStore = useGameStore()

const currentSceneIndex = ref(0)
const foundSet = ref<Set<string>>(new Set())
const clickedWrongId = ref('')
const showVideoModal = ref(false)
const rewardGiven = ref(false)
const modalOpened = ref(false)

const scenes: SceneData[] = [
  {
    key: 'living-room',
    name: '场景一：客厅',
    hotspots: [
      { id: 'speaker', label: '智能音箱', correct: true, x: 18, y: 28, w: 120, h: 56 },
      { id: 'tv', label: '智能电视', correct: true, x: 68, y: 24, w: 120, h: 56 },
      { id: 'sofa', label: '普通沙发', correct: false, x: 24, y: 66, w: 130, h: 56, wrongTip: '这个只是普通的家具电器哦。' },
      { id: 'lamp', label: '台灯', correct: false, x: 72, y: 62, w: 96, h: 56, wrongTip: '这个只是普通的家具电器哦。' },
    ],
  },
  {
    key: 'bed-room',
    name: '场景二：卧室',
    hotspots: [
      { id: 'phone', label: '手机', correct: true, x: 30, y: 36, w: 90, h: 56 },
      { id: 'watch', label: '智能手表', correct: true, x: 62, y: 40, w: 120, h: 56 },
      { id: 'pillow', label: '枕头', correct: false, x: 20, y: 70, w: 100, h: 56, wrongTip: '它们是很棒的用品，但不会听话呢。' },
      { id: 'bag', label: '书包', correct: false, x: 72, y: 68, w: 100, h: 56, wrongTip: '它们是很棒的用品，但不会听话呢。' },
    ],
  },
  {
    key: 'station-mall',
    name: '场景三：车站 / 商场',
    hotspots: [
      { id: 'ticket', label: '语音售票机', correct: true, x: 24, y: 34, w: 130, h: 56 },
      { id: 'guide-bot', label: '导航机器人', correct: true, x: 66, y: 52, w: 130, h: 56 },
      { id: 'chair', label: '普通椅子', correct: false, x: 18, y: 72, w: 110, h: 56, wrongTip: '这些设施不会语音交互哦。' },
      { id: 'ad-board', label: '广告牌', correct: false, x: 72, y: 22, w: 110, h: 56, wrongTip: '这些设施不会语音交互哦。' },
    ],
  },
]

const currentScene = computed(() => scenes[currentSceneIndex.value])
const foundCount = computed(() => foundSet.value.size)
const allFound = computed(() => foundCount.value === 6)
const showNextButton = computed(() => rewardGiven.value)

function prevScene() {
  currentSceneIndex.value = (currentSceneIndex.value - 1 + scenes.length) % scenes.length
}

function nextScene() {
  currentSceneIndex.value = (currentSceneIndex.value + 1) % scenes.length
}

function handleHotspotClick(hotspot: Hotspot) {
  if (hotspot.correct) {
    if (!foundSet.value.has(hotspot.id)) {
      foundSet.value.add(hotspot.id)
      ElMessage.success(`找到了：${hotspot.label}`)
      if (allFound.value && !modalOpened.value) {
        modalOpened.value = true
        showVideoModal.value = true
      }
    }
    return
  }

  clickedWrongId.value = hotspot.id
  window.setTimeout(() => {
    if (clickedWrongId.value === hotspot.id) clickedWrongId.value = ''
  }, 450)
  ElMessage.warning(hotspot.wrongTip || '再找找看。')
}

async function onVideoEnded() {
  if (!rewardGiven.value && allFound.value) {
    rewardGiven.value = true
    await playEnergyStarFly()
    gameStore.addStar()
    ElMessage.success('恭喜你完成第一关！获得：小派能量星 ×1')
  }
}

function goLevel3() {
  router.push('/chapter1/level3')
}
</script>

<style scoped>
.level2-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 10% 0%, rgb(229 180 132 / 18%) 0%, transparent 36%),
    radial-gradient(circle at 86% 5%, rgb(146 168 233 / 16%) 0%, transparent 34%),
    linear-gradient(180deg, #f7f4ed 0%, #f3efe5 100%);
}

.level-card {
  width: min(1100px, 100%);
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
  margin: 0 0 8px;
  text-align: center;
  color: #1c1c1c;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: -0.8px;
}

.guide {
  margin: 0 0 12px;
  text-align: center;
  color: #5f5f5d;
  line-height: 1.8;
}

.knowledge-card {
  border: 1px solid #eceae4;
  background: rgb(252 251 248 / 72%);
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.knowledge-card h2 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #1c1c1c;
}

.knowledge-card p {
  margin: 0 0 6px;
  color: #5f5f5d;
  line-height: 1.7;
}

.one-line {
  font-weight: 400;
  color: #1c1c1c;
  border-left: 3px solid rgb(28 28 28 / 26%);
  padding-left: 8px;
}

.scene-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.scene-title {
  min-width: 180px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1c1c1c;
}

.scene-stage {
  display: flex;
  justify-content: center;
}

.scene-bg {
  position: relative;
  width: min(900px, 100%);
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  border: 1px solid #eceae4;
  background: linear-gradient(180deg, rgb(252 251 248 / 84%) 0%, rgb(246 242 234 / 88%) 100%);
  overflow: hidden;
}

.scene-bg::before,
.scene-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scene-bg::before {
  background: radial-gradient(circle at 20% 10%, rgb(255 255 255 / 42%) 0%, transparent 35%);
}

.scene-bg::after {
  animation: ambient-float 4.8s ease-in-out infinite;
}

.scene-living-room {
  background:
    linear-gradient(180deg, #f8e9d0 0%, #f2dfc2 44%, #dcc2a3 44%, #d2b792 100%);
}

.scene-living-room::after {
  background:
    radial-gradient(circle at 84% 18%, rgb(254 241 196 / 65%) 0%, transparent 28%),
    radial-gradient(circle at 14% 80%, rgb(255 213 150 / 28%) 0%, transparent 30%);
}

.scene-bed-room {
  background:
    linear-gradient(180deg, #deefff 0%, #d3e7fb 46%, #cec5e9 46%, #bfb5dd 100%);
}

.scene-bed-room::after {
  background:
    radial-gradient(circle at 20% 20%, rgb(255 255 255 / 38%) 0%, transparent 30%),
    radial-gradient(circle at 80% 76%, rgb(214 193 255 / 32%) 0%, transparent 30%);
}

.scene-station-mall {
  background:
    linear-gradient(180deg, #d9eef2 0%, #cde2e8 46%, #c5ced5 46%, #b6c1c9 100%);
}

.scene-station-mall::after {
  background:
    radial-gradient(circle at 88% 18%, rgb(179 230 255 / 35%) 0%, transparent 32%),
    radial-gradient(circle at 16% 72%, rgb(255 242 173 / 25%) 0%, transparent 34%);
}

.scene-anim-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.deco {
  position: absolute;
  border: 2px solid rgb(28 28 28 / 24%);
  border-radius: 14px;
  background: rgb(255 255 255 / 42%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 32%);
}

.wall-line {
  left: 0;
  top: 44%;
  width: 100%;
  height: 2px;
  border: none;
  border-radius: 0;
  background: rgb(74 58 41 / 20%);
  box-shadow: none;
}

.window {
  left: 8%;
  top: 13%;
  width: 150px;
  height: 102px;
  background: linear-gradient(180deg, #cce9ff 0%, #9fceef 100%);
}

.curtain-left,
.curtain-right {
  width: 34px;
  height: 120px;
  top: 11%;
  background: linear-gradient(180deg, #ffe9bf 0%, #f6cb86 100%);
}

.curtain-left {
  left: 7%;
}

.curtain-right {
  left: calc(8% + 118px);
}

.sofa {
  left: 17%;
  bottom: 18%;
  width: 220px;
  height: 94px;
  background: linear-gradient(180deg, #f7c59a 0%, #dfa06f 100%);
}

.cushion {
  bottom: 26%;
  width: 46px;
  height: 34px;
  background: linear-gradient(180deg, #ffeed6 0%, #f7cb93 100%);
}

.c1 {
  left: 21%;
}

.c2 {
  left: 28%;
}

.tea-table {
  left: 43%;
  bottom: 18%;
  width: 130px;
  height: 56px;
  background: linear-gradient(180deg, #efd4ad 0%, #c39f71 100%);
}

.tv {
  right: 15%;
  top: 24%;
  width: 230px;
  height: 126px;
  background: linear-gradient(180deg, #4f6178 0%, #2e3e53 100%);
}

.tv-stand {
  right: 18%;
  top: 53%;
  width: 170px;
  height: 48px;
  background: linear-gradient(180deg, #d9bc93 0%, #b58d61 100%);
}

.lamp {
  right: 32%;
  top: 18%;
  width: 40px;
  height: 150px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffe7a8 0%, #f9c86e 100%);
  animation: glow 2.2s ease-in-out infinite;
}

.carpet {
  left: 30%;
  bottom: 10%;
  width: 300px;
  height: 54px;
  border-radius: 999px;
  background: linear-gradient(180deg, #f8debc 0%, #ebc792 100%);
}

.plant {
  left: 11%;
  bottom: 17%;
  width: 56px;
  height: 90px;
  background: linear-gradient(180deg, #c8efb9 0%, #7fbe65 100%);
  border-radius: 20px 20px 14px 14px;
}

.moon-window {
  left: 10%;
  top: 12%;
  width: 150px;
  height: 100px;
  background: linear-gradient(180deg, #bfd9ff 0%, #8eafe6 100%);
}

.bed {
  left: 16%;
  bottom: 16%;
  width: 300px;
  height: 116px;
  background: linear-gradient(180deg, #fdf6ff 0%, #e6d9f2 100%);
}

.blanket {
  left: 24%;
  bottom: 22%;
  width: 190px;
  height: 72px;
  background: linear-gradient(180deg, #ead8ff 0%, #bca4dc 100%);
}

.pillow {
  left: 23%;
  bottom: 28%;
  width: 92px;
  height: 42px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fff 0%, #eceaf5 100%);
}

.desk {
  right: 14%;
  bottom: 18%;
  width: 200px;
  height: 84px;
  background: linear-gradient(180deg, #d6bc95 0%, #be9a6c 100%);
}

.chair2 {
  right: 18%;
  bottom: 14%;
  width: 82px;
  height: 68px;
  background: linear-gradient(180deg, #ecc89b 0%, #b68955 100%);
}

.curtain {
  right: 22%;
  top: 14%;
  width: 120px;
  height: 180px;
  background: linear-gradient(180deg, #fff0fa 0%, #d6d7ff 100%);
}

.shelf {
  left: 62%;
  top: 16%;
  width: 120px;
  height: 32px;
  background: linear-gradient(180deg, #f1d8af 0%, #caa06a 100%);
}

.rug2 {
  left: 34%;
  bottom: 8%;
  width: 260px;
  height: 48px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ebdbff 0%, #c5afe7 100%);
}

.sign-strip {
  left: 0;
  top: 8%;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 0;
  background: linear-gradient(90deg, rgb(78 112 133 / 75%) 0%, rgb(62 92 109 / 70%) 100%);
  box-shadow: none;
}

.board {
  right: 12%;
  top: 16%;
  width: 210px;
  height: 80px;
  background: linear-gradient(180deg, #4d6472 0%, #384b56 100%);
}

.machine {
  left: 18%;
  top: 26%;
  width: 140px;
  height: 170px;
  background: linear-gradient(180deg, #f2f8fc 0%, #cdd7df 100%);
}

.chair {
  left: 34%;
  bottom: 16%;
  width: 220px;
  height: 64px;
  background: linear-gradient(180deg, #dce1e8 0%, #bdc4ce 100%);
}

.gate {
  right: 28%;
  top: 36%;
  width: 180px;
  height: 160px;
  background: linear-gradient(180deg, #e0f4ff 0%, #bbd8ea 100%);
}

.kiosk {
  right: 8%;
  bottom: 14%;
  width: 90px;
  height: 110px;
  background: linear-gradient(180deg, #e9f5fb 0%, #b7c8d3 100%);
}

.ceiling-light {
  top: 3%;
  width: 54px;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fffce7 0%, #f9e3a2 100%);
  animation: glow 2.4s ease-in-out infinite;
}

.l1 {
  left: 36%;
}

.l2 {
  left: 56%;
}

.hotspot {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 1px solid rgb(28 28 28 / 34%);
  background: rgb(252 251 248 / 88%);
  color: #1c1c1c;
  font-weight: 400;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

@keyframes ambient-float {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 0 rgb(255 230 154 / 0%);
  }
  50% {
    box-shadow: 0 0 22px rgb(255 230 154 / 75%);
  }
}

.hotspot:hover {
  transform: translate(-50%, -50%) scale(1.04);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
}

.hotspot.correct {
  border-color: rgb(34 116 61 / 45%);
  background: rgb(209 236 217 / 85%);
  color: #174428;
}

.hotspot.wrong {
  border-color: rgb(155 56 56 / 48%);
  background: rgb(241 203 203 / 78%);
}

.progress {
  margin: 14px 0 0;
  text-align: center;
  color: #5f5f5d;
  font-weight: 400;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .scene-bg {
    aspect-ratio: 4 / 3;
  }

  .deco {
    transform: scale(0.82);
    transform-origin: top left;
  }
}
</style>
