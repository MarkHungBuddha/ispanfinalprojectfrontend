<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import navbar from "@/components/navbar.vue";
import order from '../views/order.vue';

</script>

<template>
  <v-app>
    <v-row>
      <v-col cols="12">
        <router-link to="/">首頁</router-link> |
        <router-link to="/seller">賣家中心</router-link> |
        <router-link to="/productPage">商品頁面</router-link> |
        <router-link to="/shoppingCart">購物車</router-link> |
        <router-link to="/wishList">願望清單</router-link> |
        <router-link to="/login">登入</router-link> |
        <router-link to="/register">注冊</router-link> |
        <router-link to="/uploadProduct">上傳商品</router-link> |
        <router-link to="/order">查看訂單</router-link> |
        <navbar />
        <slider />
        <register-form />


      </v-col>
    </v-row>


  </v-app>
</template>



