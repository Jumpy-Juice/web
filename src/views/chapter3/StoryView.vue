<template>
  <main class="story-view" :class="{ 'dialogue-open': !showNextButton }">
    <el-card class="story-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 3 · Story</span>
        <span>Trainer Journey</span>
      </div>
      <h1>第三章：训练小派“听懂并行动”</h1>

      <div class="robot-wrap">
        <PaiRobot mode="listening" :effect-class="robotEffectClass" />
      </div>

      <div class="status-box" aria-label="小派状态提示">
        <p class="status-title">小派状态</p>
        <SoundWave :text="statusText" />
      </div>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel1">[开始设定训练规则]</el-button>
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
      '因为它现在只是会“听”，还不知道“听到这句话以后该做什么”。这一回，轮到你来当真正的小训练师啦！',
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
})

onBeforeUnmount(() => {
  if (typeTimer !== undefined) window.clearInterval(typeTimer)
})
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at 8% -2%, rgb(255 177 102 / 28%) 0%, transparent 38%),
    radial-gradient(circle at 94% 10%, rgb(112 184 255 / 22%) 0%, transparent 35%),
    linear-gradient(180deg, #f8edcf 0%, #f8f0dc 100%);
  position: relative;
  overflow: hidden;
}

.story-view.dialogue-open {
  padding-bottom: 220px;
}

.story-card {
  width: min(980px, 100%);
  min-height: 620px;
  margin: 0 auto;
  border-radius: 26px;
  padding-bottom: 84px;
  padding-inline: 10px;
  background:
    radial-gradient(circle at top right, rgb(255 232 197 / 70%) 0%, transparent 34%),
    #f7f4ed;
  border: 2px solid #f0e2c8;
  box-shadow:
    0 20px 36px rgb(222 170 88 / 20%),
    inset 0 0 0 2px rgb(255 255 255 / 45%);
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
  font-size: clamp(28px, 4.5vw, 48px);
  letter-spacing: -0.8px;
  text-shadow: 0 2px 0 rgb(255 255 255 / 65%);
}

.robot-wrap {
  display: flex;
  justify-content: center;
}

.status-box {
  width: min(620px, 100%);
  margin: 10px auto 0;
  border-radius: 18px;
  border: 2px dashed #f1be73;
  background: linear-gradient(180deg, #fffdf7 0%, #fff3df 100%);
  padding: 12px 14px;
  position: relative;
}

.status-box::after {
  content: 'NEW';
  position: absolute;
  top: -10px;
  right: 12px;
  border-radius: 9999px;
  background: linear-gradient(180deg, #ff9b6e 0%, #ff7f50 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  letter-spacing: 0.4px;
}

.status-title {
  margin: 0 0 6px;
  font-weight: 800;
  color: #a76612;
}

.action-row {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}
</style>
