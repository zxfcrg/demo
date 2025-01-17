<template>
  <div class="success-container">
    <h1>Login Successful!</h1>
    <p>Welcome back, {{ username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('admin') // 这里可以从store或localStorage获取实际用户名

const logout = () => {
  // 这里可以添加登出逻辑
  router.push('/')
}
</script>

<style scoped>
.success-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  border: 1px solid #42b883;
  border-radius: 8px;
}

h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #42b883;
}
</style>