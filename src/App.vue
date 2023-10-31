<template>
  <router-view :is-logged-in="isLoggedIn"></router-view>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,  // 用於存儲登入狀態的數據屬性
    };
  },
  mounted() {
    console.log("App組件已掛載");

    // 檢查用戶的登入狀態
    axios.get('http://localhost:8080/public/api/checkLoginStatus')
      .then(response => {
        console.log(response.data);  // 新增這行
        this.isLoggedIn = response.data.isLoggedIn;
      })
      .catch(error => {
        console.error("檢查登入狀態時發生錯誤:", error);
      });
  },
};
</script>