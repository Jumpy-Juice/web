<template>
  <main class="story-view">
    <el-card class="story-card" shadow="hover">
      <h1>第二章：听见声音，开始分辨</h1>

      <div class="robot-wrap">
        <PaiRobot :mode="currentMode" />
      </div>

      <template v-if="currentStep === 1">
        <div class="equip-area">
          <button class="headset-btn" type="button" @click="handleEquipHeadset">
            🎧 试听耳麦（点击给小派戴上）
          </button>
        </div>
      </template>

      <template v-if="currentStep >= 2">
        <SoundWave :text="waveText" />
      </template>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goLevel1">[看看声音的奇妙旅行]</el-button>
      </div>
    </el-card>

    <DialogueBox
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
import { useGameStore } from '../../stores/gameStore'

type Step = 1 | 2 | 3
type PaiMode = 'initial' | 'friendly' | 'listening' | 'interactive'

const router = useRouter()
const gameStore = useGameStore()

const currentStep = ref<Step>(1)
const dialogueIndex = ref(0)
const currentMode = ref<PaiMode>('friendly')
const showNextButton = ref(false)

const waveText = ref('')
const timers: number[] = []

const step1Dialogues = [
  {
    speakerName: '小芽',
    avatarText: '芽',
    content:
      '我带来了一个新部件——试听耳麦。给小派装上它，小派就可以开始尝试把收到的声音分辨成有意义的信息啦。',
  },
]

const step3Dialogues = [
  {
    speakerName: '玩家',
    avatarText: '玩',
    content: '它好像真的收到了声音......可还是不知道我在说什么。',
  },
  {
    speakerName: '小芽',
    avatarText: '芽',
    content:
      '对呀。现在的小派只是听到了“有声音”，还在试着把这段声音变成有意义的信息呢。我们来看看声音在它肚子里是怎么跑的吧！',
  },
]

const currentDialogue = computed(() => {
  if (currentStep.value === 1) return step1Dialogues[0]
  return step3Dialogues[Math.min(dialogueIndex.value, step3Dialogues.length - 1)]
})

onMounted(() => {
  gameStore.unlockMode('friendly')
  currentMode.value = 'friendly'
})

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearTimeout(t))
})

function handleEquipHeadset() {
  currentStep.value = 2
  gameStore.unlockMode('listening')
  currentMode.value = 'listening'
  startWaveTyping()
}

function startWaveTyping() {
  waveText.value = ''
  const texts = ['已接收声音......', '正在尝试识别......', '无法识别内容']

  texts.forEach((text, idx) => {
    const timer = window.setTimeout(() => {
      waveText.value = text
      if (idx === texts.length - 1) {
        const nextTimer = window.setTimeout(() => {
          currentStep.value = 3
          dialogueIndex.value = 0
        }, 500)
        timers.push(nextTimer)
      }
    }, idx * 900 + 200)
    timers.push(timer)
  })
}

function nextDialogue() {
  if (currentStep.value === 1) return
  if (dialogueIndex.value < step3Dialogues.length - 1) {
    dialogueIndex.value += 1
    return
  }
  showNextButton.value = true
}

function goLevel1() {
  router.push('/chapter2/level1')
}
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
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

.equip-area {
  margin-top: 4px;
  display: flex;
  justify-content: center;
}

.headset-btn {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  color: #0f172a;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  box-shadow: 0 6px 18px rgb(245 158 11 / 24%);
  animation: blink 1.2s infinite;
}

.action-row {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.4;
    transform: translateY(-2px);
  }
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
