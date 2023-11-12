<script setup>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
import Swal from 'sweetalert2';
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <sidebar></sidebar>
        <div class="main-content">
          <div class="content">
            <h1>商品列表</h1>
            <v-card>
              <v-card-text class="card1">
                <div>
                  <v-text-field v-model="searchQuery" label="搜索商品" @input="searchProducts"></v-text-field>
                  <!-- <v-btn @click="searchProducts">搜索</v-btn> -->
                </div>
              </v-card-text>
            </v-card>

            <v-table class="table">
              <thead>
                <tr>
                  <th>商品編號</th>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>價錢</th>
                  <th>特價</th>
                  <th>子分類</th>
                  <th>母分類</th>
                  <th>商品細節</th>
                  <th>數量</th>
                  <th>編輯</th>
                </tr>
              </thead>
              <tbody>
                <!-- 使用v-for循环遍历结果 -->
                <tr v-for="product in searchQuery ? searchResults : products" :key="product.productId">
                  <td class="id_style" @click="productPage(product.productId)">{{ product.productId }}</td>

                  <td class="img_style">
                    <v-img :src="`https://i.imgur.com/${product.imagePath}.png`" alt="Product Image"
                      class="product_image"></v-img>
                  </td>
                  <td class="name_style">{{ product.productName }}</td>
                  <td class="price_style">{{ product.price }}</td>
                  <td class="price_style">{{ product.specialPrice }}</td>
                  <td class="category_style">{{ product.categoryName }}</td>
                  <td class="category_style">{{ product.parentCategoryName }}</td>
                  <td class="description_style">{{ truncate(product.description, 50) }}</td>
                  <td class="quantity_style">{{ product.quantity }}</td>
                  <td class="edit_style">
                    <button @click="editPage(product.productId)">編輯商品</button>
                    <br>
                    <button @click="deleteProduct(product.productId)">下架商品</button>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-pagination v-model="currentPage" :length="totalPages" @input="handlePageChange"></v-pagination>

          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      products: [],          // 原始产品列表
      searchResults: [],     // 搜索结果
      searchQuery: '',
      currentPage: 1, // 从1开始以匹配后端API
      totalPages: 1, // 初始设置为1，将从API响应中更新
      pageSize: 10,
    };
  },
  created() {
    this.fetchProducts();
  },
  watch: {
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchProducts(); // 当页码变化时获取新数据
      }
    }
  },
  methods: {
    productPage(productId) {
      console.log('跳页功能被触发，productId:', productId);
      this.$router.push({ name: 'productPageBack', params: { productId: productId } });
    },
    editPage(productId) {
      console.log('跳页功能被触发，productId:', productId);
      this.$router.push({ name: 'editpage', params: { productId: productId } });
    },
    fetchProducts() {
      axios.get('http://localhost:8080/seller/api/products', {
        params: {
          p: this.currentPage,
        },
      })
        .then((response) => {
          this.products = response.data.content; // 使用products而不是orders
          this.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.error('无法检索产品：', error);
        });
    },
    truncate(text, length) {
      if (text.length <= length) {
        return text;
      }
      return text.substring(0, length) + '...';
    },
    deleteProduct(productId) {
      Swal.fire({
        title: '確定要下架這個商品嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是的，下架它！',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put(`http://localhost:8080/seller/api/${productId}/remove`).then((result) => {
            this.fetchProducts();
          })
        }
      })
        .catch(error => {
          console.error('删除商品失敗：', error);
        });
    },
    searchProducts() {
      this.currentPage = 1; // 假设您希望每次搜索都返回第一页的结果

      axios.get('http://localhost:8080/seller/api/products/search', {
        params: {
          p: this.currentPage,
          productname: this.searchQuery,
        },
      })
        .then((response) => {
          this.searchResults = response.data.content;
          this.products = response.data.content; // 使用products而不是orders
          this.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.error('无法检索产品：', error);
        });
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      if (this.searchQuery) {
        this.searchProducts();
      } else {
        this.fetchProducts();
      }
    }
  },
};

</script>

<style scoped>
.v-application {
  background-image: url('@/assets/seller01.png'), linear-gradient(to bottom, #dfdd8d, #d0aaae);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

.product_image {}

.id_style {
  width: 100px;
}

.img_style {
  width: 150px;
}

.name_style {
  width: 200px;
}

.price_style {
  width: 100px;
}

.category_style {
  width: 100px;
}

.quantity_style {
  width: 100px;
}

.description_style {
  width: 400px;
}

.main-content {
  display: flex;
  align-items: flex-start;
  /* 控制垂直对齐方式 */
}

.sidebar {
  width: 250px;
  /* 侧边栏的宽度 */
  background-color: #f0f0f0;
  /* 侧边栏的背景色 */
  padding: 20px;
  /* 可根据需要进行调整 */
}

.content {
  flex: 1;
  /* 填充剩余空间 */
  padding: 20px;
  /* 可根据需要进行调整 */
}

.card1 {
  background-color: rgba(220, 211, 148, 0.5);
}

.table {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
