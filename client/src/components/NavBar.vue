<template>
  <nav class="nav-bar">
    <div class="nav-left">
      <router-link to="/articles" class="logo">博客系统</router-link>
      <router-link to="/articles" class="nav-item">文章列表</router-link>
      <router-link to="/articles/create" class="nav-item">写文章</router-link>
    </div>
    <div class="nav-right">
      <TheHeader />
    </div>
  </nav>
</template>

<script setup lang="ts">
import TheHeader from './TheHeader.vue'
</script>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-item {
  color: #606266;
  text-decoration: none;
}

.nav-item:hover {
  color: #409EFF;
}

.nav-right {
  display: flex;
  align-items: center;
}
</style> 