<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import tabitems from '@/components/tabitems.vue';


</script>

<template>
  <v-app>
    <v-main>
      <slider class="custom-slider" />
      <tabitems></tabitems>
      <Footer></Footer>
      <v-container>

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.custom-slider {
  max-width: 80vw;
  margin: 0 auto;
  /* 置中容器 */
}
</style>
