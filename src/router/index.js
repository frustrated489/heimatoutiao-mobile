import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import My from '@/views/my'
Vue.use(VueRouter)

// 配置路由表
const routes = [{
  name: 'login',
  path: '/login',
  component: Login
}, {
  // 给拥有默认子路由的路由起名字没有意义，会受到Vue警告
  path: '/',
  component: Tabbar,
  children: [{
    name: 'home',
    path: '',
    component: Home
  }, {
    name: 'my',
    path: '/my',
    component: My
  }]
}, {
  name: 'search',
  path: '/search',
  component: Search
}, {
  name: 'search-result',
  path: '/search/:q',
  component: SearchResult
}, {
  // 给路由起一个名字，必须唯一
  // 建议：无论你是否使用到路由 name 的优势，都建议给它起个名字
  name: 'article',
  path: '/article/:articleId',
  component: Article,
  props: true
}]

const router = new VueRouter({
  routes
})

export default router
