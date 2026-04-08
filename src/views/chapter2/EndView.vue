<template>
  <main class="end-view">
    <el-card class="end-card" shadow="hover">
      <h1>第二章结尾</h1>

      <ul class="summary-list">
        <li>√ 声音在AI体内的奇妙旅行步骤</li>
        <li>√ 哪些情况会让AI“听不清”</li>
        <li>√ AI有时候也会把近音词搞混</li>
      </ul>

      <section class="robot-stage">
        <PaiRobot mode="listening" />
      </section>

      <div class="action-row">
        <el-button type="primary" size="large" round @click="goChapter3">
          [进入第三章：我来训练小派听懂指令]
        </el-button>
      </div>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.unlockMode('listening')
  if (!gameStore.unlockedItems.includes('headphone')) {
    gameStore.unlockItem('headphone')
  }
})

function goChapter3() {
  router.push('/chapter3/story')
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

h1 {
  margin: 0 0 12px;
  text-align: center;
  color: #1f2d3d;
}

.summary-list {
  margin: 0;
  padding-left: 20px;
}

.summary-list li {
  margin: 8px 0;
  color: #0f766e;
  font-weight: 600;
}

.robot-stage {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}

.action-row {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
</style>
