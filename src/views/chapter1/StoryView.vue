<template>
  <main class="story-view">
    <el-card class="story-card" shadow="hover">
      <template v-if="currentStep === 0">
        <div class="gift-box"></div>
        <p class="gift-title">你的AI宠物伙伴已到家，请唤醒它吧！</p>
        <p class="narration">
          今天，你收到了一份特别的礼物。它不是普通玩具，而是一只AI宠物机器人——小派。
        </p>
        <div class="action-row">
          <el-button type="primary" size="large" round @click="goStep(1)">[打开盒子]</el-button>
        </div>
      </template>

      <template v-else-if="currentStep === 1">
        <div class="robot-wrap">
          <PaiRobot mode="initial" />
        </div>
        <p class="narration">
          哇！小派看起来真可爱！它会亮灯，会摇耳朵，看起来好像已经准备好和你做朋友了。
        </p>
        <div class="choices">
          <el-button round @click="goStep(2)">[你好，小派！]</el-button>
          <el-button round @click="goStep(2)">[我们一起玩吧！]</el-button>
          <el-button round @click="goStep(2)">[你能听懂我说话吗？]</el-button>
        </div>
      </template>

      <template v-else>
        <p class="narration">试着和小派对话后，你发现它好像还没有真正理解你的指令。</p>

        <DialogueBox
          :speaker-name="currentDialogue.speakerName"
          :avatar-text="currentDialogue.avatarText"
          :content="currentDialogue.content"
          @next="nextDialogue"
        />

        <div v-if="isDialogueFinished" class="action-row">
          <el-button type="primary" size="large" round @click="goLevel1">
            [看看什么才算“会听话”]
          </el-button>
        </div>
      </template>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'
import DialogueBox from '../../components/DialogueBox.vue'

type StoryStep = 0 | 1 | 2

const router = useRouter()
const currentStep = ref<StoryStep>(0)
const dialogueIndex = ref(0)

const dialogues = [
  {
    speakerName: '玩家',
    avatarText: '玩',
    content: '咦？它怎么没有按我说的做呀？',
  },
  {
    speakerName: '小芽',
    avatarText: '芽',
    content:
      '它现在更像是感应到了周围有动静，但还没有真正学会“听懂你说的话”。真正会听话的AI朋友，要能听到你的声音，还要知道你在说什么。',
  },
]

const currentDialogue = computed(() => {
  return dialogues[Math.min(dialogueIndex.value, dialogues.length - 1)]
})

const isDialogueFinished = computed(() => dialogueIndex.value >= dialogues.length - 1)

function goStep(step: StoryStep) {
  currentStep.value = step
}

function nextDialogue() {
  if (dialogueIndex.value < dialogues.length - 1) {
    dialogueIndex.value += 1
  }
}

function goLevel1() {
  router.push('/chapter1/level1')
}
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  padding: 24px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.story-card {
  width: min(980px, 100%);
  min-height: 560px;
  border-radius: 18px;
  position: relative;
}

.gift-box {
  width: 180px;
  height: 180px;
  margin: 10px auto 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border: 4px solid #ef4444;
  position: relative;
}

.gift-box::before,
.gift-box::after {
  content: '';
  position: absolute;
  background: #dc2626;
}

.gift-box::before {
  width: 26px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.gift-box::after {
  width: 100%;
  height: 26px;
  top: 50%;
  transform: translateY(-50%);
}

.gift-title {
  margin: 0 0 12px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1f2d3d;
}

.narration {
  margin: 0;
  text-align: center;
  color: #303133;
  font-size: 16px;
  line-height: 1.9;
}

.robot-wrap {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.choices {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
