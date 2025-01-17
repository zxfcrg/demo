<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>
    
    <template v-else>
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <span>作者：{{ article.author?.username }}</span>
          <span>发布时间：{{ formatDate(article.createdAt) }}</span>
        </div>
      </div>

      <div class="article-content">
        {{ article.content }}
      </div>

      <div class="article-actions">
        <el-button @click="handleBack">返回</el-button>
        <div v-if="isAuthor">
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from '../utils/axios'

const route = useRoute()
const router = useRouter()

const article = ref<any>({})
const loading = ref(true)
const isAuthor = ref(false)

const loadArticle = async () => {
  try {
    const response = await axios.get(`/articles/${route.params.id}`)
    article.value = response.data
    
    // 检查是否是作者
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      isAuthor.value = payload.userId === article.value.author._id
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
    router.push('/articles')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/articles/edit/${route.params.id}`)
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    
    await axios.delete(`/articles/${route.params.id}`)
    
    ElMessage.success('删除成功')
    router.push('/articles')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  padding: 20px;
}

.article-header {
  margin-bottom: 30px;
}

.article-meta {
  color: #666;
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.article-content {
  line-height: 1.8;
  margin-bottom: 30px;
  white-space: pre-wrap;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
</style> 