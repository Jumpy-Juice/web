<template>
  <div class="pai-wrap" :class="[modeClass, activeEffectClass, activeActionClass]">
    <div class="pai-robot" aria-label="小派机器人">
      <div class="antenna"></div>

      <div class="head">
        <div class="eyes">
          <span class="eye left-eye"></span>
          <span class="eye right-eye"></span>
        </div>
        <div class="mouth"></div>
      </div>

      <div class="body">
        <div class="core-light"></div>
      </div>

      <div v-if="mode === 'friendly' || mode === 'interactive'" class="scarf" aria-label="围巾"></div>
      <div
        v-if="mode === 'listening' || mode === 'interactive'"
        class="headphone"
        aria-label="耳机"
      >
        <span class="earcup left"></span>
        <span class="earcup right"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type PaiMode = 'initial' | 'friendly' | 'listening' | 'interactive'
type PaiAction = 'wave' | 'rotate' | 'jump'

interface Props {
  mode?: PaiMode
  effectClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'initial',
  effectClass: '',
})

const internalEffectClass = ref('')
const internalActionClass = ref('')
let actionTimer: number | undefined

const modeClass = computed(() => `mode-${props.mode}`)
const activeEffectClass = computed(() => props.effectClass || internalEffectClass.value)
const activeActionClass = computed(() => internalActionClass.value)

function setEffectClass(className = '') {
  internalEffectClass.value = className
}

function playAction(action: PaiAction) {
  if (actionTimer !== undefined) {
    window.clearTimeout(actionTimer)
  }

  internalActionClass.value = `action-${action}`
  actionTimer = window.setTimeout(() => {
    internalActionClass.value = ''
  }, 1000)
}

defineExpose({
  setEffectClass,
  playAction,
})
</script>

<style scoped>
.pai-wrap {
  width: 260px;
  height: 300px;
  display: grid;
  place-items: center;
}

.pai-robot {
  position: relative;
  width: 170px;
  height: 220px;
  transform-origin: center bottom;
  animation: float 2.8s ease-in-out infinite, tilt 4.2s ease-in-out infinite;
}

.head {
  position: absolute;
  top: 18px;
  left: 50%;
  width: 128px;
  height: 94px;
  transform: translateX(-50%);
  border-radius: 26px;
  background: var(--head-color);
  border: 3px solid var(--stroke-color);
  box-shadow: 0 6px 16px rgb(0 0 0 / 10%);
}

.eyes {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.eye {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #111827;
  transform-origin: center center;
  animation: blink 5s infinite;
}

.right-eye {
  animation-delay: 0.1s;
}

.mouth {
  width: 30px;
  height: 6px;
  border-radius: 999px;
  background: #334155;
  margin: 12px auto 0;
}

.body {
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 140px;
  height: 120px;
  transform: translateX(-50%);
  border-radius: 30px;
  background: var(--body-color);
  border: 3px solid var(--stroke-color);
  animation: breathe 2.8s ease-in-out infinite;
}

.core-light {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: var(--core-color);
  box-shadow: 0 0 0 0 rgb(59 130 246 / 50%);
  animation: pulse 1.8s ease-in-out infinite;
}

.antenna {
  position: absolute;
  top: -2px;
  left: 50%;
  width: 6px;
  height: 20px;
  transform: translateX(-50%);
  background: var(--stroke-color);
  border-radius: 8px;
}

.antenna::after {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  width: 14px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: var(--core-color);
}

.scarf {
  position: absolute;
  left: 50%;
  top: 104px;
  width: 132px;
  height: 20px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #ef4444;
  box-shadow: inset 0 -2px 0 rgb(0 0 0 / 15%);
}

.headphone {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 156px;
  height: 88px;
  transform: translateX(-50%);
}

.headphone::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 110px;
  height: 60px;
  transform: translateX(-50%);
  border: 6px solid #334155;
  border-bottom: 0;
  border-radius: 70px 70px 0 0;
}

.earcup {
  position: absolute;
  top: 26px;
  width: 20px;
  height: 34px;
  border-radius: 10px;
  background: #475569;
}

.earcup.left {
  left: 9px;
}

.earcup.right {
  right: 9px;
}

.mode-initial {
  --head-color: #dbeafe;
  --body-color: #bfdbfe;
  --stroke-color: #2563eb;
  --core-color: #60a5fa;
}

.mode-friendly {
  --head-color: #dcfce7;
  --body-color: #bbf7d0;
  --stroke-color: #16a34a;
  --core-color: #34d399;
}

.mode-listening {
  --head-color: #ede9fe;
  --body-color: #ddd6fe;
  --stroke-color: #7c3aed;
  --core-color: #a78bfa;
}

.mode-interactive {
  --head-color: #fef3c7;
  --body-color: #fde68a;
  --stroke-color: #d97706;
  --core-color: #f59e0b;
}

/* 预留特效类示例：亮灯故障提示 */
.alert-fault .core-light {
  background: #ef4444;
  animation: fault-flash 0.45s linear infinite;
}

/* 动作：挥手（通过轻微摆头+天线摆动模拟） */
.action-wave .head {
  animation: action-wave-head 0.45s ease-in-out infinite;
}

.action-wave .antenna {
  animation: action-wave-antenna 0.45s ease-in-out infinite;
}

/* 动作：旋转（整机旋转一圈） */
.action-rotate .pai-robot {
  animation: float 2.8s ease-in-out infinite, tilt 4.2s ease-in-out infinite, action-rotate 0.9s linear;
}

/* 动作：跳跃（整机上下弹跳） */
.action-jump .pai-robot {
  animation: float 2.8s ease-in-out infinite, tilt 4.2s ease-in-out infinite, action-jump 0.6s ease-in-out;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes tilt {
  0%,
  100% {
    rotate: -2deg;
  }
  50% {
    rotate: 2deg;
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: translateX(-50%) scaleY(1);
  }
  50% {
    transform: translateX(-50%) scaleY(1.03);
  }
}

@keyframes blink {
  0%,
  45%,
  48%,
  100% {
    transform: scaleY(1);
  }
  46%,
  47% {
    transform: scaleY(0.08);
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(59 130 246 / 42%);
    opacity: 0.95;
  }
  60% {
    box-shadow: 0 0 0 10px rgb(59 130 246 / 0%);
    opacity: 1;
  }
}

@keyframes fault-flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes action-rotate {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

@keyframes action-jump {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-16px);
  }
  60% {
    transform: translateY(-16px);
  }
}

@keyframes action-wave-head {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  50% {
    transform: translateX(-50%) rotate(6deg);
  }
}

@keyframes action-wave-antenna {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  50% {
    transform: translateX(-50%) rotate(-10deg);
  }
}
</style>
