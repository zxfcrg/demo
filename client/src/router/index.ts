import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleEdit from '../views/ArticleEdit.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import ChangePassword from '../views/ChangePassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/articles'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleList
    },
    {
      path: '/articles/create',
      name: 'article-create',
      component: ArticleEdit
    },
    {
      path: '/articles/edit/:id',
      name: 'article-edit',
      component: ArticleEdit
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      component: ArticleDetail
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
