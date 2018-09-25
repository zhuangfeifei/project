import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Detils from '@/page/Detils'
import Headline from '@/components/Headline'
import Reason from '@/components/Reason'
import Reasons from '@/page/Reasons'
import Life from '@/components/Life'
import Video from '@/components/Video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      component: Reasons
    },
    {
      path: '/Home',
      component: Home,
      children:[{
        path:'/',
        component: Headline
      },{
        path:'/Home/Reason',
        component: Reason
      },{
        path:'/Home/Life',
        component: Life
      },{
        path:'/Home/Video',
        component: Video
      }]
    },
    {
      path:'/Detils',
      name:'Detils',
      component: Detils
    }
  ]
})
