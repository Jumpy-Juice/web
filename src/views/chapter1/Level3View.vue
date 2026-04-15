<template>
  <main class="level3-view" :class="{ 'dialogue-open': !showNextButton }">
    <el-card class="level-card" shadow="hover">
      <h1>第二关：试试看，什么才叫“会听话”</h1>

      <p class="intro">
        <strong>小芽：</strong>
        你已经知道，不是所有会动的东西都会“听话”。那真正会听话的 AI 朋友，到底是什么样呢？先来试试对阿啵下指令吧。
      </p>

      <div class="stage-layout">
        <section class="panel">
          <h2>阿啵（已训练）</h2>
          <div class="abo-placeholder" :class="aboActionClass">
            <div class="abo-label">阿啵状态</div>
            <div class="abo-action">{{ aboActionText }}</div>
          </div>
        </section>

        <section class="panel">
          <h2>小派（待训练）</h2>
          <div class="pai-wrap">
            <PaiRobot ref="paiRef" mode="initial" />
          </div>
          <p class="pai-hint">当前只会闪灯、歪头，不会执行具体动作。</p>
        </section>
      </div>

      <div class="cmd-row" v-if="stage === 'abo'">
        <el-button round @click="handleAboCommand('hello')">[你好]</el-button>
        <el-button round @click="handleAboCommand('spin')">[转圈]</el-button>
        <el-button round @click="handleAboCommand('dance')">[跳个舞]</el-button>
      </div>

      <div class="cmd-row" v-if="stage === 'pai'">
        <el-button round @click="handlePaiCommand('hello')">[你好]</el-button>
        <el-button round @click="handlePaiCommand('spin')">[转圈]</el-button>
        <el-button round @click="handlePaiCommand('dance')">[跳个舞]</el-button>
      </div>

      <section class="knowledge">
        <p>要让 AI 宠物学会“听话”，通常要经过三步：</p>
        <ul>
          <li>第一，听到很多声音；</li>
          <li>第二，知道这些话分别叫什么；</li>
          <li>第三，反复练习，记住“这句话—这个动作”的关系。</li>
        </ul>
        <p>阿啵已经学过，所以能做到；小派还没开始学，所以现在只会亮灯、歪头，却不会按要求行动。</p>
      </section>

      <div v-if="showNextButton" class="action-row">
        <el-button type="primary" size="large" round @click="goEnd">[明白了！我要开始训练小派了]</el-button>
      </div>
    </el-card>

    <DialogueBox
      v-if="!showNextButton"
      :speaker-name="currentDialogue.speaker"
      :avatar-text="currentDialogue.avatar"
      :content="currentDialogue.text"
      @next="nextDialogue"
    />

    <VideoPlayerModal
      v-model="showVideoModal"
      video-src="/videos/logic.mp4"
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
const paiClickedSet = ref<Set<Command>>(new Set())
const dialogueIndex = ref(0)

const aboActionText = ref('等待指令')
const aboActionClass = ref('')

const dialogues = computed<DialogueItem[]>(() => {
  if (stage.value === 'abo') {
    return [
      {
        speaker: '小芽',
        avatar: '芽',
        text: '你已经知道，不是所有会动的东西都会“听话”。先来试试对阿啵下指令吧。',
      },
    ]
  }

  if (stage.value === 'pai') {
    return [
      {
        speaker: '小芽',
        avatar: '芽',
        text: '看到了吗？阿啵不只是“听见”了声音，还知道每句话对应什么动作。现在，你再用同样的话试试小派。',
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
      text: '对，这就是关键。阿啵会“听话”，不是因为它天生更聪明，而是因为它已经训练过了；小派现在只会感应声音，还没有学会“这句话应该对应哪个动作”。',
    },
    {
      speaker: '小芽',
      avatar: '芽',
      text: '所以，AI不是一打开就什么都会。它更像一个刚入门的新同学，需要有人教、有人带、有人陪它练习。',
    },
    {
      speaker: '小芽',
      avatar: '芽',
      text: '而你，就是小派的小训练师。',
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
    aboActionText.value = '听到【你好】→ 挥手'
    aboActionClass.value = 'action-wave'
  } else if (command === 'spin') {
    aboActionText.value = '听到【转圈】→ 旋转'
    aboActionClass.value = 'action-spin'
  } else {
    aboActionText.value = '听到【跳个舞】→ 先旋转，再跳跃'
    aboActionClass.value = 'action-dance'
  }

  if (aboClickedSet.value.size === 3) {
    stage.value = 'pai'
    dialogueIndex.value = 0
    ElMessage.success('阿啵演示完成！')
  }
}

function handlePaiCommand(command: Command) {
  paiClickedSet.value.add(command)
  paiRef.value?.setEffectClass('alert-fault')
  ElMessage.warning(`小派收到【${command === 'hello' ? '你好' : command === 'spin' ? '转圈' : '跳个舞'}】后只会闪灯、歪头。`)

  window.setTimeout(() => {
    paiRef.value?.setEffectClass('')
  }, 520)

  if (paiClickedSet.value.size === 3) {
    stage.value = 'settlement'
    dialogueIndex.value = 0
  }
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
    ElMessage.success('恭喜你完成第二关！获得：小派能量星 ×1')
  }
}

function goEnd() {
  router.push('/chapter1/end')
}
</script>

<style scoped>
.level3-view { min-height: 100vh; padding: 24px; background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%); }
.level3-view.dialogue-open { padding-bottom: 220px; }
.level-card { width: min(1100px, 100%); margin: 0 auto; border-radius: 16px; padding-bottom: 72px; }
h1 { margin: 0 0 12px; text-align: center; color: #1f2d3d; }
.intro { margin: 0 0 10px; color: #334155; line-height: 1.8; }
.stage-layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.panel { border: 1px solid #dbeafe; border-radius: 12px; padding: 12px; background: #fff; }
h2 { margin: 0 0 10px; font-size: 18px; }
.abo-placeholder { min-height: 180px; border-radius: 12px; border: 2px dashed #94a3b8; display: grid; place-items: center; text-align: center; color: #334155; background: rgb(191 219 254 / 35%); }
.abo-label { font-weight: 700; }
.abo-action { margin-top: 6px; font-size: 14px; }
.action-wave { animation: wave 1.1s ease-in-out infinite; }
.action-spin { animation: spin 0.9s linear infinite; }
.action-dance { animation: dance 1s ease-in-out infinite; }
.pai-wrap { display: flex; justify-content: center; }
.pai-hint { margin: 4px 0 0; text-align: center; color: #64748b; font-size: 13px; }
.cmd-row { margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.knowledge { margin-top: 12px; border-top: 1px dashed #cbd5e1; padding-top: 12px; color: #334155; line-height: 1.8; }
.knowledge ul { margin: 0 0 8px; padding-left: 20px; }
.action-row { margin-top: 18px; display: flex; justify-content: center; }
@keyframes wave { 0%,100% { transform: rotate(0deg);} 50% { transform: rotate(6deg);} }
@keyframes spin { from { transform: rotate(0);} to { transform: rotate(360deg);} }
@keyframes dance { 0%,100% { transform: translateY(0) rotate(0deg);} 25% { transform: translateY(-8px) rotate(-8deg);} 75% { transform: translateY(-8px) rotate(8deg);} }
@media (max-width: 900px) { .stage-layout { grid-template-columns: 1fr; } }
</style>
