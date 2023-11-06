import { createRouter, createWebHistory } from 'vue-router';
import ProductList from "@/views/ProductList.vue";

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
    meta: { title: '註冊' }
  },
  {
    path: '/uploadProduct',
    name: 'uploadProduct',
    component: () => import("@/views/uploadProduct.vue"),
    meta: { title: '上傳商品' }
  },
  {
    path: '/checkoutOrder',

    name: 'checkoutOrder',
    component: () => import("@/views/checkoutOrder.vue"),
    meta: { title: '結帳' }
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
    path: '/member', // 修改会员资料的页面路径
    component: () => import("@/views/member.vue"),
    meta: { title: '會員資料' } // 修改会员资料的 Vue 组件
  },
  {
    path: '/editProfile', // 修改会员资料的页面路径
    component: () => import("@/views/editProfile.vue"),
    meta: { title: '修改會員資料' } // 修改会员资料的 Vue 组件
  },
  {
    path: '/ProductFuzzySearch',
    name: 'ProductFuzzySearch',
    component: () => import("@/views/ProductFuzzySearch.vue"),
    meta: { title: '搜尋' }
  },
  {
    //訂單商品跳到商品頁面
    path: '/product/:productId',
    name: 'ProductPage',
    component: () => import("@/views/ProductPage.vue"),
  },
  {
    path: '/order',
    name: 'order',
    component: () => import("@/views/order.vue"),
    meta: { title: '查看訂單' }
  },
  {
    path: '/orderDetail/:orderid',
    name: 'orderDetail',
    component: () => import("@/views/orderDetail.vue"),
    meta: { title: '買家訂單頁面' },
    props: true,
  },
  {
    path: '/sellerOrder',
    name: 'sellerOrder',
    component: () => import("@/views/sellerOrder.vue"),
    meta: { title: '查看銷售訂單' }
  },

  {
    //賣家訂單商品跳商品頁面
    path: '/sellerOrderDetail/:orderid',
    name: 'sellerOrderDetail',
    component: () => import("@/views/sellerOrderDetail.vue"),
    meta: { title: '賣家訂單頁面' },
    props: true,
  },
  {
    path: '/products/:category',
    name: 'ProductList',
    component: () => import('@/views/ProductList.vue'), // 使用箭頭函數來動態導入
    props: true,
    meta: {
      title: (route) => `${route.params.category}分類商品` // 使用一個函數來動態設置標題
    }
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: () => import('@/views/searchResult.vue'), // 使用箭頭函數來動態導入
    props: true,
    meta: { title: '搜尋結果' },
  },
  {
    path: '/unanswer',
    name: 'unanswer',
    component: () => import('@/views/unAnswerQuestion.vue'), // 使用箭頭函數來動態導入
    props: true,
    meta: { title: '未回答問題' },
  },
  {
    path: '/member',
    name: 'member',
    component: () => import('@/views/member.vue'), // 會員資料
    props: true,
    meta: { title: '會員資料' },
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

// 為了使用 meta 屬性中的 title，你可以設置一個全局的前置守衛
router.beforeEach((to, from, next) => {
  // 檢查 meta.title 是否為函數，如果是，則以當前路由作為參數調用它
  if (typeof to.meta.title === 'function') {
    document.title = to.meta.title(to) || 'Default Title';
  } else {
    document.title = to.meta.title || 'Default Title';
  }
  next();
});


// After each route change, update the document's title
// router.afterEach((to) => {
//   document.title = to.meta.title || 'Default Title';
// });

export default router;