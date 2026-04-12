<template>
  <main class="story-view" :class="{ 'dialogue-open': !showNextButton }">
    <el-card class="story-card" shadow="hover">
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

h1 {
  margin: 0 0 12px;
  text-align: center;
  color: #1f2d3d;
}

.robot-wrap {
  display: flex;
  justify-content: center;
}

.status-box {
  width: min(620px, 100%);
  margin: 10px auto 0;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: linear-gradient(180deg, #fff 0%, #fef2f2 100%);
  padding: 12px 14px;
}

.status-title {
  margin: 0 0 6px;
  font-weight: 800;
  color: #991b1b;
}

.action-row {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}
</style>
