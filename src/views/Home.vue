<script setup>
import {createApp} from 'vue';

import Slider from "@/components/slider.vue";
import tabitems from '@/components/tabitems.vue';
</script>

<template>
  <v-app class="custom-slider">
    <v-container >
      <v-main >
        <v-row justify="center">
          <v-col>
            <slider />
            <tabitems></tabitems>
          </v-col>
        </v-row>
      </v-main>
    </v-container>
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
