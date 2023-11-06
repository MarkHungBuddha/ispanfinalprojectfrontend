<script setup>
import { defineComponent } from 'vue';
import EditP from "@/components/editP.vue"; // 确保路径正确，且首字母大写，符合组件命名习惯
import Navbar from "@/components/navbar.vue"; // 确保路径正确，且首字母大写，符合组件命名习惯
</script>

<template>
  <v-app>
    <v-row justify="center">
      <v-col>
     
        <EditP />
      </v-col>
    </v-row>
  </v-app>
</template>

<style scoped>
.custom-slider {
  max-width: 80vw;
  margin: 0 auto; /* 置中容器 */
}
</style>
