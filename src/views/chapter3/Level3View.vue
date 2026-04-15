<template>
  <main class="level3-view">
    <el-card class="level-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 3 · Level 3</span>
        <span>Final Test</span>
      </div>
      <h1>验收测试：小派会不会按指令行动？</h1>

      <section class="robot-area">
        <PaiRobot ref="paiRef" mode="listening" />
      </section>

      <section class="command-area">
        <p class="hint">玩家指令发送框</p>
        <div class="cmd-row">
          <el-button :disabled="locked" round @click="sendCommand('hello')">[你好]</el-button>
          <el-button :disabled="locked" round @click="sendCommand('spin')">[转圈]</el-button>
          <el-button :disabled="locked" round @click="sendCommand('dance')">[跳个舞]</el-button>
        </div>
        <p class="progress">当前测试：{{ testStep }}/3</p>
      </section>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goDebug">[进入调试室排查问题]</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showJudge" title="这样做对吗？" width="420px" :close-on-click-modal="false">
      <div class="judge-body">请根据你观察到的动作选择。</div>
      <template #footer>
        <el-button @click="judge(false)">不对</el-button>
        <el-button type="primary" @click="judge(true)">对</el-button>
      </template>
    </el-dialog>

  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Command = 'hello' | 'spin' | 'dance'

const router = useRouter()
const gameStore = useGameStore()

const paiRef = ref<InstanceType<typeof PaiRobot> | null>(null)
const testStep = ref(1)
const showJudge = ref(false)
const locked = ref(false)
const pendingCommand = ref<Command | null>(null)

const showNextButton = ref(false)
const rewarded = ref(false)

function sendCommand(cmd: Command) {
  if (locked.value) return

  // 按测试步骤固定顺序引导
  if (testStep.value === 1 && cmd !== 'hello') {
    ElMessage.warning('先从 [你好] 开始测试吧。')
    return
  }
  if (testStep.value === 2 && cmd !== 'spin') {
    ElMessage.warning('下一步请测试 [转圈]。')
    return
  }
  if (testStep.value === 3 && cmd !== 'dance') {
    ElMessage.warning('最后请测试 [跳个舞]。')
    return
  }

  pendingCommand.value = cmd
  locked.value = true

  if (cmd === 'hello') {
    paiRef.value?.playAction('wave')
  } else if (cmd === 'spin') {
    paiRef.value?.playAction('rotate')
  } else {
    // 埋设Bug：跳个舞只跳不转
    paiRef.value?.playAction('jump')
  }

  showJudge.value = true
}

function judge(isYes: boolean) {
  if (!pendingCommand.value) return

  const cmd = pendingCommand.value
  showJudge.value = false

  if (cmd === 'hello') {
    if (isYes) {
      ElMessage.success('太棒了，指令测试通过！')
      testStep.value = 2
    } else {
      ElMessage.error('再观察一下，小派刚刚是在挥手回应。')
    }
  } else if (cmd === 'spin') {
    if (isYes) {
      ElMessage.success('完美，动作非常标准！')
      testStep.value = 3
    } else {
      ElMessage.error('它刚刚确实旋转了一圈哦。')
    }
  } else {
    // dance：正确答案应为“不对”
    if (!isYes) {
      ElMessage.success('你观察得很仔细！它少做了一个动作。看来我们需要去调试室检查一下原因。')
      void completeLevel()
    } else {
      ElMessage.error('再看清楚：它只跳了一下，并没有先旋转再跳。')
    }
  }

  // 允许继续测试/重试
  pendingCommand.value = null
  locked.value = false
}

async function completeLevel() {
  if (!rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly()
    gameStore.addStar()
    showNextButton.value = true
  }
}

function goDebug() {
  router.push('/chapter3/level4')
}
</script>

<style scoped>
.level3-view {
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

.robot-area {
  display: flex;
  justify-content: center;
}

.command-area {
  margin-top: 8px;
  text-align: center;
}

.hint {
  margin: 0 0 10px;
  font-weight: 700;
  color: #8a601f;
  background: linear-gradient(90deg, rgb(241 190 115 / 18%) 0%, transparent 100%);
  border-radius: 10px;
  padding: 8px 10px;
}

.cmd-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.progress {
  margin: 12px 0 0;
  color: #9a7030;
  font-weight: 700;
}

.judge-body {
  color: #8a601f;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
