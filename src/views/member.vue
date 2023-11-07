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
  background-image: linear-gradient(to bottom, rgb(243, 215, 163), rgb(129, 245, 245));

  /* background-color: rgb(182, 250, 250); */
}

.custom-slider {
  max-width: 80vw;
  margin: 0 auto;
  /* 置中容器 */
}
</style>
