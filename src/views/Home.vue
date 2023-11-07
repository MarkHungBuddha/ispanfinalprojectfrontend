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
  background-image: linear-gradient(to bottom, #e2d0b6, #cabae6);
  color: white;
  /* 將文字顏色設為白色以確保可讀性 */
  margin: 0 auto;
  /* 保持置中 */
}
</style>
