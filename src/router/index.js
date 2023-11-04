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
  }
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
