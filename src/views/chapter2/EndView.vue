<template>
  <main class="end-view">
    <el-card class="end-card" shadow="hover">
      <h1>小派成长记录 02</h1>

      <section class="summary-block">
        <p class="summary-title">你已经知道：</p>
        <ul class="summary-list">
          <li>✓ 声音在AI体内的奇妙旅行步骤（收音→变信息→分析比对→输出结果）</li>
          <li>✓ 哪些情况会让AI“听不清”（环境噪音/语速/知识库/硬件）</li>
          <li>✓ AI有时候也会把近音词搞混，需要人来帮忙纠正</li>
        </ul>
      </section>

      <section class="robot-stage">
        <PaiRobot mode="listening" />
      </section>

      <section class="reward-box" aria-label="章节成长奖励">
        <p class="reward-title">章节成长奖励：</p>
        <p class="reward-line">⭐ 小派解锁：试听模式</p>
        <p class="reward-line">🎁 获得装扮：专属小耳机</p>
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

.summary-block {
  max-width: 860px;
  margin: 0 auto;
}

.summary-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #334155;
}

.summary-list {
  margin: 0;
  padding-left: 20px;
}

.summary-list li {
  margin: 8px 0;
  color: #0f766e;
  font-weight: 600;
  line-height: 1.8;
}

.robot-stage {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}

.reward-box {
  max-width: 860px;
  margin: 6px auto 0;
  border-top: 1px dashed #cbd5e1;
  padding-top: 10px;
}

.reward-title {
  margin: 0 0 6px;
  font-weight: 800;
  color: #334155;
}

.reward-line {
  margin: 6px 0;
  color: #92400e;
  font-weight: 700;
}

.action-row {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}
</style>
