import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */

import Layout from '@/layout'

export const constantRoutes = [

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/dash',
    component: () => import('@/views/dashboard/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/about',
    children: [
      {
        path: 'about',
        component: () => import('@/views/dashboard/index'),
        name: 'About',
        meta: { title: '山东邦洁环境检测', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/tabledata',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tabledata/index'),
        name: 'TableData',
        meta: { title: '报告数据',  affix: true }
      }
    ]
  }
  ,
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
  
  
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
