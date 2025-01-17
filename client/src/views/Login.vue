<template>
  <div class="page-container">
    <div class="login-container">
      <h1 class="title">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</h1>
      <div class="tabs">
        <button 
          type="button"
          :class="{ active: activeTab === 'login' }" 
          @click="activeTab = 'login'"
        >登录</button>
        <button 
          type="button"
          :class="{ active: activeTab === 'register' }" 
          @click="activeTab = 'register'"
        >注册</button>
      </div>

      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              v-model="username" 
              required 
              :placeholder="activeTab === 'register' ? '至少3个字符' : '请输入用户名'"
            >
          </div>
        </div>
        <div class="form-group">
          <label>密码</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              type="password" 
              v-model="password" 
              required
              :placeholder="activeTab === 'register' ? '至少6个字符' : '请输入密码'"
            >
          </div>
        </div>
        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>
        <button type="submit" class="submit-btn">
          {{ activeTab === 'login' ? '登录' : '注册' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const API_BASE_URL = 'http://localhost:3000/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const activeTab = ref('login')

const submitForm = async () => {
  console.log('Form submitted, activeTab:', activeTab.value)
  if (activeTab.value === 'login') {
    await handleSubmit()
  } else {
    await handleRegister()
  }
}

const handleSubmit = async () => {
  try {
    console.log('Attempting login...')
    errorMessage.value = ''
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: username.value,
      password: password.value
    })
    
    console.log('Login response:', response.data)
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)
      
      console.log('Stored token:', localStorage.getItem('token'))
      
      ElMessage.success('登录成功')
      router.push('/articles')
    } else {
      errorMessage.value = '登录失败：未收到token'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.message || '登录失败'
  }
}

const handleRegister = async () => {
  try {
    console.log('Attempting registration...')
    errorMessage.value = ''
    
    if (username.value.length < 3) {
      errorMessage.value = '用户名至少需要3个字符'
      return
    }
    if (password.value.length < 6) {
      errorMessage.value = '密码至少需要6个字符'
      return
    }

    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: username.value,
      password: password.value
    })
    
    console.log('Registration response:', response.data)
    
    errorMessage.value = '注册成功，请登录'
    activeTab.value = 'login'
    username.value = ''
    password.value = ''
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.message || '注册失败'
  }
}
</script>

<style scoped>
:root {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.page-container {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  box-sizing: border-box;
  margin: 0;
}

.login-container {
  background: white;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 680px;
}

.title {
  text-align: center;
  color: #2d3748;
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 600;
}

.tabs {
  display: flex;
  margin-bottom: 32px;
  background: #f7fafc;
  padding: 4px;
  border-radius: 8px;
}

.tabs button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #667eea;
  color: white;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper i {
  position: absolute;
  left: 12px;
  color: #a0aec0;
}

input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input::placeholder {
  color: #a0aec0;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e53e3e;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.error-message i {
  font-size: 16px;
}

@media (min-width: 1024px) {
  .login-container {
    max-width: 780px;
    padding: 60px 100px;
  }

  .title {
    font-size: 28px;
    margin-bottom: 32px;
  }

  .form {
    gap: 28px;
  }

  .input-wrapper i {
    font-size: 18px;
    left: 18px;
  }

  input {
    padding: 18px 18px 18px 55px;
    font-size: 17px;
  }

  .submit-btn {
    padding: 18px;
    font-size: 18px;
    margin-top: 10px;
  }

  label {
    font-size: 16px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .login-container {
    max-width: 720px;
    padding: 50px 80px;
  }
  
  .title {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 20px 15px;
  }

  .login-container {
    padding: 30px 20px;
  }

  .title {
    font-size: 22px;
  }

  input {
    padding: 12px 12px 12px 40px;
  }
}
</style>
