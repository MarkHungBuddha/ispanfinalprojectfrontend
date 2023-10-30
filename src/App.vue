<template>
  <router-view :is-logged-in="isLoggedIn"></router-view>
  <navbar :key="isLoggedIn" :is-logged-in="isLoggedIn"></navbar>

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
          console.log("isLoggedIn before setting:", this.isLoggedIn);
          this.isLoggedIn = response.data.isLoggedIn;
          console.log("isLoggedIn after setting:", this.isLoggedIn);

          // Update the Vuex store state
          this.$store.dispatch('updateLoginStatus', response.data.isLoggedIn);
        })
        .catch(error => {
          console.error("檢查登入狀態時發生錯誤:", error);
        });
  }
,
};
</script>
