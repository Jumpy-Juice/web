<template>
  <div class="wave-wrap">
    <div class="bars">
      <span v-for="n in 5" :key="n" class="bar" :style="{ '--d': `${n * 0.08}s` }"></span>
    </div>
    <p class="text">{{ typedText }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  text: string
}

const props = defineProps<Props>()
const typedText = ref('')
let timer: number | undefined

function typeText(value: string) {
  if (timer !== undefined) window.clearInterval(timer)
  typedText.value = ''

  let i = 0
  timer = window.setInterval(() => {
    if (i >= value.length) {
      if (timer !== undefined) window.clearInterval(timer)
      return
    }
    typedText.value += value[i]
    i += 1
  }, 45)
}

watch(
  () => props.text,
  (value) => {
    typeText(value ?? '')
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearInterval(timer)
})
</script>

<style scoped>
.wave-wrap {
  width: min(620px, 100%);
  margin: 0 auto;
  border-radius: 12px;
  border: 1px solid #93c5fd;
  background: linear-gradient(180deg, #eff6ff 0%, #eef2ff 100%);
  padding: 12px 14px;
}

.bars {
  height: 44px;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 8px;
}

.bar {
  width: 8px;
  height: 20px;
  border-radius: 999px;
  background: linear-gradient(180deg, #60a5fa 0%, #7c3aed 100%);
  animation: beat 1s ease-in-out infinite;
  animation-delay: var(--d);
}

.text {
  margin: 8px 0 0;
  text-align: center;
  color: #1e3a8a;
  font-family: Consolas, Monaco, monospace;
  min-height: 28px;
}

@keyframes beat {
  0%,
  100% {
    height: 12px;
  }
  50% {
    height: 38px;
  }
}
</style>
