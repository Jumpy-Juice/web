<template>
  <main class="story-view">
    <el-card class="story-card" shadow="hover">
      <template v-if="currentStep === 1">
        <h1>小派到家啦！</h1>
        <div class="gift-box"></div>
        <p class="gift-tip">桌子上放着一个包装盒，盒子上写着：“你的 AI 宠物伙伴已到家，请唤醒它吧！”</p>
        <p class="narration">
          今天，你收到了一份特别的礼物。它不是普通玩具，而是一只 AI 宠物机器人——小派。
        </p>
        <p class="quote">“我叫小派，是一只AI宠物机器人。刚出生的我，还听不懂人类的话，需要你陪我一起学习。”</p>
        <div class="action-row">
          <el-button type="primary" size="large" round @click="goStep(2)">[打开盒子]</el-button>
        </div>
      </template>

      <template v-else-if="currentStep === 2">
        <h1>小派为什么还不会“听话”？</h1>
        <div class="robot-wrap">
          <PaiRobot mode="initial" />
        </div>

        <p class="narration">小派并不是故意不理你。它现在虽然已经有了麦克风、喇叭和基础芯片，但还不会真正听懂人说的话。</p>

        <p class="narration"><strong>这不是因为它笨，而是因为——</strong>AI刚开始就像一张“白纸”，需要通过学习和训练，才能慢慢学会听懂你、回应你。</p>

        <section class="knowledge-grid">
          <div>
            <p class="sub-title">小派在工厂里出生时，已经有了：</p>
            <ul>
              <li>麦克风：能听见声音</li>
              <li>喇叭：能发出声音</li>
              <li>基础芯片：能运行程序</li>
            </ul>
          </div>
          <div>
            <p class="sub-title">但它现在还缺少三样更重要的东西：</p>
            <ul>
              <li>声音数据：还没听过足够多的话</li>
              <li>标签提示：还不知道这句话是什么意思</li>
              <li>训练过程：还没学会“听到什么，该做什么”</li>
            </ul>
          </div>
        </section>

        <div class="action-row">
          <el-button type="primary" size="large" round @click="goStep(3)">[继续]</el-button>
        </div>
      </template>

      <template v-else>
        <h1>你的任务开始啦！</h1>

        <p class="narration"><strong>小芽：</strong>所以，小派不是一开始就什么都会，它需要一位“小训练师”来教它慢慢成长。</p>
        <p class="narration">接下来，会有你的好朋友小芽陪你一起让小派完成下面任务：</p>

        <ul class="task-list">
          <li>让它听到更多声音</li>
          <li>帮它认识不同指令</li>
          <li>教它把“听到的话”和“要做的动作”对应起来</li>
        </ul>

        <p class="summary-line">
          AI不是天生会“听话”的，它需要数据、提示和训练。而你，就是帮助小派成长的那位小训练师。
        </p>

        <div class="action-row">
          <el-button type="primary" size="large" round @click="goLevel1">[开始认识小派]</el-button>
        </div>
      </template>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PaiRobot from '../../components/PaiRobot.vue'

type StoryStep = 1 | 2 | 3

const router = useRouter()
const currentStep = ref<StoryStep>(1)

function goStep(step: StoryStep) {
  currentStep.value = step
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
  min-height: 620px;
  border-radius: 18px;
}

h1 {
  margin: 0 0 14px;
  text-align: center;
  color: #1f2d3d;
}

.gift-box {
  width: 180px;
  height: 180px;
  margin: 10px auto 14px;
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

.gift-tip,
.narration,
.quote,
.summary-line {
  margin: 0 0 10px;
  color: #303133;
  line-height: 1.85;
}

.quote {
  color: #1e3a8a;
  font-weight: 600;
}

.robot-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 6px;
}

.sub-title {
  margin: 0 0 6px;
  color: #334155;
  font-weight: 700;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin: 6px 0;
  color: #0f766e;
}

.task-list {
  margin-bottom: 10px;
}

.action-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
}
</style>
