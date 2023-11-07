<script setup>
import {createApp} from 'vue';

import Slider from "@/components/slider.vue";
import tabitems from '@/components/tabitems.vue';
</script>

<template>
  <v-app>
    <v-container>
      <v-main>
        <v-row justify="center">
          <v-col>
            <slider class="custom-slider"/>
            <tabitems></tabitems>
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-app>

</template>

<style scoped>
.custom-slider {
  max-width: 80vw;
  margin: 0 auto;
  /* 置中容器 */
}
</style>
