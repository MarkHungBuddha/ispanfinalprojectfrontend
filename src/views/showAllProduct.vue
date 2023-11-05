<script setup>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
</script>

<template>
  <v-app>
    <v-container>
      <div class="main-content">
          <sidebar />
        <div class="content">
          <h1>商品列表</h1>
          <v-card>
            <v-card-text>
              <div>
                <v-text-field v-model="searchQuery" label="搜索商品" @input="searchProducts"></v-text-field>
                <!-- <v-btn @click="searchProducts">搜索</v-btn> -->
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
                <td class="description_style">{{ product.description }}</td>
                <td class="quantity_style">{{ product.quantity }}</td>
                <td class="edit_style">
                  <button @click="editPage(product.productId)">編輯商品</button>
                  <br>
                  <button @click="deleteProduct(product.productId)">下架商品</button>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
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
    deleteProduct(productId) {
      axios.put(`http://localhost:8080/seller/api/${productId}/remove`)
        .then(response => {
          // 商品删除成功删除后的处理，可以刷新产品列表或进行其他操作
          // 例如，你可以重新获取产品列表：
          this.fetchProducts();
        })
        .catch(error => {
          console.error('删除商品失败：', error);
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
.product_image {
  width: 100px;
}

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
</style>