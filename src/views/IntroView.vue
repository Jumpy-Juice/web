<template>
  <main class="intro-view">
    <div class="noise-layer"></div>
    <el-card class="intro-card" shadow="hover">
      <div class="scene-icons" aria-hidden="true">
        <span class="scene-icon">🧒</span>
        <span class="scene-icon">🤖</span>
        <span class="scene-icon">🗺️</span>
      </div>
      <div class="top-row">
        <span class="chapter-chip">Chapter Boot</span>
        <span class="chapter-chip light">10 Stars Journey</span>
      </div>

      <h1>今天的任务</h1>

      <p class="lead">你将和小派一起完成三轮训练：</p>
      <ol class="mission-list">
        <li>
          <span class="index">🔍</span>
          <span>找到生活中的“会听话”的 AI 朋友</span>
        </li>
        <li>
          <span class="index">🎙️</span>
          <span>弄明白 AI 是怎么听见声音的</span>
        </li>
        <li>
          <span class="index">🧪</span>
          <span>亲手训练小派学会“你好”“转圈”“跳个舞”</span>
        </li>
      </ol>

      <p>
        你的同龄朋友小芽也来到了训练站，她还带着自己的机器宠物——阿啵。在接下来的任务里，她会陪你一起帮助小派成长。
      </p>

      <p class="rule">
        <strong>
          本游戏共有10个关卡。每完成1个关卡，你就能获得1颗小派能量星。集满10颗能量星，就能见证小派完成全部成长！
        </strong>
      </p>

      <div class="action-row">
        <el-button type="primary" size="large" round @click="goChapter1">[领取小派]</el-button>
      </div>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goChapter1() {
  router.push('/chapter1/story')
}
</script>

<style scoped>
.intro-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 20% -10%, rgb(230 177 122 / 20%) 0%, transparent 40%),
    radial-gradient(circle at 86% 2%, rgb(145 165 228 / 18%) 0%, transparent 38%),
    linear-gradient(180deg, #f7f4ed 0%, #f3efe5 100%);
  position: relative;
}

.noise-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgb(255 255 255 / 7%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 6%) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle at center, #000 35%, transparent 100%);
  opacity: 0.45;
}

.intro-card {
  width: min(900px, 100%);
  border-radius: 20px;
  padding: 12px 10px;
  position: relative;
}

.scene-icons {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;
}

.scene-icon {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  font-size: 30px;
  border: 1px solid rgb(206 156 68 / 42%);
  background: radial-gradient(circle at 32% 24%, #fffdf8 0%, #ffe0a5 72%);
  box-shadow:
    0 0 18px rgb(255 193 92 / 34%),
    inset 0 0 0 2px rgb(255 255 255 / 46%);
}

.top-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.chapter-chip {
  border-radius: 9999px;
  border: 1px solid rgb(28 28 28 / 32%);
  padding: 5px 12px;
  font-size: 12px;
  color: #1c1c1c;
  background: rgb(28 28 28 / 5%);
}

.chapter-chip.light {
  background: rgb(252 251 248 / 78%);
}

h1 {
  margin: 0 0 14px;
  font-size: clamp(30px, 4.5vw, 46px);
  text-align: center;
  color: #1c1c1c;
  letter-spacing: -0.9px;
}

.lead {
  margin: 0 0 10px;
  font-weight: 400;
  color: rgb(28 28 28 / 83%);
  font-size: 18px;
}

.mission-list {
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.mission-list li {
  border: 1px solid #eceae4;
  background: rgb(252 251 248 / 72%);
  border-radius: 14px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 8px;
  align-items: start;
}

.mission-list li:first-child {
  border-color: rgb(245 158 11 / 44%);
  background:
    linear-gradient(120deg, rgb(255 247 225 / 90%) 0%, rgb(252 251 248 / 76%) 55%),
    radial-gradient(circle at 88% 20%, rgb(255 224 150 / 32%) 0%, transparent 42%);
  box-shadow: 0 8px 18px rgb(227 166 59 / 16%);
}

.index {
  border: 1px solid rgb(28 28 28 / 28%);
  border-radius: 9999px;
  font-size: 17px;
  color: rgb(28 28 28 / 70%);
  display: inline-grid;
  place-items: center;
  min-height: 32px;
  background: linear-gradient(180deg, #fff7e2 0%, #ffe9bf 100%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 58%);
}

p {
  margin: 0 0 14px;
  line-height: 1.9;
  color: #5f5f5d;
}

.rule {
  margin-bottom: 8px;
  color: #1c1c1c;
  background: linear-gradient(90deg, rgb(28 28 28 / 6%) 0%, rgb(28 28 28 / 0%) 100%);
  border-radius: 10px;
  padding: 10px 12px;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .scene-icon {
    width: 52px;
    height: 52px;
    font-size: 25px;
  }

  .mission-list li {
    grid-template-columns: 36px 1fr;
    padding: 10px;
  }
}
</style>
