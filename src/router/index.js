import Vue from 'vue'
import Router from 'vue-router'
import BitcoinjTools from '@/components/BitcoinjTools'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BitcoinjTools',
      component: BitcoinjTools
    }
  ]
})
