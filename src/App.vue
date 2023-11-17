<script setup>

import CategoryList from '@/components/CategoryList.vue';
import Swal from 'sweetalert2'

</script>

<template>
  <v-app>
    <v-main>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet">

      <navbar :key="isLoggedIn" :is-logged-in="isLoggedIn"></navbar>
      <CategoryList></CategoryList>
      <router-view :is-logged-in="isLoggedIn"></router-view>
      <div v-if="overlay" class="text-center">
        <v-overlay class="align-center justify-center">
          <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import router from "./router";

export default {
  data() {
    return {
      isLoggedIn: false,
      overlay: false,
    };
  },
  computed: {
    apiCallFinished() {
      return this.$store.state.apiCallFinished;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    }
  },
  async mounted() {
    console.log("App組件已掛載");

    try {
      const response = await this.$axios.get('http://localhost:8080/public/api/checkLoginStatus');
      if (response.data && response.data.isLoggedIn) {
        this.$store.dispatch('updateLoginStatus', true);
      } else {
        this.$store.dispatch('updateLoginStatus', false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  },
  methods: {
    showOverlay() {
      this.overlay = true;
      setTimeout(() => {
        this.overlay = false;
      }, 3000);
    }
  },
  watch: {
    apiCallFinished(newVal) {
      if (newVal) {
        // 做一些當 API 調用完成後的操作，例如顯示提示或其他動作
        this.showOverlay();
        // 然後將 apiCallFinished 狀態重置為 false
        this.$store.dispatch('updateApiCallStatus', false);
      }
    }
  }
};

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    // 當接收到 401 錯誤時
    Swal.fire({
      icon: 'error',
      title: '權限不足',
      text: '請登入會員。',
    }).then(() => {
      router.push('/'); // 重定向到首頁
    });
  }
  if (error.response.status === 403) {
    // 當接收到 401 錯誤時
    Swal.fire({
      icon: 'error',
      title: '權限不足',
      text: '請進行手機認證。',
    }).then(() => {
      router.push('/'); // 重定向到首頁
    });
  }
  return Promise.reject(error);
});

</script>
<style scoped>
html,
body {
  font-family: 'Noto Sans TC', sans-serif;
  /* font-family: sans-serif;
  font-size: 16px;
  font-weight: bolder; */

  /* 全局樣式 */
}

/* 添加這部分來確保 #app 佔滿整個可用高度 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
