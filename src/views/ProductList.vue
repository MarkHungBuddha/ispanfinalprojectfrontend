<script setup>
import Swal from 'sweetalert2';
import Sidebar from "@/components/sidebar.vue";
</script>

<template>
  <v-app>
    <v-main>

      <v-container>

        <v-row style="max-width: 500px">
          <!-- 價格範圍滑塊和應用篩選按鈕在同一行 -->
          <v-col>
            <v-range-slider v-model="range" :max="99999" :min="0" :step="1" hide-details class="align-center">
              <!-- 使用 v-slot 來插入文本框 -->
              <template v-slot:prepend>
                <span class="slider-prepend-text">價格搜索 </span>

                <v-text-field v-model="range[0]" hide-details dense outlined type="number" class="mt-0 pt-0"
                  style="width: 90px"></v-text-field>
              </template>
              <template v-slot:append>
                <v-text-field v-model="range[1]" hide-details dense outlined type="number" class="mt-0 pt-0"
                  style="width: 90px"></v-text-field>
                <!-- 在這裡添加放大鏡圖示按鈕 -->
                <v-btn @click="applyFilters" icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-range-slider>
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
    this.fetchWishlist(); // 取得創建時的願望清單
  },
  data() {
    return {
      range: [0, 99999],
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
    };
  },
  watch: {
    category(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchProducts(newVal);
      }
    }
  },
  methods: {
    applyFilters() {
      // 使用範圍滑塊的值作為價格篩選的標準
      const [minPrice, maxPrice] = this.range;
      this.fetchProducts(this.selectedCategoryName, minPrice, maxPrice);
    },

    fetchProducts(categoryName, minPrice = 0, maxPrice = 99999) {
      if (this.selectedCategoryName !== categoryName) {
        this.currentPage = 1;
        this.selectedCategoryName = categoryName;
      }

      axios
        .get("http://localhost:8080/public/api/categoryname", {
          params: {
            categoryname: categoryName,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: this.currentPage,
            pageSize: 4,
          },
        })
        .then((response) => {
          if (response.data && response.data.content && response.data.content.length > 0) {
            this.products = response.data.content;
            this.products.forEach(product => {
              product.inWishlist = localStorage.getItem(product.productid) === 'true';
              if (product && product.productid) {
                this.fetchAverageReview(product.productid);
              }
            });
            this.totalPages = response.data.totalPages;

            // 循環調用fetchAverageReview為每個產品獲取平均評價

          } else {
            // 如果返回的內容為空，則清空產品列表並設置總頁數為1
            this.products = [];
            this.totalPages = 1;
            // 可以在這裡添加一個用戶提示，告知沒有找到產品
            // alert('沒有找到產品。');
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          // 處理錯誤情況，如API呼叫失敗等
          this.products = [];
          this.totalPages = 1;
          // 提示用戶檢查錯誤
          // alert('檢索產品時發生錯誤。');
        });
    },

    showLargeAppliances() {
      this.showLargeAppliances = true;
    },

    //添加跳轉頁面到productPage
    navigateToProduct(productid) {
      console.log('Product ID:', productid); // 確認 productid 的值
      if (!productid) {
        console.error('Product ID is undefined.'); // 如果 productid 為 undefined，記錄錯誤
        return;
      }
      this.$router.push({ name: 'ProductPage', params: { productId: productid } });
    },


    //添加商品到購物車
    addProductToCart(productid) {

      axios
        .post('http://localhost:8080/customer/api/shoppingCart', null, { // 如果您的API期待URL參數，這裡應該是null或者空對象
          params: {
            productId: productid,
          }
        }, {
          headers: { 'Content-Type': 'application/json' }
        })

        //加入購物車提示窗
        .then(response => {
          // 成功添加到購物車後的操作，比如通知用戶
          this.snackbarText = '商品已成功加入購物車';
          this.snackbarColor = 'success'; // 成功消息使用綠色
          this.snackbar = true; // 顯示Snackbar
          // 如果需要，這裡還可以添加其他UI更新或邏輯處理
          Swal.fire({
            icon: "success",
            title: "商品已加入購物車",
            showConfirmButton: false,
            timer: 1000
          })
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
            //提示窗
            Swal.fire({
              icon: "warning",
              title: "商品庫存不足，無法加入購物車",
              showConfirmButton: false,
              timer: 1000
            })
          } else {
            // 服务器没有响应
            //提示窗
            Swal.fire({
              icon: "error",
              title: "伺服器異常，請聯絡客服!",
              showConfirmButton: false,
              timer: 1000
            })
            this.snackbarText = 'Error: Server did not respond';
          }
        });
    },

    //願望清單
    addProductToWishlist(productId) {
      // 傳送 POST 請求到後端 API
      axios
        .post(`http://localhost:8080/customer/api/wishlist/${productId}`)
        .then(response => {
          // 檢查回應狀態碼
          if (response.status === 200) {
            // 成功加入願望清單後的操作
            alert('成功添加到愿望清单222');
            this.updateWishlistStatus(productId, true);
          } else {
            // 如果狀態碼不是200，不執行任何動作
            console.error('Product was not added to wishlist. Status code:', response.status);
          }
        })
        .catch(error => {
          // 處理錯誤
          console.error('Error adding product to wishlist:', error);
          alert('无法添加商品到愿望清单。');
        });
    },
    //1
    fetchWishlist() {
      axios.get("http://localhost:8080/public/api/wishlist")
        .then(response => {
          // 假設 response.data 是一個包含願望清單 DTO 對象的陣列
          this.wishlist = response.data; // 將獲取到的數據賦值給 wishlist
          // 檢查該產品是否在願望清單中
          this.products.forEach(product => {
            product.inWishlist = this.wishlist.some(w => w.productid === product.productid);
          });
        })
        .catch(error => {
          console.error("Error fetching wishlist:", error);
        });
    },

    updateWishlistStatus(productid, status) {
      // 找到產品並更新其 inWishlist 狀態
      const productIndex = this.products.findIndex(p => p.id === productid);
      if (productIndex !== -1) {
        this.$set(this.products[productIndex], 'inWishlist', status);
      }
    },
    //2
    // 切換產品在願望清單中的狀態
    toggleWishlist(product) {
      if (product.inWishlist) {
        // 如果產品已在願望清單中，呼叫後端 API 進行移除操作
        axios.delete(`http://localhost:8080/customer/api/wishlist/${product.productid}`)
          .then(response => {
            // 假設 API 返回已移除的產品資訊
            if (response.status === 200) {
              this.snackbarText = '已從願望清單移除'; // 設置成功提示信息
              this.snackbarColor = 'success'; // 設置提示條的顏色為成功（綠色）
              this.fetchWishlist(); // 從後端重新獲取願望清單以更新狀態
            } else {
              throw new Error('Failed to remove from wishlist'); // 若移除失敗，拋出錯誤
            }
          })
          .catch(error => {
            console.error("Error removing product from wishlist:", error);
            this.snackbarText = '無法從願望清單移除商品';
            this.snackbarColor = 'error';
            this.snackbar = true; // 顯示提示條
          });
      } else {
        // 如果產品不在願望清單中，呼叫後端 API 進行添加操作
        axios.post(`http://localhost:8080/customer/api/wishlist/${product.productid}`)
          .then(() => {
            this.snackbarText = '已加入願望清單';
            this.snackbarColor = 'success';
            this.fetchWishlist(); // 從後端重新獲取願望清單以更新狀態
          })
          .catch(error => {
            console.error("Error adding product to wishlist:", error);
            this.snackbarText = '無法加入願望清單';
            this.snackbarColor = 'error';
            this.snackbar = true;
          });
      }
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

<style >
.slider-prepend-text {
  margin-right: 8px;
  /* 添加適當的空間 */
  font-size: 2rem;
  /* 增加字體大小 */
}

.v-application {
  /* 將漸層方向改為從上到下 */
  background-image: linear-gradient(to bottom, #e2d0b6, #cabae6);

}

.range {
  max-width: 500px;
}

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
  font-size: 1em !important;
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
  /* 設定自定義CSS變量 --v-theme-foreground 為鮮紅色 (#ff5252) */
}

.text--accent-4 {
  color: var(--v-theme-foreground);
  /* 使用前面定義的 --v-theme-foreground 變量作為文字顏色 */
}

.no-background::before {
  background: transparent !important;
  /* 對有 .no-background 類別的元素，其 ::before 偽元素的背景設定為透明，!important 確保覆蓋其他任何相關的背景設定 */
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



