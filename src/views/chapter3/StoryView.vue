<template>
  <main class="story-view" :class="{ 'dialogue-open': !showNextButton }">
    <el-card class="story-card" shadow="hover">
      <div class="story-header">
        <h1>第三章：训练小派"听懂并行动"</h1>
        <img 
          v-if="showHeaderImage" 
          class="header-icon" 
          src="../../assets/chapter3/小歪头招手跳舞图和视频/image_1776015116470.png" 
          alt="小派欢迎"
        />
      </div>

      <div class="robot-wrap">
        <PaiRobot mode="listening" :effect-class="robotEffectClass" />
      </div>

      <div class="status-box" aria-label="小派状态提示">
        <p class="status-title">📊 小派状态</p>
        <SoundWave :text="statusText" />
      </div>

      <div v-if="!showNextButton" class="intro-box">
        <p class="intro-text">
          小派现在只能"听见"，但还不知道"听到后要做什么"。
        </p>
        <p class="intro-text">
          接下来，你需要成为真正的"小训练师"，来教小派理解指令、学会行动！
        </p>
      </div>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel1">
          [开始设定训练规则]
        </el-button>
      </div>
    </el-card>

    <DialogueBox
      v-if="!showNextButton"
      :speaker-name="currentDialogue.speakerName"
      :avatar-text="currentDialogue.avatarText"
      :content="currentDialogue.content"
      @next="nextDialogue"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DialogueBox from '../../components/DialogueBox.vue'
import PaiRobot from '../../components/PaiRobot.vue'
import SoundWave from '../../components/SoundWave.vue'

const router = useRouter()

const dialogueIndex = ref(0)
const showNextButton = ref(false)
const showHeaderImage = ref(false)

const statusText = ref('')
const robotEffectClass = ref('')
let typeTimer: number | undefined

const dialogues = [
  {
    speakerName: '玩家',
    avatarText: '玩',
    content: '小派，我们正式开始玩吧！',
  },
  {
    speakerName: '小芽',
    avatarText: '芽',
    content:
      '因为它现在只是会"听"，还不知道"听到这句话以后该做什么"。这一回，轮到你来当真正的小训练师啦！',
  },
  {
    speakerName: '小派',
    avatarText: '派',
    content:
      '谢谢你！我已经准备好开始学习啦！',
  },
]

const currentDialogue = computed(() => {
  return dialogues[Math.min(dialogueIndex.value, dialogues.length - 1)]
})

function startStatusTyping() {
  if (typeTimer !== undefined) window.clearInterval(typeTimer)

  const full = '已接收声音......无法执行......'
  statusText.value = ''
  robotEffectClass.value = 'alert-fault'

  let i = 0
  typeTimer = window.setInterval(() => {
    if (i >= full.length) {
      if (typeTimer !== undefined) window.clearInterval(typeTimer)
      return
    }
    statusText.value += full[i]
    i += 1
  }, 55)
}

function nextDialogue() {
  if (dialogueIndex.value < dialogues.length - 1) {
    dialogueIndex.value += 1
    return
  }
  showNextButton.value = true
}

function goLevel1() {
  router.push('/chapter3/level1')
}

onMounted(() => {
  startStatusTyping()
  window.setTimeout(() => {
    showHeaderImage.value = true
  }, 800)
})

onBeforeUnmount(() => {
  if (typeTimer !== undefined) window.clearInterval(typeTimer)
})
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.story-view.dialogue-open {
  padding-bottom: 220px;
}

.story-card {
  width: min(980px, 100%);
  min-height: 620px;
  margin: 0 auto;
  border-radius: 16px;
  padding-bottom: 84px;
}

.story-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.story-header h1 {
  margin: 0;
  color: #1f2d3d;
  flex: 1;
}

.header-icon {
  width: 80px;
  height: 80px;
  animation: pop-in 0.5s ease-out;
}

.robot-wrap {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  min-height: 320px;
}

.status-box {
  margin: 20px 0;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #0ea5e9;
}

.status-title {
  margin: 0 0 8px;
  font-weight: 700;
  color: #0ea5e9;
}

.intro-box {
  margin: 24px 0;
  padding: 16px;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.intro-text {
  margin: 8px 0;
  color: #92400e;
  font-size: 15px;
  line-height: 1.6;
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
