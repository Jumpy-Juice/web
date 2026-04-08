<template>
  <main class="home-view">
    <el-card class="home-card" shadow="hover">
      <h1>听见指令，唤醒小派</h1>
      <h2>和你的AI宠物机器人一起，解锁“听懂你”的秘密</h2>
      <p>
        欢迎来到AI训练站。今天，你将得到一只全新的AI宠物机器人——小派。它很可爱，也很想和你做朋友。可是现在，它还不会听懂你的话。你愿意陪它一起成长，教会它“听见”“分辨”“回应”吗？
      </p>

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
  background: linear-gradient(180deg, #f4f9ff 0%, #eef8f3 100%);
}

.home-card {
  width: min(900px, 100%);
  border-radius: 18px;
}

h1 {
  margin: 0 0 10px;
  font-size: 34px;
  line-height: 1.25;
  text-align: center;
  color: #1f2d3d;
}

h2 {
  margin: 0 0 18px;
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  color: #409eff;
  font-weight: 600;
}

p {
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
  color: #303133;
}

.action-row {
  margin-top: 26px;
  display: flex;
  justify-content: center;
}
</style>
