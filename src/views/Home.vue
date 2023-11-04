<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import navbar from "@/components/navbar.vue";
import ProductSearch from './ProductSearch.vue';
</script>

<template>
  <v-app>
    <v-row justify="center">
      <v-col>
        <navbar />
        <slider class="custom-slider" />
        <product-search></product-search>

      </v-col>
    </v-row>
  </v-app>
</template>

<style scoped>
.custom-slider {
  max-width: 80vw;
  margin: 0 auto;
  /* 置中容器 */
}
</style>
