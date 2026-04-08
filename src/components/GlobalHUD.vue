<template>
  <header class="global-hud">
    <el-card class="hud-card" shadow="always">
      <div class="hud-row">
        <div class="hud-stars">
          <el-icon class="star-icon"><StarFilled /></el-icon>
          <span class="stars-text">{{ energyStars }} / {{ maxStars }}</span>
        </div>
        <el-button class="knowledge-btn" size="small" round @click="drawerOpen = true">知识图鉴</el-button>
      </div>
    </el-card>

    <el-drawer v-model="drawerOpen" title="知识图鉴" size="420px" :append-to-body="true">
      <div class="drawer-grid">
        <div
          v-for="card in allCards"
          :key="card.id"
          class="drawer-card"
          :class="{ locked: !unlockedCards.includes(card.id) }"
        >
          <div class="dc-title">
            <span v-if="unlockedCards.includes(card.id)">{{ card.title }}</span>
            <span v-else>？ 未解锁</span>
          </div>
          <div class="dc-id">{{ card.id }}</div>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { StarFilled } from '@element-plus/icons-vue'
import { useGameStore } from '../stores/gameStore'
import { ref } from 'vue'

const gameStore = useGameStore()
const { energyStars, maxStars, unlockedCards } = storeToRefs(gameStore)

const drawerOpen = ref(false)

const allCards = [
  { id: 'tip_pai_intro', title: 'AI小贴士·小派的自白' },
  { id: 'tip_what_is_asr', title: 'AI小贴士·语音识别' },
  { id: 'tip_intent_recognition', title: 'AI小贴士·意图识别' },
  { id: 'tip_data_labeling', title: 'AI小贴士·数据标注' },
  { id: 'tip_dataset', title: 'AI小贴士·数据集' },
  { id: 'tip_generalization', title: 'AI小贴士·泛化能力' },
]
</script>

<style scoped>
.global-hud {
  position: fixed;
  top: 12px;
  left: 0;
  z-index: 1200;
  width: 100%;
  pointer-events: none;
}

.hud-card {
  width: fit-content;
  margin-left: auto;
  margin-right: 12px;
  border-radius: 999px;
  border: 1px solid #f7d96f;
  background: linear-gradient(135deg, #fff8d9 0%, #ffe9a5 100%);
  pointer-events: auto;
}

.hud-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hud-stars {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #8b5a00;
}

.star-icon {
  color: #f59e0b;
  font-size: 18px;
}

.stars-text {
  font-size: 14px;
  line-height: 1;
}

.knowledge-btn {
  font-weight: 800;
}

.drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.drawer-card {
  border-radius: 14px;
  border: 1px solid rgb(59 130 246 / 18%);
  background: linear-gradient(135deg, rgb(224 242 254 / 60%) 0%, #fff 60%);
  padding: 12px;
}

.drawer-card.locked {
  border-color: rgb(148 163 184 / 45%);
  background: linear-gradient(135deg, rgb(226 232 240 / 60%) 0%, #fff 60%);
  color: #64748b;
}

.dc-title {
  font-weight: 900;
  color: #0f172a;
}

.drawer-card.locked .dc-title {
  color: #64748b;
}

.dc-id {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 480px) {
  .drawer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
