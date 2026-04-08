<template>
  <main class="level3-view">
    <el-card class="level-card" shadow="hover">
      <h1>动作对比测试</h1>

      <div class="stage-layout">
        <section class="panel">
          <h2>小芽 & 阿啵</h2>
          <div class="character-placeholder">小芽（图片占位）</div>
          <div class="abo-placeholder" :class="aboActionClass">
            <div class="abo-label">阿啵（图片占位）</div>
            <div class="abo-action">{{ aboActionText }}</div>
          </div>
        </section>

        <section class="panel">
          <h2>小派</h2>
          <div class="pai-wrap">
            <PaiRobot ref="paiRef" mode="initial" />
          </div>
          <p class="pai-hint">小派当前会表现基础待机动效（闪烁、歪头、浮动），但不会执行具体动作。</p>
        </section>
      </div>

      <div class="cmd-row" v-if="stage === 'abo'">
        <el-button round @click="handleAboCommand('hello')">[你好]</el-button>
        <el-button round @click="handleAboCommand('spin')">[转圈]</el-button>
        <el-button round @click="handleAboCommand('dance')">[跳个舞]</el-button>
      </div>

      <div class="cmd-row" v-if="stage === 'pai'">
        <el-button round @click="handlePaiCommand">[你好]</el-button>
        <el-button round @click="handlePaiCommand">[转圈]</el-button>
        <el-button round @click="handlePaiCommand">[跳个舞]</el-button>
      </div>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goEnd">[查看小派的成长变化]</el-button>
      </div>
    </el-card>

    <DialogueBox
      :speaker-name="currentDialogue.speaker"
      :avatar-text="currentDialogue.avatar"
      :content="currentDialogue.text"
      @next="nextDialogue"
    />

    <VideoPlayerModal
      v-model="showVideoModal"
      video-src=""
      @video-ended="onVideoEnded"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DialogueBox from '../../components/DialogueBox.vue'
import PaiRobot from '../../components/PaiRobot.vue'
import { useGameStore } from '../../stores/gameStore'
import VideoPlayerModal from '../../components/VideoPlayerModal.vue'
import { playEnergyStarFly } from '../../utils/energyStarFly'

type Stage = 'abo' | 'pai' | 'settlement' | 'done'
type Command = 'hello' | 'spin' | 'dance'

interface DialogueItem {
  speaker: string
  avatar: string
  text: string
}

const router = useRouter()
const gameStore = useGameStore()

const stage = ref<Stage>('abo')
const paiRef = ref<InstanceType<typeof PaiRobot> | null>(null)
const showVideoModal = ref(false)
const rewarded = ref(false)
const showNextButton = ref(false)

const aboClickedSet = ref<Set<Command>>(new Set())
const dialogueIndex = ref(0)

const aboActionText = ref('等待指令')
const aboActionClass = ref('')

const dialogues = computed<DialogueItem[]>(() => {
  if (stage.value === 'abo') {
    return [
      {
        speaker: '小芽',
        avatar: '芽',
        text: '你想不想先看看，一个真正会听话的AI朋友大概是什么样？那你来试试对我的机器宠物“阿啵”下指令吧。',
      },
    ]
  }

  if (stage.value === 'pai') {
    return [
      {
        speaker: '小芽',
        avatar: '芽',
        text: '现在，你用同样的指令对小派试一下？',
      },
    ]
  }

  return [
    {
      speaker: '玩家',
      avatar: '玩',
      text: '原来你不是不理我，是你还没学会听懂我呀。',
    },
    {
      speaker: '小芽',
      avatar: '芽',
      text: '没关系。你已经发现问题了，这就是训练的第一步。',
    },
  ]
})

const currentDialogue = computed(() => {
  const list = dialogues.value
  return list[Math.min(dialogueIndex.value, list.length - 1)]
})

function handleAboCommand(command: Command) {
  aboClickedSet.value.add(command)

  if (command === 'hello') {
    aboActionText.value = '阿啵挥手回应中...'
    aboActionClass.value = 'action-wave'
  } else if (command === 'spin') {
    aboActionText.value = '阿啵快速旋转中...'
    aboActionClass.value = 'action-spin'
  } else {
    aboActionText.value = '阿啵先转圈再跳舞中...'
    aboActionClass.value = 'action-dance'
  }

  if (aboClickedSet.value.size === 3) {
    stage.value = 'pai'
    dialogueIndex.value = 0
    ElMessage.success('阿啵三种动作都完成了！')
  }
}

function handlePaiCommand() {
  // 小派只保留基础待机动效，不执行具体动作。
  paiRef.value?.setEffectClass('')
  ElMessage.warning('小派现在还不会执行这个动作，它在努力“听懂”你。')
  stage.value = 'settlement'
  dialogueIndex.value = 0
}

function nextDialogue() {
  const list = dialogues.value
  if (dialogueIndex.value < list.length - 1) {
    dialogueIndex.value += 1
    return
  }

  if (stage.value === 'settlement') {
    showVideoModal.value = true
  }
}

async function onVideoEnded() {
  if (!rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly()
    gameStore.addStar()
    showNextButton.value = true
    stage.value = 'done'
    ElMessage.success('已完成本关，获得 1 颗小派能量星！')
  }
}

function goEnd() {
  router.push('/chapter1/end')
}
</script>

<style scoped>
.level3-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.level-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  border-radius: 16px;
  padding-bottom: 72px;
}

h1 {
  margin: 0 0 16px;
  text-align: center;
  color: #1f2d3d;
}

.stage-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.panel {
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.character-placeholder,
.abo-placeholder {
  min-height: 140px;
  border-radius: 12px;
  border: 2px dashed #94a3b8;
  display: grid;
  place-items: center;
  text-align: center;
  color: #334155;
}

.character-placeholder {
  margin-bottom: 10px;
  background: rgb(226 232 240 / 35%);
}

.abo-placeholder {
  position: relative;
  overflow: hidden;
  background: rgb(191 219 254 / 35%);
}

.abo-label {
  font-weight: 700;
}

.abo-action {
  margin-top: 6px;
  font-size: 14px;
}

.action-wave {
  animation: wave 1.1s ease-in-out infinite;
}

.action-spin {
  animation: spin 0.9s linear infinite;
}

.action-dance {
  animation: dance 1s ease-in-out infinite;
}

.pai-wrap {
  display: flex;
  justify-content: center;
}

.pai-hint {
  margin: 4px 0 0;
  text-align: center;
  color: #64748b;
  font-size: 13px;
}

.cmd-row {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dance {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(-8deg);
  }
  75% {
    transform: translateY(-8px) rotate(8deg);
  }
}

@media (max-width: 900px) {
  .stage-layout {
    grid-template-columns: 1fr;
  }
}
</style>
