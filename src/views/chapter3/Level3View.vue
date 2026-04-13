<template>
  <main class="level3-view">
    <el-card class="level-card" shadow="hover">
      <div class="level-header">
        <h1>✅ Level 3：验收测试 - 小派会不会按指令行动？</h1>
        <img 
          v-if="showDecor" 
          class="level-decor test-icon"
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015118483.png" 
          alt="测试图标"
        />
      </div>

      <div class="test-zone">
        <section class="robot-area">
          <p class="area-label">🤖 小派在这里</p>
          <PaiRobot ref="paiRef" mode="listening" />
        </section>

        <section class="command-area">
          <p class="area-label">🎙️ 玩家指令发送框</p>
          <div class="cmd-row">
            <el-button :disabled="locked" round @click="sendCommand('hello')">[你好]</el-button>
            <el-button :disabled="locked" round @click="sendCommand('spin')">[转圈]</el-button>
            <el-button :disabled="locked" round @click="sendCommand('dance')">[跳个舞]</el-button>
          </div>
          <p class="progress">当前测试：{{ testStep }}/3</p>
        </section>
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="💡 温馨提示"
        description="请按顺序发送三个指令，观察小派的反应。如果动作正确，请确认，否则可能需要调试。"
        style="margin: 20px 0"
      />

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goDebug">[进入调试室排查问题]</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showJudge" title="这样做对吗？" width="420px" :close-on-click-modal="false">
      <div class="judge-body">
        <img 
          v-if="pendingCommand === 'hello'" 
          class="action-preview" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015116470.png" 
          alt="挥手"
        />
        <img 
          v-else-if="pendingCommand === 'spin'" 
          class="action-preview" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015117151.png" 
          alt="转圈"
        />
        <img 
          v-else-if="pendingCommand === 'dance'" 
          class="action-preview" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015117805.png" 
          alt="跳舞"
        />
        <p class="judge-text">请根据你观察到的动作选择。</p>
      </div>
      <template #footer>
        <el-button @click="judge(false)">❌ 不对</el-button>
        <el-button type="primary" @click="judge(true)">✅ 对</el-button>
      </template>
    </el-dialog>

    <VideoPlayerModal
      v-model="showVideoModal"
      video-src=""
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

const showDecor = ref(false)
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
    // Bug：跳个舞只跳不转
    paiRef.value?.playAction('jump')
  }

  window.setTimeout(() => {
    showJudge.value = true
  }, 800)
}

function judge(isYes: boolean) {
  showJudge.value = false
  
  if (!pendingCommand.value) return

  const cmd = pendingCommand.value
  let isCorrect = false

  if (cmd === 'hello') {
    isCorrect = isYes // 正确的
  } else if (cmd === 'spin') {
    isCorrect = isYes // 正确的
  } else if (cmd === 'dance') {
    isCorrect = !isYes // 故意错误，需要用户判断为错
  }

  if (isCorrect) {
    ElMessage.success(`${cmd} 的反应正确！`)
    testStep.value++

    if (testStep.value > 3) {
      locked.value = false
      showNextButton.value = true

      if (!rewarded.value) {
        rewarded.value = true
        playEnergyStarFly().then(() => {
          gameStore.addStar()
        })
      }
    } else {
      locked.value = false
    }
  } else {
    if (cmd === 'dance') {
      ElMessage.warning('看来 [跳个舞] 的动作有问题，让我们进入调试室找出原因吧。')
    } else {
      ElMessage.error('这个反应不对，需要检查一下。')
    }
    testStep.value++

    if (testStep.value > 3) {
      locked.value = false
      showNextButton.value = true

      if (!rewarded.value) {
        rewarded.value = true
        playEnergyStarFly().then(() => {
          gameStore.addStar()
        })
      }
    } else {
      locked.value = false
    }
  }

  pendingCommand.value = null
}

function goDebug() {
  router.push('/chapter3/level4')
}

function onVideoEnded() {
  showVideoModal.value = false
}

if (typeof window !== 'undefined') {
  window.setTimeout(() => {
    showDecor.value = true
  }, 600)
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

.level-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.level-header h1 {
  margin: 0;
  color: #1f2d3d;
  flex: 1;
}

.level-decor {
  width: 70px;
  height: 70px;
  animation: bounce-in 0.6s ease-out;
}

.test-zone {
  margin: 24px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.area-label {
  margin: 0 0 12px;
  font-weight: 700;
  color: #0f766e;
  font-size: 14px;
}

.robot-area {
  padding: 20px;
  background: #f0fdf4;
  border-radius: 8px;
  border: 2px dashed #10b981;
  text-align: center;
}

.command-area {
  padding: 20px;
  background: #fef3c7;
  border-radius: 8px;
  border: 2px dashed #f59e0b;
}

.cmd-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.progress {
  margin: 12px 0 0;
  font-weight: 700;
  color: #92400e;
  text-align: center;
}

.judge-body {
  text-align: center;
}

.action-preview {
  max-width: 120px;
  max-height: 120px;
  margin: 0 auto 12px;
  display: block;
}

.judge-text {
  margin: 0;
  color: #0f766e;
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .test-zone {
    grid-template-columns: 1fr;
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
