<script setup lang="ts">
import { ref } from 'vue'

const username = ref(localStorage.getItem('username') || '')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  window.location.href = '/login'
}
</script>

<template>
  <el-dropdown>
    <span class="user-menu">
      {{ username }}
      <el-icon><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$router.push('/change-password')">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template> 