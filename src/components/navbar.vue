<template>
    <v-app-bar app :elevation="2">
      <v-toolbar-title>
        <span class="logo">Your Logo</span>
      </v-toolbar-title>

      <v-text-field
          v-if="!isLoggedIn"
          v-model="searchText"
          label="Search"
          hide-details
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn v-if="!isLoggedIn" @click="login">Login</v-btn>
      <v-btn v-else @click="goToCart">Cart</v-btn>
      <v-btn v-if="!isLoggedIn" @click="register">Register</v-btn>
    </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false, // 检查用户是否已登录
      searchText: '', // 存储搜索文本
    };
  },
  methods: {
    login() {
      // 处理登录逻辑
      // 设置 this.isLoggedIn 为 true
    },
    register() {
      // 处理注册逻辑
    },
    goToCart() {
      // 处理跳转到购物车的逻辑
    },
  },
};
</script>

<style>
.logo {
  font-size: 24px;
  font-weight: bold;
}

/* 样式可以根据需要进行调整 */
</style>
