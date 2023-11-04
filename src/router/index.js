import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/seller',
    name: 'Seller',
    component: () => import("@/views/seller.vue"),
    meta: { title: '賣家中心' }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import("@/views/Home.vue"),
    meta: { title: '賣場首頁' }
  },
  {
    path: '/productPage/:productId',
    name: 'ProductPage',
      component: () => import("@/views/productPage.vue"),
      meta: { title: '商品頁面' }
  },
  {
    path: '/shoppingCart',
      name: 'ShoppingCart',
      component: () => import("@/views/shoppingCart.vue"),
      meta: { title: '購物車' },
  },
  {
    path: '/wishList',
      name: 'wishList',
      component: () => import("@/views/wishList.vue"),
      meta: { title: '願望清單' }

  },
  {
    path: '/login',
      name: 'Login',
      component: () => import("@/views/login.vue"),
      meta: { title: '登入' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/views/register.vue"),
    meta: { title: '登入' }
  },
  {
    path: '/uploadProduct',
      name: 'uploadProduct',
      component: () => import("@/views/uploadProduct.vue"),
      meta: { title: '上傳商品' }
  },
  {
    path:'/checkoutOrder',

      name:'checkoutOrder',
      component: () => import("@/views/checkoutOrder.vue"),
      meta: { title: '結帳'}
  },
  {
    path: '/productPageBack/:productId',
    name: 'productPageBack',
    component: () => import("@/views/productPageBack.vue"),
    meta: { title: '商品頁面' },
    props: true,
  },
  {
    path: '/editpage/:productId',
    name: 'editpage',
    component: () => import("@/views/editpage.vue"),
    meta: { title: '編輯頁面' },
    props: true,
  },
  {
    path: '/uploadProduct',
    name: 'uploadProduct',
    component: () => import("@/views/uploadProduct.vue"),
    meta: { title: '上傳商品' }
  },
  {
    path: '/showAllProduct',
    name: 'showAllProduct',
    component: () => import("@/views/showAllProduct.vue"),
    meta: { title: '商品管理' }
  },
  {
    path: '/uploadImage/:productId',
    name: 'uploadImage',
    component: () => import("@/views/uploadImage.vue"),
    meta: { title: '上傳照片' }
  },
  {
    path: '/showRevenue',
    name: 'showRevenue',
    component: () => import("@/views/showRevenue.vue"),
    meta: { title: '收入' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/views/register.vue"),
    meta: { title: '註冊' }
  },
  {
    path: '/member', // 修改会员资料的页面路径
    component: () => import("@/views/member.vue"),
    meta: { title: '會員資料' } // 修改会员资料的 Vue 组件
  },
  {
    path: '/editProfile', // 修改会员资料的页面路径
    component: () => import("@/views/editProfile.vue"),
    meta: { title: '修改會員資料' } // 修改会员资料的 Vue 组件
  },
  // {
  //   path: '/public/api/google-callback',
  //   component: GoogleCallbackComponent, // 这应该是处理回调逻辑的Vue组件
  //   props: (route) => ({ code: route.query.code }) // 将 URL 中的 code 参数作为 prop 传递给组件
  // }



]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// After each route change, update the document's title
router.afterEach((to) => {
  document.title = to.meta.title || 'Default Title';
});

export default router;
