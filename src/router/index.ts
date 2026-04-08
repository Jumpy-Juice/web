import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import IntroView from '../views/IntroView.vue'

import Chapter1StoryView from '../views/chapter1/StoryView.vue'
import Chapter1Level1View from '../views/chapter1/Level1View.vue'
import Chapter1Level2View from '../views/chapter1/Level2View.vue'
import Chapter1Level3View from '../views/chapter1/Level3View.vue'
import Chapter1EndView from '../views/chapter1/EndView.vue'

import Chapter2StoryView from '../views/chapter2/StoryView.vue'
import Chapter2Level1View from '../views/chapter2/Level1View.vue'
import Chapter2Level2View from '../views/chapter2/Level2View.vue'
import Chapter2Level3View from '../views/chapter2/Level3View.vue'
import Chapter2EndView from '../views/chapter2/EndView.vue'

import Chapter3StoryView from '../views/chapter3/StoryView.vue'
import Chapter3Level1View from '../views/chapter3/Level1View.vue'
import Chapter3Level2View from '../views/chapter3/Level2View.vue'
import Chapter3Level3View from '../views/chapter3/Level3View.vue'
import Chapter3Level4View from '../views/chapter3/Level4View.vue'
import Chapter3EndView from '../views/chapter3/EndView.vue'
import SandboxView from '../views/SandboxView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/intro', name: 'intro', component: IntroView },

  { path: '/chapter1/story', name: 'chapter1-story', component: Chapter1StoryView },
  { path: '/chapter1/level1', name: 'chapter1-level1', component: Chapter1Level1View },
  { path: '/chapter1/level2', name: 'chapter1-level2', component: Chapter1Level2View },
  { path: '/chapter1/level3', name: 'chapter1-level3', component: Chapter1Level3View },
  { path: '/chapter1/end', name: 'chapter1-end', component: Chapter1EndView },

  { path: '/chapter2/story', name: 'chapter2-story', component: Chapter2StoryView },
  { path: '/chapter2/level1', name: 'chapter2-level1', component: Chapter2Level1View },
  { path: '/chapter2/level2', name: 'chapter2-level2', component: Chapter2Level2View },
  { path: '/chapter2/level3', name: 'chapter2-level3', component: Chapter2Level3View },
  { path: '/chapter2/end', name: 'chapter2-end', component: Chapter2EndView },

  { path: '/chapter3/story', name: 'chapter3-story', component: Chapter3StoryView },
  { path: '/chapter3/level1', name: 'chapter3-level1', component: Chapter3Level1View },
  { path: '/chapter3/level2', name: 'chapter3-level2', component: Chapter3Level2View },
  { path: '/chapter3/level3', name: 'chapter3-level3', component: Chapter3Level3View },
  { path: '/chapter3/level4', name: 'chapter3-level4', component: Chapter3Level4View },
  { path: '/chapter3/end', name: 'chapter3-end', component: Chapter3EndView },

  { path: '/sandbox', name: 'sandbox', component: SandboxView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
