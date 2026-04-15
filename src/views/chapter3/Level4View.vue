<template>
  <main class="level4-view">
    <el-card class="level-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 3 · Level 4</span>
        <span>Debug Room</span>
      </div>
      <h1>调试室 Debug</h1>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="小芽提示"
        description="工程师在训练AI时也会经常遇到错误。我们找找哪里出了问题。"
      />

      <section class="panel">
        <h2>检查面板</h2>
        <div class="term-row">
          <el-button size="small" round @click="openCard('tip_dataset')">数据集</el-button>
          <el-button size="small" round @click="openCard('tip_generalization')">泛化能力</el-button>
        </div>
        <div class="options">
          <el-button
            round
            :disabled="resolved"
            @click="choose('mic')"
          >
            [是因为麦克风坏了吗？]
          </el-button>
          <el-button
            type="primary"
            round
            :disabled="resolved"
            @click="choose('rule')"
          >
            [是因为动作规则绑错了吗？]
          </el-button>
        </div>

        <p v-if="feedback" class="feedback">{{ feedback }}</p>
      </section>

      <div v-if="resolved" class="action-row action-row--primary">
        <el-button type="primary" size="large" round @click="goEnd">[唤醒最终形态小派！]</el-button>
      </div>

      <section v-if="resolved" class="panel panel--after-cta">
        <el-alert
          class="xiaoya-summary"
          type="success"
          :closable="false"
          show-icon
          title="小芽总结"
          description="样本太少、环境太吵、规则设错……这些都会让AI变“笨”。不断发现问题并调试，AI才会越来越聪明！这就是真正的工程师做的事。"
        />
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
    feedback.value = '不对哦，它听见了，只是动作做错了。'
    ElMessage.warning(feedback.value)
    return
  }

  feedback.value = '答对啦！原来“跳个舞”的动作卡片没插紧。重新插好，问题解决！'
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
      // 仍给提示，但不阻止流程
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
</script>

<style scoped>
.level4-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 8% -2%, rgb(255 190 120 / 28%) 0%, transparent 36%),
    radial-gradient(circle at 94% 8%, rgb(123 197 255 / 20%) 0%, transparent 34%),
    linear-gradient(180deg, #f8edcf 0%, #f8f0dc 100%);
}

.level-card {
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 26px;
  padding-bottom: 24px;
  padding-inline: 10px;
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

.panel {
  margin-top: 14px;
  border: 2px dashed #f1be73;
  border-radius: 16px;
  padding: 14px;
  background: linear-gradient(180deg, #fffdf7 0%, #fff3df 100%);
  position: relative;
}

.panel::before {
  content: 'DEBUG';
  position: absolute;
  top: -10px;
  right: 12px;
  border-radius: 9999px;
  background: linear-gradient(180deg, #ff8a65 0%, #ff7043 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  letter-spacing: 0.4px;
}

.term-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

h2 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #8a601f;
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feedback {
  margin: 12px 0 0;
  font-weight: 700;
  color: #8a601f;
  line-height: 1.8;
}

.panel--after-cta {
  margin-top: 14px;
}

.xiaoya-summary {
  margin-top: 0;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.action-row--primary {
  margin-top: 14px;
}

.jackpot {
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: grid;
  place-items: center;
  background: radial-gradient(circle, rgb(253 230 138 / 45%) 0%, rgb(15 23 42 / 55%) 70%);
  animation: fade-in 0.2s ease;
}

.jackpot-inner {
  width: min(520px, calc(100% - 24px));
  background: linear-gradient(135deg, #fff 0%, #fffbeb 100%);
  border: 1px solid #f59e0b;
  border-radius: 16px;
  padding: 22px 18px;
  text-align: center;
  box-shadow: 0 18px 40px rgb(0 0 0 / 22%);
}

.jackpot-title {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  color: #b45309;
  letter-spacing: 2px;
  animation: pop 0.6s ease;
}

.jackpot-sub {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #92400e;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  60% {
    transform: scale(1.04);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
