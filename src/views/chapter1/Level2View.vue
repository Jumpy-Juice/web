<template>
  <main class="level2-view">
    <el-card class="level-card" shadow="hover">
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
        <div class="scene-bg">
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
.level2-view { min-height: 100vh; padding: 24px; background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%); }
.level-card { width: min(1100px, 100%); margin: 0 auto; border-radius: 16px; }
h1 { margin: 0 0 8px; text-align: center; color: #1f2d3d; font-size: 28px; }
.guide { margin: 0 0 12px; text-align: center; color: #334155; line-height: 1.8; }
.knowledge-card { border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; }
.knowledge-card h2 { margin: 0 0 6px; font-size: 16px; color: #1e3a8a; }
.knowledge-card p { margin: 0 0 6px; color: #334155; line-height: 1.7; }
.one-line { font-weight: 700; color: #0f766e; }
.scene-switcher { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px; }
.scene-title { min-width: 180px; text-align: center; font-size: 20px; font-weight: 700; color: #334155; }
.scene-stage { display: flex; justify-content: center; }
.scene-bg { position: relative; width: min(900px, 100%); aspect-ratio: 16 / 9; border-radius: 14px; border: 2px solid #bfdbfe; background: linear-gradient(180deg, rgb(191 219 254 / 20%) 0%, rgb(147 197 253 / 15%) 100%), repeating-linear-gradient(45deg, rgb(148 163 184 / 15%) 0, rgb(148 163 184 / 15%) 10px, rgb(148 163 184 / 8%) 10px, rgb(148 163 184 / 8%) 20px); overflow: hidden; }
.hotspot { position: absolute; transform: translate(-50%, -50%); border-radius: 999px; border: 2px solid #60a5fa; background: rgb(96 165 250 / 28%); color: #0f172a; font-weight: 700; display: grid; place-items: center; text-align: center; padding: 6px; cursor: pointer; transition: all 0.2s ease; }
.hotspot:hover { transform: translate(-50%, -50%) scale(1.04); }
.hotspot.correct { border-color: #16a34a; background: rgb(34 197 94 / 28%); color: #14532d; }
.hotspot.wrong { border-color: #ef4444; background: rgb(239 68 68 / 30%); }
.progress { margin: 14px 0 0; text-align: center; color: #334155; font-weight: 600; }
.action-row { margin-top: 18px; display: flex; justify-content: center; }
</style>
