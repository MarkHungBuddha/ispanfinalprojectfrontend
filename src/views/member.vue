<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import Profile from "@/components/profile.vue";
import navbar from "@/components/navbar.vue";
</script>

<template>
  <v-app>
    <v-main>
      <sidebarBuyer></sidebarBuyer>
      <v-row justify="center">
        <v-col>
          <Profile />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-application {
  background-image: url('@/assets/buy01.png'), linear-gradient(to bottom, rgb(243, 215, 163), rgb(129, 245, 245));
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

.custom-slider {
  max-width: 80vw;
  margin: 0 auto;
  /* 置中容器 */
}
</style>
