<template>
  <main class="intro-view">
    <el-card class="intro-card" shadow="hover">
      <h1>今天的任务</h1>

      <p class="lead">你将和小派一起完成三轮训练：</p>
      <ol>
        <li>找到生活中的“会听话”的AI朋友</li>
        <li>弄明白 AI是怎么听见声音的</li>
        <li>亲手训练小派学会“你好”“转圈”“跳个舞”</li>
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
  background: linear-gradient(180deg, #f7fbff 0%, #eef8f3 100%);
}

.intro-card {
  width: min(900px, 100%);
  border-radius: 18px;
}

h1 {
  margin: 0 0 18px;
  font-size: 32px;
  text-align: center;
  color: #1f2d3d;
}

.lead {
  margin: 0 0 8px;
  font-weight: 600;
}

ol {
  margin: 0 0 16px 22px;
  padding: 0;
  line-height: 1.9;
  color: #303133;
}

p {
  margin: 0 0 14px;
  line-height: 1.9;
  color: #303133;
}

.rule {
  margin-bottom: 8px;
  color: #8b5a00;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}
</style>
