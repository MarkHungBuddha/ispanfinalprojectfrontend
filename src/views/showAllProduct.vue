<script setup>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
</script>

<template>
  <v-app>
    <v-container>
      <navbar />
      <div>
        <h1>商品列表</h1>
        <v-table>
          <thead>
            <tr>
              <th>商品編號</th>
              <th>商品名稱</th>
              <th>價錢</th>
              <th>特價</th>
              <th>子分類</th>
              <th>數量</th>
              <th>商品細節</th>
              <th>母分類</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.productid">
              <td>{{ product.productId }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.specialPrice }}</td>
              <td>{{ product.categoryName }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.description }}</td>
              <td>{{ product.parentCategoryName }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      products: [],
    };
  },
  created() {
    this.fetchProducts();
    console.log(this.products)
  },
  methods: {
    fetchProducts() {
      axios
        .get('http://localhost:8080/seller/api/products', {
          params: {
            p: 1,
          },
        })
        .then((response) => {
          this.products = response.data.content;
        })
        .catch((error) => {
          console.error('無法檢索訂單：', error);
        });
    },
  },
};
</script>
<style scoped>
img {
  width: 100px;
}
</style>