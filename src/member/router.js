import Vue from 'vue'
import Router from 'vue-router'
import OrderList from './views/orderlist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'orderlist',
      component: OrderList
    },
  ]
})
