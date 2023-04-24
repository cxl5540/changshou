import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import dt from '@/pages/dt'
import clm from '@/pages/clm'
import yd from '@/pages/yd'
Vue.use(Router)
export default new Router({
	// base: '/history',
	mode:'history',
  routes: [
	  // {
	  //       path: "*",
	  //       redirect: "/"
	  // },
    {
      path: '/',
      name: 'index',
      component: index,
    
    },
    {
      path: '/index',
      name: 'index',
      component: index,

    },
    {
      path: '/cldt',
      name: 'dt',
      component: dt,

    },
    {
      path: '/clm',
      name: 'clm',
      component: clm,

    },
    {
      path: '/yddt',
      name: 'yd',
      component: yd,

    },
  ]
})
