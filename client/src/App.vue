<template>
  <div class="app-container">
    <NavBar v-if="showNav" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const showNav = computed(() => route.path !== '/login')
</script>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
