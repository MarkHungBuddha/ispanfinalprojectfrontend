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
    path: '/productPage',
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
    //訂單商品跳到商品頁面
    path: '/product/:productId',
    name: 'ProductPage',
    component: () => import("@/views/ProductPage.vue"),
  },
  {
    //賣家訂單商品跳商品頁面
    path: '/sellerOrderDetail/:orderid',
    name: 'sellerOrderDetail',
    component: () => import("@/views/sellerOrderDetail.vue"),
    meta: { title: '賣家訂單頁面' },
    props: true,
  },

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
