<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import navbar from "@/components/navbar.vue";
</script>

<template >
  <v-app>

    <v-row justify="center">

      <slider class="custom-slider" />

    </v-row>
  </v-app>
</template>

<style scoped>
.custom-slider {

  /* max-width: 80vw; */
  margin: 0 auto;
  /* 置中容器 */
}

.custom-slider {
  background-image: linear-gradient(to bottom, #e2d0b6, #cabae6);
  background-attachment: fixed;
  /* 使背景圖片固定於視口 */
  background-position: center center;
  /* 背景圖片始終置中 */
  background-size: cover;
  /* 背景圖片覆蓋整個元素區域 */
  background-repeat: no-repeat;
  /* 防止背景圖片重複 */
  margin: 0 auto;
  /* 置中容器 */
}
</style>
