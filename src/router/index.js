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
