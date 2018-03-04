import Vue from 'vue'
import Router from 'vue-router'
import AllData from '@/components/AllData'
import PlayerData from '@/components/PlayerData'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AllData',
      component: AllData
    },
    {
      path: '/playerdata',
      name: 'PlayerData',
      component: PlayerData
    }
  ]
});
