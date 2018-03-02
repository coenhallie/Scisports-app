import Vue from 'vue'
import Router from 'vue-router'
import Heatmap from '@/components/Heatmap'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Heatmap',
      component: Heatmap
    }
  ]
})