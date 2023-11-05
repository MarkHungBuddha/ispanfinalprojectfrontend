<script setup>

import ProductSearch from '@/components/ProductSearchBar.vue';
</script>
<template>
  <navbar :key="isLoggedIn" :is-logged-in="isLoggedIn"></navbar>
  <product-search></product-search>
  <router-view :is-logged-in="isLoggedIn"></router-view>
  <div v-if="overlay" class="text-center">
    <v-overlay class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,
      overlay: false,
    };
  },
  computed: {
    apiCallFinished() {
      return this.$store.state.apiCallFinished;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    }
  },
  async mounted() {
    console.log("App組件已掛載");

    try {
      const response = await this.$axios.get('http://localhost:8080/public/api/checkLoginStatus');
      if (response.data && response.data.isLoggedIn) {
        this.$store.dispatch('updateLoginStatus', true);
      } else {
        this.$store.dispatch('updateLoginStatus', false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  },
  methods: {
    showOverlay() {
      this.overlay = true;
      setTimeout(() => {
        this.overlay = false;
      }, 3000);
    }
  },
  watch: {
    apiCallFinished(newVal) {
      if (newVal) {
        // 做一些當 API 調用完成後的操作，例如顯示提示或其他動作
        this.showOverlay();
        // 然後將 apiCallFinished 狀態重置為 false
        this.$store.dispatch('updateApiCallStatus', false);
      }
    }
  }
};
</script>

