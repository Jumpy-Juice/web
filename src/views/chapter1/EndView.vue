<template>
  <main class="end-view">
    <el-card class="end-card" shadow="hover">
      <h1>小派成长记录 01</h1>

      <section class="summary">
        <p class="summary-title">你已经知道：</p>
        <ul>
          <li v-for="(line, idx) in visibleLines" :key="idx">{{ line }}</li>
        </ul>
      </section>

      <section class="robot-stage">
        <div class="robot-box">
          <PaiRobot :mode="paiMode" />
          <div v-if="showScarfFx" class="scarf-fx" aria-hidden="true"></div>
        </div>
      </section>

      <section class="reward-box">
        <p class="reward-title">章节成长奖励：</p>
        <p class="reward-line">⭐ 小派解锁：亲近模式</p>
        <p class="reward-line">🎁 获得装扮：温暖小围巾</p>
      </section>

      <div class="action-row">
        <el-button type="primary" size="large" round @click="goChapter2">[进入第二章]</el-button>
      </div>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()
const { paiMode, unlockedItems } = storeToRefs(gameStore)

const lines = [
  '✓ 不是会动就等于会听懂',
  '✓ 真正“会听话”的 AI，要能把听到的话和动作对应起来',
  '✓ 小派现在还在学习的起点上，接下来需要你继续训练它',
]

const visibleLines = ref<string[]>([])
const showScarfFx = ref(false)
const timers: number[] = []

onMounted(() => {
  gameStore.unlockMode('friendly')
  if (!unlockedItems.value.includes('scarf')) {
    gameStore.unlockItem('scarf')
  }

  lines.forEach((line, index) => {
    const t = window.setTimeout(() => {
      visibleLines.value.push(line)
    }, 450 * (index + 1))
    timers.push(t)
  })

  const fxTimer = window.setTimeout(() => {
    showScarfFx.value = true
  }, 500)
  timers.push(fxTimer)
})

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearTimeout(t))
})

function goChapter2() {
  router.push('/chapter2/story')
}
</script>

<style scoped>
.end-view { min-height: 100vh; padding: 24px; background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%); }
.end-card { width: min(980px, 100%); margin: 0 auto; border-radius: 16px; }
h1 { margin: 0 0 14px; text-align: center; color: #1f2d3d; }
.summary-title { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #334155; }
ul { margin: 0; padding-left: 20px; min-height: 94px; }
li { margin: 8px 0; color: #0f766e; font-weight: 600; animation: line-in 0.35s ease; }
.robot-stage { margin-top: 10px; display: flex; justify-content: center; }
.robot-box { position: relative; width: 300px; min-height: 300px; display: grid; place-items: center; }
.scarf-fx { position: absolute; top: 164px; left: 50%; width: 150px; height: 28px; border-radius: 999px; transform: translateX(-50%); background: linear-gradient(90deg, #ef4444 0%, #f97316 100%); box-shadow: 0 8px 20px rgb(239 68 68 / 35%); animation: scarf-fly-in 0.9s ease-out; }
.reward-box { border-top: 1px dashed #cbd5e1; padding-top: 10px; max-width: 860px; margin: 0 auto; }
.reward-title { margin: 0 0 6px; font-weight: 800; color: #334155; }
.reward-line { margin: 6px 0; color: #92400e; font-weight: 700; }
.action-row { margin-top: 10px; display: flex; justify-content: center; }
@keyframes line-in { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
@keyframes scarf-fly-in {
  0% { opacity: 0; transform: translate(-50%, -48px) scale(0.8) rotate(-12deg); }
  70% { opacity: 1; transform: translate(-50%, 4px) scale(1.05) rotate(6deg); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1) rotate(0); }
}
</style>
