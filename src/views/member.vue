<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import Profile from "@/components/profile.vue";
import navbar from "@/components/navbar.vue";
</script>

<template>

  <v-app>
    <v-row justify="center">
      <v-col>

        <Profile/>
      </v-col>
    </v-row>
  </v-app>
</template>

<style scoped>

.custom-slider {
  max-width: 80vw;
  margin: 0 auto;  /* 置中容器 */
}
</style>
