<template>
  <main class="level3-view" :class="{ 'dialogue-open': !showNextButton }">
    <el-card class="level-card" shadow="hover">
      <div class="head-meta">
        <span>Chapter 1 · Level 3</span>
        <span>Behavior Verification</span>
      </div>
      <h1>第二关：试试看，什么才叫“会听话”</h1>

      <p class="intro">
        <strong>小芽：</strong>
        你已经知道，不是所有会动的东西都会“听话”。那真正会听话的 AI 朋友，到底是什么样呢？先来试试对阿啵下指令吧。
      </p>

      <div class="stage-layout">
        <section class="panel">
          <h2>阿啵（已训练）</h2>
          <div class="abo-robot-stage">
            <AboRobot :action="aboActionClass" />
          </div>
          <div class="abo-status-card">
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

    
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DialogueBox from '../../components/DialogueBox.vue'
import PaiRobot from '../../components/PaiRobot.vue'
import AboRobot from '../../components/AboRobot.vue'
import { useGameStore } from '../../stores/gameStore'
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
const rewarded = ref(false)
const showNextButton = ref(false)

const aboClickedSet = ref<Set<Command>>(new Set())
const paiClickedSet = ref<Set<Command>>(new Set())
const dialogueIndex = ref(0)

const aboActionText = ref('等待指令')
const aboActionClass = ref<'' | 'wave' | 'spin' | 'dance'>('')

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
    aboActionClass.value = 'wave'
  } else if (command === 'spin') {
    aboActionText.value = '听到【转圈】→ 旋转'
    aboActionClass.value = 'spin'
  } else {
    aboActionText.value = '听到【跳个舞】→ 先旋转，再跳跃'
    aboActionClass.value = 'dance'
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

// 找到 nextDialogue 函数并修改如下：
function nextDialogue() {
  const list = dialogues.value
  if (dialogueIndex.value < list.length - 1) {
    dialogueIndex.value += 1
    return
  }

  // 原逻辑：if (stage.value === 'settlement') { showVideoModal.value = true }
  // 修改后：如果对话结束且处于结算阶段，直接触发完成逻辑
  if (stage.value === 'settlement') {
    void handleLevelCompleteDirectly()
  }
}

// 添加一个新的直接完成函数
async function handleLevelCompleteDirectly() {
  if (!rewarded.value) {
    rewarded.value = true
    await playEnergyStarFly() // 播放能量星飞入动画
    gameStore.addStar()       // 增加能量星
    showNextButton.value = true // 显示“进入下一页”按钮
    stage.value = 'done'
    ElMessage.success('恭喜你完成第二关！获得：小派能量星 ×1')
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
  background:
    radial-gradient(circle at 10% 2%, rgb(230 181 134 / 18%) 0%, transparent 36%),
    radial-gradient(circle at 85% 3%, rgb(148 168 233 / 16%) 0%, transparent 34%),
    linear-gradient(180deg, #f7f4ed 0%, #f3efe5 100%);
}
.level3-view.dialogue-open { padding-bottom: 220px; }
.level-card { width: min(1100px, 100%); margin: 0 auto; border-radius: 20px; padding: 10px 8px 72px; }
.head-meta { display: flex; justify-content: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.head-meta span { border-radius: 9999px; border: 1px solid rgb(28 28 28 / 30%); padding: 4px 10px; font-size: 12px; color: rgb(28 28 28 / 78%); background: rgb(28 28 28 / 5%); }
h1 { margin: 0 0 12px; text-align: center; color: #1c1c1c; font-size: clamp(28px, 4vw, 44px); letter-spacing: -0.8px; }
.intro { margin: 0 0 10px; color: #5f5f5d; line-height: 1.8; }
.stage-layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.panel { border: 1px solid #eceae4; border-radius: 14px; padding: 12px; background: rgb(252 251 248 / 70%); }
h2 { margin: 0 0 10px; font-size: 18px; color: #1c1c1c; font-weight: 600; }
.abo-robot-stage { min-height: 230px; border-radius: 14px; border: 2px dashed rgb(28 28 28 / 24%); display: grid; place-items: center; background: linear-gradient(180deg, rgb(252 251 248 / 92%) 0%, rgb(246 242 234 / 92%) 100%); }
.abo-status-card { margin-top: 8px; border: 1px solid #eceae4; border-radius: 10px; padding: 8px 10px; background: rgb(252 251 248 / 82%); }
.abo-label { font-weight: 700; }
.abo-action { margin-top: 6px; font-size: 14px; }
.pai-wrap { display: flex; justify-content: center; }
.pai-hint { margin: 4px 0 0; text-align: center; color: #6e6a64; font-size: 13px; }
.cmd-row { margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.knowledge { margin-top: 12px; border-top: 1px dashed rgb(28 28 28 / 28%); padding-top: 12px; color: #5f5f5d; line-height: 1.8; }
.knowledge ul { margin: 0 0 8px; padding-left: 20px; }
.action-row { margin-top: 18px; display: flex; justify-content: center; }
@media (max-width: 900px) { .stage-layout { grid-template-columns: 1fr; } }
</style>
