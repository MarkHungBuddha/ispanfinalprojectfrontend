<script setup>
import navbar from "@/components/navbar.vue";
import axios from 'axios';

</script>

<template>
  <v-app>
    <v-container>

      <!-- Display product images -->
      <v-row v-if="productImages.length > 0">
        <v-col v-for="(image, index) in productImages" :key="index" cols="4">
          <v-img v-for="(imagePath, index) in productImages" :key="index" :src="`https://i.imgur.com/${imagePath}.jpeg`"></v-img>

        </v-col>
      </v-row>

      <!-- Product Details -->
      <v-row v-if="product">
        <v-col cols="12">
          <h2>{{ product.productName }}</h2>
          <p>價格: {{ product.price }}</p>
          <p>特價價格: {{ product.specialPrice }}</p>
          <p>數量: {{ product.quantity }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>
export default {
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      product: null,
      productImages: []
    };
  },
  created() {
    this.fetchProducts();
    this.fetchProductImages();
  },
  methods: {
    fetchProducts() {
      axios.get('http://localhost:8080/seller/api/product', {
        params: { id: this.productId },
      })
        .then((response) => {
          this.product = response.data;
        })
        .catch((error) => {
          console.error('API 请求失败：', error);
        });

    },

  fetchProductImages() {
      axios.get(`http://localhost:8080/public/productImage/${this.productId}`)
        .then((response) => {
          // Assuming the response is an array of image URLs
          this.productImages = response.data;
        })
        .catch((error) => {
          console.error('获取产品图像失败：', error);
        });
    },
},
};
</script>