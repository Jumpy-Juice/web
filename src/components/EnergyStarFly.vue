<template>
  <teleport to="body">
    <div v-for="item in stars" :key="item.id" class="fly-layer">
      <div
        class="fly-star"
        :style="{
          left: item.startX + 'px',
          top: item.startY + 'px',
          '--dx': item.dx + 'px',
          '--dy': item.dy + 'px',
          '--cx': item.cx + 'px',
          '--cy': item.cy + 'px',
        }"
        @animationend="handleFlyEnd(item.id)"
      >
        ★
      </div>
    </div>

    <div v-if="hudFlash" class="hud-flash">★</div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FlyTask {
  id: number
  startX: number
  startY: number
  dx: number
  dy: number
  cx: number
  cy: number
  resolve: () => void
}

const stars = ref<FlyTask[]>([])
const hudFlash = ref(false)
let seq = 0

function triggerFly(startX?: number, startY?: number, endX?: number, endY?: number) {
  return new Promise<void>((resolve) => {
    const sx = startX ?? window.innerWidth * 0.5
    const sy = startY ?? window.innerHeight * 0.56
    const ex = endX ?? window.innerWidth - 86
    const ey = endY ?? 42

    const dx = ex - sx
    const dy = ey - sy

    const task: FlyTask = {
      id: ++seq,
      startX: sx,
      startY: sy,
      dx,
      dy,
      cx: dx * 0.45,
      cy: Math.min(dy - 140, -200),
      resolve,
    }

    stars.value.push(task)
  })
}

function handleFlyEnd(id: number) {
  const idx = stars.value.findIndex((s) => s.id === id)
  if (idx === -1) return
  const task = stars.value[idx]
  stars.value.splice(idx, 1)
  task.resolve()

  hudFlash.value = true
  window.setTimeout(() => {
    hudFlash.value = false
  }, 280)
}

function onGlobalTrigger(event: Event) {
  const e = event as CustomEvent<{ startX?: number; startY?: number; endX?: number; endY?: number; done?: () => void }>
  triggerFly(e.detail?.startX, e.detail?.startY, e.detail?.endX, e.detail?.endY).then(() => {
    e.detail?.done?.()
  })
}

if (typeof window !== 'undefined') {
  window.addEventListener('energy-star-fly', onGlobalTrigger as EventListener)
}

defineExpose({
  triggerFly,
})
</script>

<style scoped>
.fly-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3000;
}

.fly-star {
  position: fixed;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 900;
  color: #f59e0b;
  text-shadow: 0 0 10px rgb(245 158 11 / 60%);
  animation: star-fly 0.9s ease-in forwards;
}

.hud-flash {
  position: fixed;
  right: 62px;
  top: 28px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #f59e0b;
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 0 0 0 rgb(245 158 11 / 60%);
  animation: flash 0.28s ease;
  z-index: 3001;
  pointer-events: none;
}

@keyframes star-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  45% {
    transform: translate(var(--cx), var(--cy)) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.6);
    opacity: 0.95;
  }
}

@keyframes flash {
  0% {
    transform: scale(0.8);
    box-shadow: 0 0 0 0 rgb(245 158 11 / 55%);
  }
  60% {
    transform: scale(1.18);
    box-shadow: 0 0 0 12px rgb(245 158 11 / 0%);
  }
  100% {
    transform: scale(1);
  }
}
</style>
