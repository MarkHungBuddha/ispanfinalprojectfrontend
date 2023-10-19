<script setup>
import { createApp } from 'vue';

import Slider from "@/components/slider.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import navbar from "@/components/navbar.vue";
</script>

<template>
<v-app>
  <v-row>
    <v-col cols="12" md="10">
      <navbar/>
      <slider/>
      <register-form/>

    </v-col>
  </v-row>


</v-app>





</template>



