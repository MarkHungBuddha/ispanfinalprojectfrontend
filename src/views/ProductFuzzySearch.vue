<template>
  <v-container>

    <!-- 範圍滑塊容器 -->
    <v-row class="scope">
      <v-col cols="12">
        <v-range-slider v-model="priceRange" :max="maxPrice" :min="minPrice" :step="1" hide-details class="align-center">
          <template v-slot:prepend>
            <v-text-field v-model="priceRange[0]" hide-details single-line type="number" variant="outlined"
              density="compact" style="width: 90px"></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field v-model="priceRange[1]" hide-details single-line type="number" variant="outlined"
              style="width: 90px" density="compact"></v-text-field>
            <!-- 放大鏡圖示按鈕 -->
            <v-btn @click="applyPriceFilter" icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>

    <!-- 循環顯示產品 -->
    <v-row>
      <v-col v-for="product in products" :key="product.productId" cols="12" sm="6" md="4" lg="3">
        <v-card class="clickable-card" @click="navigateToProduct(product.productId)">
          <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" class="product-image" aspect-ratio="1.7"></v-img>
          <v-card-title>{{ product.productName }}</v-card-title>
          <v-card-text>
            <div class="original-price" :class="{ 'text-decoration-line-through': product.specialPrice < product.price }">
              原價: {{ product.price | currency }}
            </div>
            <div v-if="product.specialPrice && product.specialPrice < product.price" class="special-price red--text">
              特價: {{ product.specialPrice | currency }}
            </div>
          </v-card-text>
          <v-card-actions class="action-buttons">
            <v-btn color="success" @click.stop="addProductToCart(product.productId)">加入購物車</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="toggleWishlist(product)">
              <v-icon :color="product.inWishlist ? 'pink' : 'grey'">mdi-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios'; // 在這裡導入 axios

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
        wishlistStatus: {}, // 存储产品ID及其愿望清单状态
        priceRange: [], // 確保這裡的初始值是數組


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
    '$route.query.search': function (newVal) {
      this.searchText = newVal || '';
      this.currentPage = 1; // 重置为第一页
      this.fetchProducts();
    },
    currentPage: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchProducts();
      }
    },
    // 添加 priceRange 的監聽器
    priceRange: {
      handler(newVal, oldVal) {
        // 只有當價格範圍真的變化了才重新抓取產品
        if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
          this.fetchProducts();
        }
      },
      deep: true
    },
  },

  // 當前組件創建時的生命周期鉤子
  created() {
    // 當組件被創建時，檢查 URL 查詢參數並執行搜索
    this.searchText = this.$route.query.search || '';
    // 确保 priceRange 已经定义
    this.priceRange = this.priceRange || [0, 999999];

    // 只有在 priceRange 有具体值时才调用 fetchProducts
    if (this.searchText && this.priceRange.length > 1) {
      this.fetchProducts();
    }
  },


  mounted() {
    console.log('Products on mounted:', this.products);
    // 或者更詳細地檢查每個產品的ID
    this.products.forEach((product, index) => {
      console.log(`Product ${index} ID:`, product.productid);
    });
  },
  methods: {

    applyFilters() {
      this.fetchProducts(this.selectedProductname);
      this.fetchProducts();

    },
    applyPriceFilter() {
      // 呼叫 fetchProducts 並傳遞當前的 priceRange 作為參數
      this.fetchProducts(this.priceRange);
    },

    // 範圍搜尋
    someMethod() {
      if (this.priceRange && this.priceRange.length > 1) {
        // 現在可以安全地訪問 this.priceRange[0] 和 this.priceRange[1]
      }
    },
    fetchData() {
      fetch('some-api')
        .then(response => response.json())
        .then(data => {
          this.someData = data;

          this.$nextTick(() => {
            // 確保 Vue 更新了 DOM
          });
        });
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
    // 從後端獲取產品數據
    fetchProducts() {
      console.log('开始 fetchProducts 方法');
      // 检查 priceRange 是否已定义
      if (!this.priceRange || this.priceRange.length < 2) {
        console.error('priceRange 未定义或不完整');
        this.loading = false;
        // 这里可以设置默认值或者返回以阻止方法继续执行
        // 例如：this.priceRange = [0, 9999999];
        return;
      }

      this.loading = true;
      // 根據當前的 options 更新查詢參數
      const params = {
        productname: this.searchText.trim(), // 這裡使用searchText而不是options.productname
        minPrice: this.priceRange[0],
        maxPrice: this.priceRange[1],
        page: this.currentPage,
        itemsPerPage: 5, // 或者其他你希望每页显示的数量
      };

      axios.get('http://localhost:8080/public/api/products', { params })

        .then(response => {
          // 确保响应中有数据并且包含产品内容
          if (response.data && response.data.content) {
            this.products = response.data.content.map(product => {
              // 确保产品有 productid 属性
              if (product && product.productid !== undefined) {
                // 安全地检查产品ID是否在 wishlistStatus 中
                product.inWishlist = !!this.wishlistStatus[product.productid];
              } else {
                // 如果 product 或 product.productid 是 undefined，设置一个默认值
                product.inWishlist = false;
              }
              return product;
            }).filter(p => p); // 使用 filter() 移除所有 null 值
            // 更新分頁相關的狀態;

            // 更新分页总数
            this.totalPages = response.data.totalPages;
            // 更新总产品数量
            this.totalProducts = response.data.totalElements;

            // 这里可以添加任何其他状态更新，例如：
            // this.someOtherStatus = response.data.someOtherField;

          } else {
            // 如果响应中没有内容或格式不正确，则设置默认值
            this.products = [];
            this.totalPages = 0;
            this.totalProducts = 0;
            // 可以在这里显示一个错误消息，告知用户数据加载失败
            console.error('API 响应缺少内容或格式不正确');
          }
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

    // 加入購物車方法
    addProductToCart(productId) {
      axios.post(`http://localhost:8080/customer/api/shoppingCart?productId=${productId}`)
        .then(response => {
          this.showSnackbar('商品已成功加入购物车。', 'success');
        })
        .catch(error => {
          this.showSnackbar('无法添加商品到购物车。', 'error');
          console.error('Error adding product to cart:', error);
        });

    },


    //願望清單
    addProductToWishlist(productId) {
      // 首先，找到相应的产品
      const product = this.products.find(p => p.productId === productId);
      if (!product) {
        console.error('Product ID is undefined.');
        this.showSnackbar('商品ID未指定或不正確。', 'error');
        return;
      }
      const newStatus = !product.inWishlist;

      // 发送 POST 请求到后端 API
      axios.post(`http://localhost:8080/customer/api/wishlist/${productId}`, {}, {
        withCredentials: true // 這樣可以确保携带认证信息，例如cookies
      })
        .then(response => {
          // 更新產品在愿望清单的状态
          this.updateWishlistStatus(productId, true);
          this.showSnackbar('商品已加入愿望清单', 'success');
        })
        .catch(error => {
          console.error('添加到愿望清单时发生错误:', error);
          this.showSnackbar('添加到愿望清单时发生错误', 'error');
        });

    },

    // 切换愿望清单状态
    toggleWishlist(product) {
      axios.post(`http://localhost:8080/customer/api/wishlist/${product.productId}`)
        .then(response => {
          product.inWishlist = !product.inWishlist;
          this.showSnackbar('愿望清单状态已更新。', 'success');
        })
        .catch(error => {
          this.showSnackbar('无法更新愿望清单状态。', 'error');
          console.error('Error toggling wishlist status:', error);
        });
    },
    // 更新愿望清单状态
    updateWishlistStatus(productId, status) {
      const productIndex = this.products.findIndex(p => p.productId === productId);
      if (productIndex !== -1) {
        this.$set(this.products[productIndex], 'inWishlist', status);
      }
    },
    //添加跳轉頁面到productPage
    navigateToProduct(productId) {
      this.$router.push({ name: 'ProductPage', params: { productId: productId } });
    },

  },
}

</script>

<style scoped>
.scope {
  max-width: 500px;
}

.product-image {
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
  /* 當鼠標懸停時輕微放大 */
}

.clickable-card {
  cursor: pointer;
}

.product-name {
  font-size: 1.2em;
  color: #424242;
  font-weight: bold;
  margin: 10px 0;
}

.special-price .red--text {
  color: #ff5252;
  font-weight: bold;
  font-size: 1.0rem;
  /* 特價的字體略大於原價 */
  margin-top: 5px;
  /* 頂部間距 */
  margin-bottom: 5px;
  /* 底部間距，提供一定的空間到按鈕 *
}

.original-price {
  color: #757575;
  /* 淺灰色，與背景形成對比 */
  font-size: 0.8rem;
  /* 較小的字體大小 */
  margin-top: 5px;
  /* 頂部間距 */
  margin-bottom: 0;
  /* 底部間距，可以根據需要調整 */
}

.text-decoration-line-through {
  text-decoration: line-through;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  /* 根據需求調整內邊距 */

}

.action-buttons {
  display: flex;
  justify-content: space-between;
}


.wishlist-btn {
  margin-left: auto;
}

.v-btn {
  border-radius: 4px;
}

.v-btn.success {
  background-color: #4CAF50;
  /* 綠色按鈕 */
  color: white;
}

.v-btn.success:hover {
  background-color: #66BB6A;
  /* 淺綠色 */
}

.v-icon {
  transition: color 0.3s ease;
}

/* 星號評價圖標 */
.v-icon.rating {
  color: #FFD700;
  /* 金色 */
}

/* 心形按鈕的動態樣式 */
.mdi-heart {
  transition: color 0.2s ease-in-out;
}

.mdi-heart:hover {
  color: #F48FB1;
  /* 淺紅色 */
}

/* 確保卡片本身都是相同高度 */
.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;

}

/* 圖像、標題和內容區域應該填充父元素並允許動作欄固定在底部 */
.v-card-title,
.v-card-text {
  flex: 1;
  margin-bottom: 10px;
}

/* 商品名稱過長時使用... */
.product-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制在兩行 */
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  /* 調整行高，確保足夠空間顯示兩行 */
  max-height: 2.4em;
  /* 行高的兩倍，保證能顯示兩行 */
  margin: 0;
  padding: 0 10px;
  font-size: 0.8rem;
  /* 如有需要，可以調小字體大小 */
  padding: 5px 10px;
  /* 增加上下的內邊距可以為文字提供更多空間 */

}
</style>
