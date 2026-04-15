<template>
  <div class="abo-wrap" :class="actionClass">
    <div class="abo-robot" aria-label="阿啵机器人">
      <div class="halo-ring"></div>
      <div class="signal-bars">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="head">
        <div class="sensor sensor-left"></div>
        <div class="sensor sensor-right"></div>
        <div class="screen">
          <div class="scan-line"></div>
          <div class="eyes">
            <span class="eye eye-left"></span>
            <span class="eye eye-right"></span>
          </div>
          <div class="mouth"></div>
        </div>
      </div>

      <div class="shoulder shoulder-left"></div>
      <div class="shoulder shoulder-right"></div>

      <div class="arm arm-left">
        <span class="joint"></span>
        <span class="forearm"></span>
        <span class="claw"></span>
      </div>
      <div class="arm arm-right">
        <span class="joint"></span>
        <span class="forearm"></span>
        <span class="claw"></span>
      </div>

      <div class="torso">
        <div class="chest-panel">
          <span class="chest-light l1"></span>
          <span class="chest-light l2"></span>
          <span class="chest-light l3"></span>
        </div>
        <div class="core"></div>
      </div>

      <div class="hip"></div>

      <div class="leg leg-left">
        <span class="thigh"></span>
        <span class="foot"></span>
      </div>
      <div class="leg leg-right">
        <span class="thigh"></span>
        <span class="foot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AboAction = '' | 'wave' | 'spin' | 'dance'

interface Props {
  action?: AboAction
}

const props = withDefaults(defineProps<Props>(), {
  action: '',
})

const actionClass = computed(() => (props.action ? `action-${props.action}` : ''))
</script>

<style scoped>
.abo-wrap {
  width: 300px;
  height: 260px;
  display: grid;
  place-items: center;
}

.abo-robot {
  position: relative;
  width: 210px;
  height: 230px;
  transform-origin: center bottom;
  animation: abo-float 3s ease-in-out infinite;
}

.halo-ring {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 120px;
  height: 20px;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 2px solid rgb(94 234 212 / 72%);
  box-shadow: 0 0 22px rgb(45 212 191 / 45%);
}

.signal-bars {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.signal-bars span {
  width: 5px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ccfbf1 0%, #14b8a6 100%);
  animation: signal 1.2s ease-in-out infinite;
}

.signal-bars span:nth-child(1) {
  height: 12px;
}

.signal-bars span:nth-child(2) {
  height: 18px;
  animation-delay: 0.2s;
}

.signal-bars span:nth-child(3) {
  height: 14px;
  animation-delay: 0.4s;
}

.head {
  position: absolute;
  top: 14px;
  left: 50%;
  width: 152px;
  height: 98px;
  transform: translateX(-50%);
  border-radius: 24px;
  border: 3px solid #1f2937;
  background: linear-gradient(180deg, #d7f7ff 0%, #bde9f5 100%);
  box-shadow:
    0 10px 18px rgb(15 23 42 / 18%),
    inset 0 0 0 2px rgb(255 255 255 / 48%);
}

.sensor {
  position: absolute;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #0f172a;
}

.sensor-left {
  left: 10px;
}

.sensor-right {
  right: 10px;
}

.screen {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 112px;
  height: 64px;
  transform: translateX(-50%);
  border-radius: 14px;
  border: 2px solid #0f172a;
  background: linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%);
  overflow: hidden;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  background: rgb(147 197 253 / 58%);
  animation: scan 1.6s linear infinite;
}

.eyes {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 22px;
}

.eye {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #e0f2fe;
  box-shadow: 0 0 14px rgb(125 211 252 / 68%);
  animation: blink 5.2s infinite;
}

.eye-right {
  animation-delay: 0.1s;
}

.mouth {
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 34px;
  height: 6px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgb(186 230 253 / 88%);
}

.shoulder {
  position: absolute;
  top: 106px;
  width: 32px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #c7d2fe 0%, #a5b4fc 100%);
}

.shoulder-left {
  left: 26px;
}

.shoulder-right {
  right: 26px;
}

.arm {
  position: absolute;
  top: 116px;
  width: 40px;
  height: 78px;
}

.arm-left {
  left: 14px;
  transform-origin: top center;
}

.arm-right {
  right: 14px;
  transform-origin: top center;
}

.joint {
  position: absolute;
  left: 50%;
  top: 0;
  width: 16px;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 2px solid #1f2937;
  background: #e2e8f0;
}

.forearm {
  position: absolute;
  left: 50%;
  top: 12px;
  width: 14px;
  height: 46px;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%);
}

.claw {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 22px;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 10px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
}

.torso {
  position: absolute;
  left: 50%;
  top: 96px;
  width: 130px;
  height: 98px;
  transform: translateX(-50%);
  border-radius: 26px;
  border: 3px solid #1f2937;
  background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 45%);
}

.chest-panel {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 92px;
  height: 26px;
  transform: translateX(-50%);
  border-radius: 10px;
  border: 2px solid #0f172a;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.chest-light {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  animation: chest-pulse 1.3s ease-in-out infinite;
}

.l1 {
  background: #34d399;
}

.l2 {
  background: #facc15;
  animation-delay: 0.2s;
}

.l3 {
  background: #38bdf8;
  animation-delay: 0.4s;
}

.core {
  position: absolute;
  left: 50%;
  bottom: 16px;
  width: 26px;
  height: 26px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, #fff 0%, #67e8f9 45%, #06b6d4 100%);
  box-shadow: 0 0 18px rgb(6 182 212 / 65%);
  animation: core-beat 1.5s ease-in-out infinite;
}

.hip {
  position: absolute;
  left: 50%;
  bottom: 36px;
  width: 98px;
  height: 20px;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
}

.leg {
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 56px;
}

.leg-left {
  left: 62px;
}

.leg-right {
  right: 62px;
}

.thigh {
  position: absolute;
  left: 50%;
  top: 0;
  width: 18px;
  height: 34px;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #bfdbfe 0%, #93c5fd 100%);
}

.foot {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 30px;
  height: 18px;
  transform: translateX(-50%);
  border-radius: 10px;
  border: 2px solid #1f2937;
  background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
}

.action-wave .arm-right {
  animation: arm-wave 0.52s ease-in-out infinite;
}

.action-spin .abo-robot {
  animation: abo-float 3s ease-in-out infinite, spin 0.95s linear infinite;
}

.action-dance .abo-robot {
  animation: abo-float 3s ease-in-out infinite, dance 0.72s ease-in-out infinite;
}

@keyframes abo-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes signal {
  0%,
  100% {
    opacity: 0.45;
    transform: scaleY(0.72);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: calc(100% - 10px);
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

@keyframes chest-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

@keyframes core-beat {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.08);
  }
}

@keyframes arm-wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(28deg);
  }
}

@keyframes spin {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

@keyframes dance {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(-8deg);
  }
  75% {
    transform: translateY(-8px) rotate(8deg);
  }
}
</style>
