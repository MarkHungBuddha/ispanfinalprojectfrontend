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
  /* 將漸層方向改為從上到下 */
  background-image: url('@/assets/Home01.png'), linear-gradient(to bottom, #e2d0b6, #cabae6);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}
</style>
