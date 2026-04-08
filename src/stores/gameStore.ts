import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface CardConfig {
  id: string
  title: string
  content: string
  buttonText?: string
}

export const useGameStore = defineStore('game', () => {
  // State
  const energyStars = ref<number>(0)
  const maxStars = ref<number>(10)
  const paiMode = ref<'initial' | 'friendly' | 'listening' | 'interactive'>('initial')
  const unlockedItems = ref<string[]>([])
  const unlockedCards = ref<string[]>([])

  const cardsData: Record<string, CardConfig> = {
    tip_pai_intro: {
      id: 'tip_pai_intro',
      title: 'AI小贴士·小派的自白',
      content:
        '我叫小派，是一只AI宠物机器人。<br/>我很想和你做朋友，但我现在还不会真正听懂你的指令。<br/>你需要教我：听见、分辨、回应。',
      buttonText: '我愿意！',
    },
    tip_what_is_ai_pet: {
      id: 'tip_what_is_ai_pet',
      title: 'AI小贴士·什么是AI宠物？',
      content:
        'AI宠物 = 会“听见你”“理解你”“回应你”的智能伙伴。<br/>它可以通过麦克风等传感器接收声音，再用算法判断你说的是什么、想让它做什么，然后做出动作或回答。',
    },
    tip_what_is_asr: {
      id: 'tip_what_is_asr',
      title: 'AI小贴士·语音识别四大步骤',
      content:
        '语音识别（ASR）通常可以拆成四步：<br/>1) 麦克风收音<br/>2) 把声音变成信息（特征/数据）<br/>3) 分析比对（在“字典/模型”里找意思）<br/>4) 输出结果（文字/动作）',
    },
    tip_affect_asr: {
      id: 'tip_affect_asr',
      title: 'AI小贴士·为什么AI耳朵不好使？',
      content:
        '常见原因包括：<br/>- 环境太吵：杂音多，难分辨你的声音<br/>- 语速/吐字：太快或含糊会让信息变乱<br/>- 知识库不足：没学过的词/语言听不懂<br/>- 硬件遮挡/损坏：麦克风收不到音',
    },
    tip_hear_vs_understand: {
      id: 'tip_hear_vs_understand',
      title: 'AI小贴士·听到 ≠ 听懂',
      content:
        '听到：只是检测到“有声音”。<br/>听懂：要把声音变成信息，再判断“这句话的意图是什么”，最后才能做出正确回应。',
    },
    tip_intent_recognition: {
      id: 'tip_intent_recognition',
      title: 'AI小贴士·意图识别',
      content:
        '意图识别（Intent Recognition）= 判断“你这句话想让AI做什么”。<br/>比如你说“转圈”，意图就是“旋转”；你说“你好”，意图就是“打招呼”。',
    },
    tip_data_labeling: {
      id: 'tip_data_labeling',
      title: 'AI小贴士·数据标注',
      content:
        '数据标注（Data Labeling）= 给样本加上“正确答案标签”。<br/>比如把“你好，小派！”标成【你好】，把“转个圈吧！”标成【转圈】。<br/>标注越准确、样本越多，AI就越容易学会。',
    },
    tip_dataset: {
      id: 'tip_dataset',
      title: 'AI小贴士·数据集',
      content:
        '数据集（Dataset）= 用来训练/测试AI的一堆样本集合。<br/>它就像“练习册”：样本越丰富、越贴近真实场景，AI学到的东西就越扎实。',
    },
    tip_generalization: {
      id: 'tip_generalization',
      title: 'AI小贴士·泛化能力',
      content:
        '泛化能力（Generalization）= AI能不能把学到的规则，正确用在“没见过的新情况”上。<br/>比如你只教过“你好，小派！”，它还能听懂“嗨，小派！”吗？这就看泛化能力。',
    },
  }

  // Getters
  const isMaxStars = computed(() => energyStars.value >= maxStars.value)
  const starsProgress = computed(() => `${energyStars.value}/${maxStars.value}`)
  const getCardById = computed(() => {
    return (cardId: string) => cardsData[cardId]
  })

  // Actions
  function addStar() {
    if (energyStars.value < maxStars.value) {
      energyStars.value += 1
    }
  }

  function unlockMode(modeName: 'initial' | 'friendly' | 'listening' | 'interactive') {
    paiMode.value = modeName
  }

  function unlockItem(itemName: string) {
    unlockedItems.value.push(itemName)
  }

  function unlockCard(cardId: string) {
    if (!unlockedCards.value.includes(cardId)) {
      unlockedCards.value.push(cardId)
    }
  }

  return {
    // state
    energyStars,
    maxStars,
    paiMode,
    unlockedItems,
    unlockedCards,
    cardsData,
    // getters
    isMaxStars,
    starsProgress,
    getCardById,
    // actions
    addStar,
    unlockMode,
    unlockItem,
    unlockCard,
  }
})
