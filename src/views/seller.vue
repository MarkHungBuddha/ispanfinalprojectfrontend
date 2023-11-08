<script setup>
import sidebar from "@/components/sidebar.vue";
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-main>
      <sidebar></sidebar>
      <v-container>
        <div class="welcome-message">歡迎使用後台管理系統</div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-application {
  background-image: url('@/assets/seller01.png'), linear-gradient(to bottom, #dfdd8d, #d0aaae);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

/* 歡迎文字 */
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 這會將所有子元素對齊到容器的頂部 */
  align-items: center;
  height: 100vh;
  padding-top: 300px;
  /* 可以調整這個值來改變上邊距 */
}

.welcome-message {
  font-size: 3rem;
}
</style>
