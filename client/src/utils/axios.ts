import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  withCredentials: true
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error)
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 只有在真正需要重新登录时才清除 token
          if (error.response.data.message === '无效的认证令牌' || 
              error.response.data.message === '未提供认证令牌') {
            localStorage.removeItem('token')
            router.push('/login')
            ElMessage.error('请重新登录')
          } else {
            ElMessage.error(error.response.data.message || '未授权的操作')
          }
          break
        case 403:
          ElMessage.error('没有权限执行此操作')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(error.response.data.message || '操作失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default instance 