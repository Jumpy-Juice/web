<template>
  <main class="sandbox-view">
    <el-button class="back-btn" round @click="goHome">返回首页</el-button>


    <div class="robot-wrap">
      <PaiRobot ref="paiRef" mode="interactive" />
    </div>

    <div class="console">
      <el-button class="console-btn" type="primary" size="large" round @click="doWave">[你好]</el-button>
      <el-button class="console-btn" type="primary" size="large" round @click="doRotate">[转圈]</el-button>
      <el-button class="console-btn" type="primary" size="large" round @click="doDance">[跳个舞]</el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PaiRobot from '../components/PaiRobot.vue'

const router = useRouter()
const paiRef = ref<InstanceType<typeof PaiRobot> | null>(null)

function playVoiceLine(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 1.02
  u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function doWave() {
  paiRef.value?.playAction('wave')
  playVoiceLine('你好，小训练师！谢谢你教会我听懂这个世界！')
}

function doRotate() {
  paiRef.value?.playAction('rotate')
  playVoiceLine('好的，转一圈！')
}

function doDance() {
  paiRef.value?.playAction('rotate')
  window.setTimeout(() => {
    paiRef.value?.playAction('jump')
  }, 520)
  playVoiceLine('跳个舞给你看！')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.sandbox-view {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% -10%, rgba(237, 186, 142, 0.82), transparent 84%),
    radial-gradient(circle at 84% 0%, rgba(152, 175, 255, 0.12), transparent 40%),
    var(--lv-bg);
  position: relative;
  overflow: hidden;
  padding-bottom: 110px;
  isolation: isolate;
}

.sandbox-view::before,
.sandbox-view::after {
  content: ''; 
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
}

.sandbox-view::before {
  width: 360px;
  height: 360px;
  left: -120px;
  top: -110px;
  background:
    radial-gradient(circle at 28% 28%, rgb(255 255 255 / 70%) 0%, transparent 45%),
    radial-gradient(circle, rgb(255 198 125 / 48%) 0%, rgb(255 198 125 / 0%) 72%);
}

.sandbox-view::after {
  width: 300px;
  height: 300px;
  right: -90px;
  bottom: -120px;
  background:
    radial-gradient(circle at 38% 34%, rgb(255 255 255 / 70%) 0%, transparent 42%),
    radial-gradient(circle, rgb(139 200 255 / 42%) 0%, rgb(139 200 255 / 0%) 72%);
}

.robot-wrap {
  position: relative;
  z-index: 1; 
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  transform: scale(1.5);
  transform-origin: center center;
}

@media (max-width: 768px) {
  .robot-wrap {
    transform: scale(1.2);
  }
}

.back-btn {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1300;
}

.console {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(920px, calc(100% - 24px));
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 12px;
  border-radius: 18px;
  border: 1px solid rgb(59 130 246 / 18%);
  background: linear-gradient(135deg, rgb(255 255 255 / 85%) 0%, rgb(239 246 255 / 85%) 100%);
  box-shadow: 0 16px 46px rgb(0 0 0 / 14%);
  backdrop-filter: blur(10px);
}

.console-btn {
  min-width: 160px;
  font-weight: 900;
}

.sticker {
  position: absolute;
  width: 150px;       
  height: 150px;      
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none; 
  z-index: 5;          
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.12)); 
}

.sticker-blurred {
  -webkit-mask-image: radial-gradient(circle, #000 50%, transparent 95%);
  mask-image: radial-gradient(circle, #000 50%, transparent 95%);
  filter: blur(0.4px) drop-shadow(0 4px 12px rgba(0,0,0,0.05));
}



@media (max-width: 768px) {
  .sticker {
    width: 100px;
    height: 100px;
  }
}

</style>
