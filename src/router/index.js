import Vue from 'vue'
import Router from 'vue-router'

const login = resolve=>require(['@/container/Login/login'],resolve)
const home = resolve=>require(['@/container/Home/home'],resolve)
const index = resolve=>require(['@/container/Index/index'],resolve)
const platformRecord = resolve=>require(['@/container/Financial/platformRecord'],resolve)
const withdrawal = resolve=>require(['@/container/Financial/withdrawal'],resolve)
const userList = resolve=>require(['@/container/User/userList'],resolve)
const userDetail = resolve=>require(['@/container/User/userDetail'],resolve)
const identity = resolve=>require(['@/container/User/identity'],resolve)
const wangwang = resolve=>require(['@/container/User/wangwang'],resolve)
const bankCard = resolve=>require(['@/container/User/bankCard'],resolve)
const taskList = resolve=>require(['@/container/Task/taskList'],resolve)
const taskTemplate = resolve=>require(['@/container/Task/taskTemplate'],resolve)
const templateDetail = resolve=>require(['@/container/Task/templateDetail'],resolve)
const createTask = resolve=>require(['@/container/Task/createTask'],resolve)
const merchantList = resolve=>require(['@/container/Merchants/merchantList'],resolve)
const merchantDetail = resolve=>require(['@/container/Merchants/merchantDetail'],resolve)
const moneyRecord = resolve=>require(['@/container/Merchants/moneyRecord'],resolve)
const merchantTopup = resolve=>require(['@/container/Merchants/merchantTopup'],resolve)
const storeList = resolve=>require(['@/container/Merchants/storeList'],resolve)
const orderList = resolve=>require(['@/container/Order/orderList'],resolve)
const commentOrder = resolve=>require(['@/container/Order/commentOrder'],resolve)
const tag = resolve=>require(['@/container/Setting/tag'],resolve)
const category = resolve=>require(['@/container/Setting/category'],resolve)
const announcement = resolve=>require(['@/container/Setting/announcement'],resolve)
const systemSet = resolve=>require(['@/container/Setting/systemSet'],resolve)
const banner = resolve=>require(['@/container/Setting/banner'],resolve)
const role = resolve=>require(['@/container/Permissions/role'],resolve)
const admin = resolve=>require(['@/container/Permissions/admin'],resolve)
const management = resolve=>require(['@/container/Permissions/management'],resolve)


Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/login',
    component: login,
  },
  {
    path: '/home',
    component: home,
    children:[
    { path: '/index',name:"首页列表", component: index},
    { path: '/platformRecord',name:"资金记录", component: platformRecord},
    { path: '/withdrawal',name:"提现记录", component: withdrawal},
    { path: '/userList',name:"用户列表", component: userList},
    { path: '/userDetail',name:"用户详情", component: userDetail},
    { path: '/identity',name:"身份审核", component: identity},
    { path: '/wangwang',name:"旺旺号审核", component: wangwang},
    { path: '/bankCard',name:"银行卡审核", component: bankCard},
    { path: '/taskList',name:"任务列表", component: taskList},
    { path: '/taskTemplate',name:"任务模版", component: taskTemplate},
    { path: '/templateDetail',name:"模版信息", component: templateDetail},
    { path: '/createTask',name:"创建任务", component: createTask},
    { path: '/merchantList',name:"商家列表", component: merchantList},
    { path: '/merchantDetail',name:"商家详情", component: merchantDetail},
    { path: '/moneyRecord',name:"商家资金记录", component: moneyRecord},
    { path: '/merchantTopup',name:"商家充值", component: merchantTopup},
    { path: '/storeList',name:"店铺列表", component: storeList},
    { path: '/orderList',name:"订单列表", component: orderList},
    { path: '/commentOrder',name:"评论列表", component: commentOrder},
    { path: '/tag',name:"标签管理", component: tag},
    { path: '/category',name:"类目管理", component: category},
    { path: '/announcement',name:"公告", component: announcement},
    { path: '/systemSet',name:"系统管理", component: systemSet},
    { path: '/banner',name:"banner管理", component: banner},
    { path: '/role',name:"角色列表", component: role},
    { path: '/admin',name:"管理员列表", component: admin},
    { path: '/management',name:"权限资源管理", component: management},
    
    ]
  }
  ]
})
// 路由跳转前的钩子
router.beforeEach(function (to, from, next) {
  let path = to.fullPath;
  sessionStorage.setItem("tab",path);
  next()
})
export default router;