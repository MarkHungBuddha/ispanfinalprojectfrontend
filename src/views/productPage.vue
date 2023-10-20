<script setup>
import navbar from "@/components/navbar.vue";
</script>

<template>
  <v-app>
    <v-container>
      <navbar/>
      <v-breadcrumbs :items="breadcrumbs" divider=">"></v-breadcrumbs>
      <v-carousel>
        <v-carousel-item v-for="(imageCode, index) in productImages" :key="index">
          <v-img :src="`https://i.imgur.com/${imageCode}.jpeg`" aspect-ratio="1.7"></v-img>
        </v-carousel-item>
      </v-carousel>


      <!-- Product Details -->
      <v-row>
        <v-col cols="12">
          <h2>{{ productName }}</h2>
          <v-rating v-model="rating" readonly></v-rating>
          <p>價格: {{ productPrice }}</p>
          <p>特價價格: {{ productDiscountPrice }}</p>
          <p>數量: {{ productQuantity }}</p>
        </v-col>
      </v-row>

      <!-- Tabs for Description, Q&A, and Reviews -->
      <v-tabs color="primary" dark>
        <v-tab>商品描述</v-tab>
        <v-tab-item>
          <p>{{ productDescription }}</p>
        </v-tab-item>

        <v-tab>商品問與答</v-tab>
        <v-tab-item>
          <!-- Q&A content goes here -->
        </v-tab-item>

        <v-tab>商品評論</v-tab>
        <v-tab-item>
          <!-- Reviews content goes here -->
        </v-tab-item>
      </v-tabs>

    </v-container>
  </v-app>

</template>

<script>
export default {
  data() {
    return {

      breadcrumbs: [
        {text: '商品母分類', disabled: false},
        {text: '商品分類', disabled: true}
      ],
      productImages: [
        "1abRMhA",
        "iwbmpFY"
        // ... add more images as needed
      ],
      productName: "商品名稱",
      productPrice: "1000",
      productDiscountPrice: "800",
      productQuantity: 10,
      rating: 4, // for example, a 4 out of 5 stars rating
      productDescription: ""
    };
  },
  computed: {
    imgurLink() {
      return `https://i.imgur.com/${this.productImageCode}.jpeg`;
    }
  }
};
</script>
