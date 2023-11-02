<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container>
      <navbar />

      <ProductImageUpload label="上傳商品圖片 (封面)" />
      <ProductImageUpload label="上傳商品圖片" />
      <ProductImageUpload label="上傳商品圖片" />
      <ProductImageUpload label="上傳商品圖片" />
      <ProductImageUpload label="上傳商品圖片" />
      <ProductImageUpload label="上傳商品圖片" />
    </v-container>
  </v-app>
</template>
<script>
import navbar from "@/components/navbar.vue";
import ProductImageUpload from "@/components/Image.vue";

export default {
  components: {
    navbar,
    ProductImageUpload
  }
}
</script>
