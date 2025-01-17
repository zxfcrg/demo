<template>
  <div class="article-edit">
    <div class="header">
      <h1>{{ isEdit ? '编辑文章' : '写文章' }}</h1>
    </div>

    <el-form 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="article-form"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="15"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import axios from '../utils/axios'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = ref({
  title: '',
  content: ''
})

const rules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2-100个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, message: '内容至少需要10个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)
const isEdit = computed(() => route.params.id)

const loadArticle = async () => {
  if (!isEdit.value) return
  
  try {
    const response = await axios.get(`/articles/${route.params.id}`)
    form.value = {
      title: response.data.title,
      content: response.data.content
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
    router.push('/articles')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      if (isEdit.value) {
        const response = await axios.put(
          `/articles/${route.params.id}`,
          form.value
        )
        console.log('Update response:', response)
        ElMessage.success('更新成功')
      } else {
        const response = await axios.post(
          '/articles',
          form.value
        )
        console.log('Create response:', response)
        ElMessage.success('发布成功')
      }
      
      router.push('/articles')
    } catch (error: any) {
      console.error('Submit error:', error)
      // 不要在这里处理 401 错误，让 axios 拦截器处理
      if (error.response && error.response.status !== 401) {
        ElMessage.error(error.response?.data?.message || '操作失败')
      }
    } finally {
      loading.value = false
    }
  })
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-edit {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
}

.article-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style> 