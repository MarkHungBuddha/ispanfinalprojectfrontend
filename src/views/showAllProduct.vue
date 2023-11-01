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
        <v-card>
          <v-card-text>
            <div>
              <v-text-field
                v-model="searchQuery"
                label="搜索商品"
                @input="searchProducts"
              ></v-text-field>
              <v-btn @click="searchProducts">搜索</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-table>
          <thead>
            <tr>
              <th>商品編號</th>
              <th>圖片</th>
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
            <!-- 使用v-for循环遍历结果 -->
            <tr v-for="product in searchQuery ? searchResults : products" :key="product.productId">
              <td>{{ product.productId }}</td>
              <td>
                <v-img :src="`https://i.imgur.com/${product.imagePath}.png`" alt="Product Image"></v-img>
              </td>
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
      products: [],          // 原始产品列表
      searchResults: [],     // 搜索结果
      searchQuery: '',
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      axios.get('http://localhost:8080/seller/api/products', {
        params: {
          p: 1,
        },
      })
      .then((response) => {
        this.products = response.data.content;
      })
      .catch((error) => {
        console.error('无法检索产品：', error);
      });
    },
    searchProducts() {
      axios.get('http://localhost:8080/seller/api/products/search', {
        params: {
          p: 1,
          productname: this.searchQuery,
        },
      })
      .then((response) => {
        this.searchResults = response.data.content;
      })
      .catch((error) => {
        console.error('无法检索产品：', error);
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
