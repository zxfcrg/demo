<template>
  <div class="article-container">
    <div class="header">
      <h1>文章列表</h1>
      <div class="actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>写文章
        </el-button>
      </div>
    </div>

    <el-table :data="articles" v-loading="loading" style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <el-link @click="handleView(row._id)" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="author.username" label="作者" width="120" />
      <el-table-column prop="createdAt" label="发布时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="handleEdit(row._id)">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row._id)"
            >删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from '../utils/axios'

const router = useRouter()

const articles = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

const loadArticles = async (page = currentPage.value, limit = pageSize.value, search = '') => {
  loading.value = true
  try {
    const url = search
      ? `/articles/search?q=${search}&page=${page}&limit=${limit}`
      : `/articles?page=${page}&limit=${limit}`
    
    const response = await axios.get(url)
    articles.value = response.data.articles
    total.value = response.data.pagination.total
  } catch (error) {
    ElMessage.error('加载文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadArticles()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadArticles()
}

const handleSearch = () => {
  currentPage.value = 1
  loadArticles(1, pageSize.value, searchQuery.value)
}

const handleCreate = () => {
  router.push('/articles/create')
}

const handleEdit = (id: string) => {
  router.push(`/articles/edit/${id}`)
}

const handleView = (id: string) => {
  router.push(`/articles/${id}`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    
    await axios.delete(`/articles/${id}`)
    
    ElMessage.success('删除成功')
    loadArticles()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.article-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 16px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 