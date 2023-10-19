<script setup>
import navbar from "@/components/navbar.vue";
</script>

<template>
  <v-app>
      <v-container >
          <navbar/>
            <v-img :src="imgurLink" aspect-ratio="1.7"></v-img>
            <v-card>
              <v-card-title>{{ productName }}</v-card-title>
              <v-card-subtitle><s>{{ productOriginalPrice }}</s> {{ productDiscountPrice }}</v-card-subtitle>
              <v-rating v-model="rating"></v-rating>
              <v-btn @click="addToCart">加入購物車</v-btn>
            </v-card>
      </v-container>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      productImageCode: "dfs33f", // 7位數的亂碼
      productName: "CSD 產品名稱",   // 這裡應該是您的產品名稱
      productOriginalPrice: "$1,500",
      productDiscountPrice: "$999",
      rating: 4.6 // 這裡應該是您的產品評分
    };
  },
  computed: {
    imgurLink() {
      return `https://i.imgur.com/${this.productImageCode}.jpeg`;
    }
  },
  methods: {
    addToCart() {
      // 加入購物車的邏輯
    }
  }
};
</script>

<style scoped>
</style>
