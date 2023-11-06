<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- <navbar></navbar>
                <sidebar></sidebar> -->

        <v-text-field v-model="search" label="模糊搜尋" append-icon="mdi-magnify" @click:append="fetchProductsWithSearch"
          @keyup.enter="fetchProductsWithSearch"></v-text-field>



        <!-- 畫面呈現區 -->
        <v-row>

          <v-col v-for="(product, index) in products" :key="index">

            <v-card>
              <v-card-text class="d-flex flex-column align-center">
                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                  class="product-image mr-2" @click="navigateToProduct(product.productid)"></v-img>
                <div class="product-name">{{ product.productname }}</div>
                <div class="original-price">原價: {{ product.price }}</div>
                <div class="special-price">特價: {{ product.specialprice }}</div>

                <div v-if="product.averageReview">
                  平均評價: {{ product.averageReview.toFixed(2) }}
                </div>


                <v-btn color="success" @click="addProductToCart(product.productid)">加入購物車</v-btn>

                <!-- 心形圖示按鈕 -->
                <v-btn icon flat class="wishlist-btn" @click="toggleWishlist(product)">
                  <v-icon :color="product.inWishlist ? 'pink' : 'black'">mdi-heart</v-icon>
                </v-btn>
                <!-- 願望清單的彈跳提示 -->
                <v-snackbar v-model="wishlistSnackbar" :color="wishlistSnackbarColor" timeout="3000">
                  {{ wishlistSnackbarText }}
                  <v-btn color="white" text @click="wishlistSnackbar = false">關閉</v-btn>
                </v-snackbar>




              </v-card-text>
            </v-card>
          </v-col>
        </v-row>


        <!-- 分頁控件 -->
        <v-pagination v-model="currentPage" :length="totalPages" class="my-4"></v-pagination>

        <v-row>
          <v-col cols="300" sm="4">
            <v-switch v-model="priceFilter" label="啟用價格範圍過濾"></v-switch>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="minPrice" label="最小價格" type="number" :disabled="!priceFilter" min="0"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="maxPrice" label="最大價格" type="number" :disabled="!priceFilter" min="0"></v-text-field>
          </v-col>
          <!-- <v-col cols="12" sm="4" class="d-flex align-end">
                    <v-btn color="primary" @click="applyFilters">應用篩選</v-btn>
                  </v-col> -->
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      options: {
        productname: '', // 确保有一个默认值
        products: [],
        searchText: '',
        search: '', // 添加了搜尋的資料屬性
        selectedProductName: "",
        selectedCategoryImagepath: "",
        selectedCategoryPrice: 0,
        selectedCategorySpecialPrice: 0,
        showPriceAndSpecialPrice: false,
      },

      headers: [
        { text: '商品編號', value: 'productid' },
        { text: '名稱', value: 'productname' },
        { text: '價格', value: 'price' },
        { text: '特價', value: 'specialprice' },
        { text: '類別', value: 'categoryname' },
        { text: '數量', value: 'quantity' },
        { text: '描述', value: 'description' },
        { text: '圖片', value: 'imagepath' },
      ],
      products: [],
      totalProducts: 0,
      loading: false,



      currentPage: 1,
      totalPages: 1, // 初始化总页数为1
      showLargeAppliances: false, // 控制大型家電内容的显示状态

      minPrice: 0,
      maxPrice: 9999999,
      priceFilter: false,

      // 願望清單彈跳
      snackbar: false, // 控制Snackbar顯示的變量
      snackbarText: '', // 顯示在Snackbar中的消息
      snackbarColor: '', // Snackbar的顏色
      // 購物車彈跳
      wishlistSnackbar: false,
      wishlistSnackbarText: '',
      wishlistSnackbarColor: '',
    };
  },

  //頁碼處理
  watch: {
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchProducts(this.selectedCategoryName);
      }
    }
  },

  //願望清單 生命茅點
  created() {
    // 從URL查詢參數或組件內部獲取搜尋詞
    this.searchText = this.$route.query.search || this.search;
    if (this.searchText) {
      this.fetchProducts();
    }
  },


  mounted() {
    this.fetchProducts();
  },
  methods: {

    applyFilters() {
      this.fetchProducts(this.selectedProductname);
    },

    showSnackbar(message, color) {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    showWishlistSnackbar(message, color) {
      this.wishlistSnackbarText = message;
      this.wishlistSnackbarColor = color;
      this.wishlistSnackbar = true;
    },

    fetchProductsWithSearch() {
      this.currentPage = 1;
      // 如果從navbar獲得了搜尋詞，則使用它來發起產品搜尋
      if (this.searchText) {
        this.fetchProducts();
      } else {
        // 否則，使用組件內的搜尋詞來發起產品搜尋
        this.searchText = this.search;
        this.fetchProducts();
      }
    },

    fetchProducts() {
      console.log('开始 fetchProducts 方法');

      this.loading = true;
      // 根據當前的 options 更新查詢參數
      const params = {
        productname: this.searchText.trim(), // 這裡使用searchText而不是options.productname
        minPrice: this.minPrice || 0,
        maxPrice: this.maxPrice || 999999.99,
        page: this.currentPage,
        itemsPerPage: 5, // 或者其他你希望每页显示的数量
      };

      axios.get('http://localhost:8080/public/api/products', { params })

        .then(response => {
          this.loading = false;
          this.products = response.data.content;
          this.totalPages = response.data.totalPages;
        })
        .catch(error => {
          // 处理错误...

          this.loading = false;

          console.error('请求失败，错误信息:', error);
          this.showSnackbar('檢索產品時發生錯誤。', 'error');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addProductToCart(productid) {

      axios
        .post('http://localhost:8080/customer/api/shoppingCart', null, { // 如果您的API期待URL參數，這裡應該是null或者空對象
          withCredentials: true,

          params: {
            productId: productid,
          }
        }, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
          console.log(response);
          if (response.data && Array.isArray(response.data.content)) {
            this.products = response.data.content;
            this.totalPages = response.data.totalPages;
          } else {
            // 如果没有产品，清空产品数组
            this.products = [];
            this.totalPages = 0;
            this.showSnackbar('没有找到产品', 'info');
          }
        })
        .catch(error => {
          // 錯誤處理
          console.error('Error adding product to cart:', error);
          this.snackbarText = '無法添加商品到購物車';
          this.snackbarColor = 'error'; // 錯誤消息使用紅色
          this.snackbar = true; // 顯示Snackbar
          // 如果API響應了請求但出現錯誤
          if (error.response) {
            console.error('Error response data:', error.response.data);
            this.snackbarText = `Error: ${error.response.data.message}`;
          } else {
            // 服务器没有响应
            this.snackbarText = 'Error: Server did not respond';
          }
        });

    },
    //添加跳轉頁面到productPage
    navigateToProduct(productid) {
      this.$router.push({ name: 'ProductPage', params: { productId: productid } });
    },



    //願望清單
    addProductToWishlist(productId) {
      // 發送POST請求到後端API
      axios
        .post(`http://localhost:8080/customer/api/wishlist/${productId}`)
        .then(response => {
          // 成功添加到願望清單後的操作
          alert('成功添加到願望清單');
          // 可以根據需要更新願望清單狀態或UI
          this.updateWishlistStatus(productId, response.data.inWishlist); // 假设response中包含了inWishlist状态
        })
        .catch(error => {
          // 處理錯誤
          console.error('Error adding product to wishlist:', error);
          alert('無法添加商品到願望清單。');
        });

      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.inWishlist = true; // 直接设置属性
      }
    },

    updateWishlistStatus(productId, status) {
      // 找到产品并更新其 inWishlist 状态
      const productIndex = this.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        this.$set(this.products[productIndex], 'inWishlist', status);
      }
    },

    toggleWishlist(product) {
      product.inWishlist = !product.inWishlist;
      if (product.inWishlist) {
        this.snackbarText = '已加入願望清單';
        this.snackbarColor = 'success';
        localStorage.setItem(product.productid, 'true');
      } else {
        this.snackbarText = '已從願望清單移除';
        this.snackbarColor = 'error';
        localStorage.removeItem(product.productid);
      }
      this.snackbar = true;
    }




  },
}

</script>

<style>
.v-row,
.v-col {
  margin: 0 !important;
  padding: 0 !important;
}

.product-card {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  /* 卡片寬度設定為 100% */
  height: auto;
  /* 高度根據內容自動調整 */
}
</style>
