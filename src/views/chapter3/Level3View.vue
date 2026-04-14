<template>
  <main class="level3-view">
    <el-card class="level-card" shadow="hover">
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

    <VideoPlayerModal
      v-model="showVideoModal"
      video-src="/videos/dance.mp4"
      @video-ended="onVideoEnded"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'
import VideoPlayerModal from '../../components/VideoPlayerModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Command = 'hello' | 'spin' | 'dance'

const router = useRouter()
const gameStore = useGameStore()

const paiRef = ref<InstanceType<typeof PaiRobot> | null>(null)
const testStep = ref(1)
const showJudge = ref(false)
const locked = ref(false)
const pendingCommand = ref<Command | null>(null)

const showVideoModal = ref(false)
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
      showVideoModal.value = true
    } else {
      ElMessage.error('再看清楚：它只跳了一下，并没有先旋转再跳。')
    }
  }

  // 允许继续测试/重试
  pendingCommand.value = null
  locked.value = false
}

async function onVideoEnded() {
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
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.level-card {
  width: min(980px, 100%);
  margin: 0 auto;
  border-radius: 16px;
}

h1 {
  margin: 0 0 12px;
  text-align: center;
  color: #1f2d3d;
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
  font-weight: 800;
  color: #334155;
}

.cmd-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.progress {
  margin: 12px 0 0;
  color: #64748b;
  font-weight: 600;
}

.judge-body {
  color: #334155;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
