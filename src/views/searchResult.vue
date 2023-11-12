<script setup>
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" sm="8">
            <v-range-slider v-model="range" :max="99999" :min="0" :step="1" hide-details class="align-center"
              @change="applyFilters">
              <template v-slot:prepend>
                <v-text-field v-model="range[0]" hide-details dense outlined type="number" class="mt-0 pt-0"
                  style="width: 100px"></v-text-field>
              </template>
              <template v-slot:append>
                <v-text-field v-model="range[1]" hide-details dense outlined type="number" class="mt-0 pt-0"
                  style="width: 100px"></v-text-field>
              </template>
            </v-range-slider>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-end">
            <v-btn color="primary" @click="applyFilters">應用篩選</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(product, index) in products" :key="index" cols="12" sm="6" md="4" lg="3">
            <product-card :product="product" @navigate="navigateToProduct" @add-to-cart="addProductToCart"
              @toggle-wishlist="toggleWishlist"></product-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  props: ['category'],
  created() {
    this.fetchProducts(this.category);
    this.fetchWishlist(); // Fetch the wishlist on creation
  },
  data() {
    return {
      range: [0, 99999],
      minPrice: 0.0,     // 最小價格
      maxPrice: 999999.99,// 最大價格
      // 這裡保留與產品列表和篩選功能相關的數據
      products: [],
      currentPage: 1,
      totalPages: 1,
      priceFilter: false,
      // 願望清單彈跳
      snackbar: false, // 控制Snackbar顯示的變量
      snackbarText: '', // 顯示在Snackbar中的消息
      snackbarColor: '', // Snackbar的顏色
      // 購物車彈跳
      wishlistSnackbar: false,
      wishlistSnackbarText: '',
      wishlistSnackbarColor: '',
      wishlist: [],
      selectedProductDetails: null, // 用於存儲從後端獲取的產品詳情
      selectedproductname: null, // 新增用於存儲選擇的產品名稱
    };
  },
  methods: {
    applyFilters() {
      const [minPrice, maxPrice] = this.range;
      this.fetchProducts(this.selectedproductname, minPrice, maxPrice);
    },
    fetchWishlist() {
      axios.get("http://localhost:8080/customer/api/wishlist")
        .then(response => {
          // Assuming response.data is the array of WishlistDTO objects
          this.wishlist = response.data;
          // Update the products' inWishlist status
          this.products.forEach(product => {
            product.inWishlist = this.wishlist.some(w => w.productid === product.productid);
          });
        })
        .catch(error => {
          console.error("Error fetching wishlist:", error);
        });
    },
    fetchProducts(productname, minPrice = 0, maxPrice = 99999) {
      const page = this.currentPage || 1;
      if (this.selectedproductname !== productname) {
        this.currentPage = 1;
        this.selectedproductname = productname;
      }
      axios
        .get("http://localhost:8080/public/api/products", {
          params: {
            productname: productname || null,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: page
          }
        })
        .then((response) => {
          // 處理響應
          this.products = response.data.content || [];
          this.totalPages = response.data.totalPages || 1;
          this.currentPage = response.data.pageable?.pageNumber + 1 || 1;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          // 處理錯誤
          this.products = [];
          this.totalPages = 1;
        });
    },

    showLargeAppliances() {
      this.showLargeAppliances = true;
    },

    //添加跳轉頁面到productPage
    navigateToProduct(product) {
      console.log('Navigating to product with ID:', product.productId);
      const productId = product.productId;
      if (!productId) {
        console.error('Product ID is undefined.');
        return;
      }
      this.$router.push({ name: 'ProductPage', params: { productId: productId } });
    },


    //添加商品到購物車
    addProductToCart(product) {
      console.log('Adding product to cart with ID:', product.productId); // Corrected to productId
      axios
        .post('http://localhost:8080/customer/api/shoppingCart', null, { // 如果您的API期待URL參數，這裡應該是null或者空對象
          params: {
            productId: product.productId,
          }
        }, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
          console.log('Add to cart response:', response); // Add this
          // 成功添加到購物車後的操作，比如通知用戶

          Swal.fire({
            icon: "success",
            title: "商品已加入購物車",
            showConfirmButton: false,
            timer: 1000
          })

          this.snackbarText = '商品已成功加入購物車';
          this.snackbarColor = 'success'; // 成功消息使用綠色
          this.snackbar = true; // 顯示Snackbar
          // 如果需要，這裡還可以添加其他UI更新或邏輯處理
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

    //願望清單
    addProductToWishlist(productId) {
      // 发送 POST 请求到后端 API
      axios
        .post(`http://localhost:8080/customer/api/wishlist/${productId}`)
        .then(response => {
          // 检查响应状态码
          if (response.status === 200) {
            // 成功添加到愿望清单后的操作
            alert('成功添加到愿望清单');
            this.updateWishlistStatus(productId, true);
          } else {
            // 如果状态码不是200，不执行任何操作
            console.error('Product was not added to wishlist. Status code:', response.status);
          }
        })
        .catch(error => {
          // 处理错误
          console.error('Error adding product to wishlist:', error);
          alert('无法添加商品到愿望清单。');
        });
    },


    updateWishlistStatus(productid, status) {
      // 找到产品并更新其 inWishlist 状态
      const productIndex = this.products.findIndex(p => p.id === productid);
      if (productIndex !== -1) {
        this.$set(this.products[productIndex], 'inWishlist', status);
      }
    },

    // Toggle wishlist status
    toggleWishlist(product) {
      console.log('Toggling wishlist for product with ID:', product.productId); // Corrected to productId
      if (product.inWishlist) {
        // Call the backend to remove the product from the wishlist
        axios.delete(`http://localhost:8080/customer/api/wishlist/${product.productid}`)
          .then(response => {
            // Assuming the API returns the removed product information
            if (response.status === 200) {
              this.snackbarText = '已從願望清單移除';
              this.snackbarColor = 'success';
              this.fetchWishlist(); // Refresh the wishlist from the backend
            } else {
              throw new Error('Failed to remove from wishlist');
            }
          })
          .catch(error => {
            console.error("Error removing product from wishlist:", error);
            this.snackbarText = '無法從願望清單移除商品';
            this.snackbarColor = 'error';
            this.snackbar = true;
          });
      } else {
        // Call the backend to add the product to the wishlist
        // You would need to have an endpoint for adding as well, similar to the delete
        axios.post(`http://localhost:8080/customer/api/wishlist/${product.productid}`)
          .then(() => {
            this.snackbarText = '已加入願望清單';
            this.snackbarColor = 'success';
            this.fetchWishlist(); // Refresh the wishlist from the backend
          })
          .catch(error => {
            console.error("Error adding product to wishlist:", error);
            this.snackbarText = '無法加入願望清單';
            this.snackbarColor = 'error';
            this.snackbar = true;
          });
      }
    },

    created() {
      this.fetchProducts(this.$route.query.search);
      this.fetchWishlist();
    },


    // 評價
    fetchAverageReview(productid) {
      axios
        .get(`http://localhost:8080/public/api/reviews/product/${productid}/average`, {
          params: {
            // 其他需要傳遞的查詢參數
            otherParam: 'value'
          }
        })
        .then(response => {
          const productIndex = this.products.findIndex(p => p.productid === productid);
          if (productIndex !== -1) {
            this.products[productIndex].averageReview = response.data.average;
          }
        })
        .catch(error => {
          console.error("Error fetching products:", error);
          // 錯誤處理，比如設置默認值或顯示錯誤消息
        });

    },


  }
};
</script>

<style>
.smaller-card {
  max-width: 200px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.product-image {
  width: 100%;
  /* 使用百分比確保圖片寬度對應到卡片寬度 */
  height: 200px;
  /* 固定高度 */
  object-fit: cover;
  /* 覆蓋或包含圖片以適應給定的框架，可能的值還有 contain, cover, fill 等 */
  margin-right: auto;
  /* 移除 mr-2 並使用自動外邊距確保居中顯示 */
  margin-left: auto;
}

.v-card-title {
  word-wrap: break-word;
  /* 允許在單詞邊界自動換行 */
  overflow-wrap: break-word;
  /* 允許在任意字符之間自動換行 */
  max-width: 100%;
  white-space: normal;
  /* 允許文字換行 */
  line-height: 1.2;
  /* 調整行高以適應多行文本 */
}

.product-name {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  white-space: normal;
  line-height: 1.2;
  text-align: center;
  /* 確保文字居中對齊 */
}


.special-price {
  font-size: 1.2em;
  /* 特價放大 */
  color: red;
  /* 紅字顯示 */
}

.original-price {
  /* 原價正常顯示 */
}

.text-decoration-line-through {
  text-decoration: line-through;
  /* 加上刪除線 */
}

.red--text {
  --v-theme-foreground: #ff5252;
  /* This is an example, adjust the color to fit your theme */
}

.text--accent-4 {
  color: var(--v-theme-foreground);
  /* Use the defined accent color */
}

.no-background::before {
  background: transparent !important;
}

.card-actions {
  position: relative;
  /* 確保卡片有足夠的高度，否則圖示可能會超出卡片範圍 */
  min-height: 48;
  /* 或者根據需要調整 */
}

.wishlist-btn {
  position: absolute;
  bottom: 16px;
  /* 距離卡片底部的距離，根據需要調整 */
  right: 16px;
  /* 距離卡片右側的距離，根據需要調整 */
  z-index: 2;
  /* 確保按鈕在卡片之上 */
}

.v-card {
  margin-bottom: 24px;
  /* 或者根據需要調整，以提供足夠的空間 */

}

.category-bar {
  border: 1px solid #ddd;
  /* 給分類按鈕外圍加上邊框 */
  padding: 8px;
  /* 內部間距 */
  margin-bottom: 16px;
  /* 與下面內容的間距 */
}

.clickable-card {
  cursor: pointer;
}
</style>
