<template>
  <v-app>
    <v-main>
      <v-container>



        <v-row class="category-bar">
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">行動通訊</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(title, index) in items" :key="index" @click="fetchProducts(title)">
                    <v-list-item-title>{{ title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">大型家電</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(appliance, index) in appliances" :key="index" @click="fetchProducts(appliance)">
                    <v-list-item-title>{{ appliance }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">電腦資訊</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(info, index) in computerInfo" :key="index" @click="fetchProducts(info)">
                    <v-list-item-title>{{ info }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">電腦周邊</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(computerPeripheral, index) in computerPeripherals" :key="index"
                    @click="fetchProducts(computerPeripheral)">
                    <v-list-item-title>{{ computerPeripheral }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">小型家電</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(smallAppliance, index) in smallAppliances" :key="index"
                    @click="fetchProducts(smallAppliance)">
                    <v-list-item-title>{{ smallAppliance }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">視聽娛樂</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(entertainment, index) in entertainments" :key="index"
                    @click="fetchProducts(entertainment)">
                    <v-list-item-title>{{ entertainment }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col>
            <div class="text-center">
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="#008080" v-bind="props" @mouseenter="showItems">辦公耗材</v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(officeSupply, index) in officeSupplies" :key="index"
                    @click="fetchProducts(officeSupply)">
                    <v-list-item-title>{{ officeSupply }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-divider class="my-4"></v-divider> <!-- 分割線並給予上下邊距 -->

          <!-- 畫面呈現區 -->
          <v-row>

            <v-col v-for="(product, index) in products" :key="index" class="product-col">


              <v-card class="product-card">
                <v-card-text class="d-flex flex-column align-center">
                  <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                    class="product-image mr-2" @click="navigateToProduct(product.productid)"></v-img>
                  <div class="product-name">{{ product.productname }}</div>
                  <div class="original-price">原價: {{ product.price }}</div>
                  <div v-if="product.specialprice > 0" class="special-price">特價: {{ product.specialprice }}</div>

                  <div v-if="product.averageReview">
                    平均評價: {{ product.averageReview.toFixed(2) }}
                  </div>


                  <v-btn color="success" @click="addProductToCart(product.productid)">加入購物車</v-btn>
                  <!-- 加入購物車的彈跳提示 -->
                  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
                    {{ snackbarText }}
                    <v-btn color="white" text @click="snackbar = false">關閉</v-btn>
                  </v-snackbar>

                  <!-- 心形圖示按鈕 -->
                  <v-btn icon flat class="wishlist-btn" @click="toggleWishlist(product)">
                    <v-icon :color="product.inWishlist ? 'pink' : 'black'">mdi-heart</v-icon>
                  </v-btn>
                  <!-- 願望清單的彈跳提示 -->
                  <v-snackbar v-model="wishlistSnackbar" :color="wishlistSnackbarColor" timeout="3000">
                    {{ wishlistSnackbarText }}
                    <v-btn color="white" text @click="wishlistSnackbar = false">關閉</v-btn>
                  </v-snackbar>


                  <div v-if="selectedProductDetails">
                    <h2>{{ selectedProductDetails.productname }}</h2>
                    <p>{{ selectedProductDetails.description }}</p>
                    <!-- 其他需要顯示的產品信息 -->
                  </div>


                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-row>

        <!-- 分頁控件 -->
        <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>

        <!-- <v-row>
          <v-col cols="300" sm="4">
            <v-switch v-model="priceFilter" label="啟用價格範圍過濾"></v-switch>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="minPrice" label="最小價格" type="number" :disabled="!priceFilter" min="0"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="maxPrice" label="最大價格" type="number" :disabled="!priceFilter" min="0"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-end">
            <v-btn color="primary" @click="applyFilters">應用篩選</v-btn>
          </v-col>
        </v-row> -->



      </v-container>
    </v-main>
  </v-app>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedCategory: "",
      selectedCategoryName: "",
      selectedCategoryImagepath: "",
      selectedCategoryPrice: 0,
      selectedCategorySpecialPrice: 0,
      showPriceAndSpecialPrice: false,

      products: [],
      items: ['行動電源_手機配件', '相機配件', '行車導航', '手機', '相機_攝影', '穿戴裝置', '平板電腦'],

      appliances: ['洗衣機', '乾衣機', '冷氣', '冰箱'],
      computerInfo: [
        '筆記型電腦', '主機板', '記憶體', '光碟機',
        '機殼', '散熱風扇', '顯示卡', '硬碟_SSD',
        '桌上型電腦', '電供_線材', '軟體'
      ],
      computerPeripherals: ['外接擴充', '鍵鼠週邊', '線材_接頭', '列印掃描', '電腦耳機_喇叭', '影像輸入裝置', '儲存裝置', '電源周邊', '網路裝置'],
      smallAppliances: ['耳機_喇叭', '生活家電', '廚房家電', '健康家電', '季節家電', '烹調家電', '家電配備'],
      entertainments: ['音樂_錄音', '電視配件', '電視遊樂器', '喇叭音響', '液晶電視', '投影機周邊', '視聽播放', '視聽配件'],
      officeSupplies: ['墨水碳粉色帶', '光碟片', '工具', '紙材', '辦公OA設備'],

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

      selectedProductDetails: null, // 用於存儲從後端獲取的產品詳情


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
    this.products.forEach(product => {
      product.inWishlist = localStorage.getItem(product.productid) === 'true';
    });
  },

  methods: {
    applyFilters() {
      this.fetchProducts(this.selectedCategoryName);
    },
    fetchProducts(categoryName) {
      if (this.selectedCategoryName !== categoryName) {
        this.currentPage = 1;
        this.selectedCategoryName = categoryName;
      }

      axios
        .get("http://localhost:8080/public/api/categoryname", {
          params: {
            categoryname: categoryName,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            page: this.currentPage,
            pageSize: 5,
          },
        })
        .then((response) => {
          if (response.data && response.data.content && response.data.content.length > 0) {
            this.products = response.data.content;
            this.products.forEach(product => {
              product.inWishlist = localStorage.getItem(product.productid) === 'true';
              if (product && product.productId) {
                this.fetchAverageReview(product.productId);
              }
            });
            this.totalPages = response.data.totalPages;

            // 循環調用fetchAverageReview為每個產品獲取平均評價

          } else {
            // 如果返回的內容為空，則清空產品列表並設置總頁數為1
            this.products = [];
            this.totalPages = 1;
            // 可以在這裡添加一個用戶提示，告知沒有找到產品
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
        .then(response => {
          // 成功添加到購物車後的操作，比如通知用戶
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
    },

    // 評價
    fetchAverageReview(productId) {
      axios
        .get(`http://localhost:8080/public/api/reviews/product/${productId}/average`, {
          params: {
            // 其他需要傳遞的查詢參數
            otherParam: 'value'
          }
        })
        .then(response => {
          const productIndex = this.products.findIndex(p => p.productid === productId);
          if (productIndex !== -1) {
            this.$set(this.products[productIndex], 'averageReview', response.data.average);
          }
        })
        .catch(error => {
          console.error("Error fetching products:", error);
          // 錯誤處理，比如設置默認值或顯示錯誤消息
        });

    },


    updateProductAverageReview(productId, averageReview) {
      const productIndex = this.products.findIndex(p => p.productid === productId);
      if (productIndex !== -1) {
        this.$set(this.products[productIndex], 'averageReview', averageReview);
      }
    },






  },

};
</script>
  
<style>
/* 去除行和列的内边距和外边距 */
.v-row,
.v-col {
  margin: 0 !important;
  padding: 0 !important;
}

.product-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* 商品卡片样式 */
.product-card {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 !important;
  /* 移除外边距 */
  width: 100%;
  /* 卡片宽度设置为100% 列的宽度 */
  height: auto;
  /* 高度自适应内容 */
}

.product-card-spacing {
  margin-left: 4px;
  /* 减少左外边距 */
  margin-right: 4px;
  /* 减少右外边距 */
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

/* 根据固定大小调整图片样式 */
.product-image {
  width: 100%;
  /* 图片宽度与卡片相同 */
  height: 100px;
  /* 指定一个固定高度 */
  object-fit: cover;
  /* 图片覆盖整个可用空间，可能会被裁剪 */
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
  text-align: center;
  margin-top: auto;
  /* 在flex容器中推动元素向下对齐 */
  margin-bottom: auto;
  /* 在flex容器中推动元素向上对齐 */
}

.original-price {
  text-decoration: line-through;
  /* 加上刪除線 */
}

.special-price {
  color: red;
  /* 設定文字顏色為紅色 */
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
  top: 8px;
  /* 或者根据需要调整 */
  right: 1px;
  /* 或者根据需要调整 */
  z-index: 1;
  /* 保证按钮在卡片内容之上 */
  z-index: 1;
  /* 保证按钮在内容上方 */
  padding: 4px;
  /* 减小内边距减小按钮大小 */
  border-radius: 0%;

}

.v-card {
  width: 300px;
  /* 指定固定宽度 */
  height: 350px;
  /* 指定固定高度 */
  margin-bottom: 8px;
  /* 保留一些底部间隙 */
  overflow: hidden;
  /* 隐藏溢出的内容 */

  display: flex;
  /* 使用flex布局，以便内部元素可以使用flex-grow等属性 */
  flex-direction: column;
  /* 子元素垂直排列 */
}

.category-bar {
  border: 1px solid #ddd;
  /* 給分類按鈕外圍加上邊框 */
  padding: 6px;
  /* 內部間距 */
  margin-bottom: 16px;
  /* 與下面內容的間距 */
}

.work-area {
  display: flex;
  justify-content: center;
  /* 水平置中 */
  align-items: center;
  /* 垂直置中 */
  height: 100vh;
  /* 可視視窗高度 */
}

/* 如果工作區內有多個元素並且只希望按鈕置中 */
.button-container {
  display: flex;
  justify-content: center;
  /* 水平置中 */
  align-items: center;
  /* 垂直置中 */
  height: 100%;
  /* 父容器高度 */
}

.product-card {
  /* ... 其他样式保持不变 ... */
  position: relative;
  /* 为了绝对定位的 .wishlist-btn 提供参照 */
}

.v-btn {
  padding: 12px 30px;
  /* 增加內邊距 */
  font-size: 16px;
  /* 調整字體大小，根據需要調整 */
  min-width: 120px;
  /* 設定最小寬度 */
  min-height: 48px;
  /* 設定最小高度 */
  margin-top: auto;
  /* 上邊距自動 */
  margin-bottom: auto;
  /* 下邊距自動 */
  white-space: nowrap;
  /* 防止文字換行 */
  overflow: hidden;
  /* 隱藏超出按鈕範圍的文字 */
  text-overflow: ellipsis;
  /* 超出部分顯示為省略號 */
}
</style>
  