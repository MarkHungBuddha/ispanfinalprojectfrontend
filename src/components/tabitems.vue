<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- 每日新發現標題 -->
        <v-row>
          <v-col>
            <div class="raised-box">
              <h1 class="display-1">每日新發現</h1>
            </div>
          </v-col>
        </v-row>

        <!-- 分類列表和商品卡片區 -->
        <v-row no-gutters>
          <!-- 分類列表區 -->
          <v-col cols="12" md="2" class="card0">
            <div class="category-section">
              <v-list>
                <!-- 循環渲染分類列表 -->
                <v-list-item v-for="category in categories" :key="category" @click="selectCategory(category)">
                  <v-list-item-content>
                    <v-list-item-title>{{ category }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-col>

          <!-- 商品卡片的工作区 -->
          <v-col cols="12" md="10">
            <v-row no-gutters>
              <v-col v-for="(product, index) in displayedProducts" :key="index" cols="12" sm="6" md="3" lg="3"
                class="card2">
                <ProductCard :product="product" @navigate="navigateToProduct"></ProductCard>
              </v-col>

            </v-row>
          </v-col>
        </v-row>

        <!-- 猜你喜歡區域 -->
        <v-row>
          <v-col>
            <div class="raised-box">
              <h1 class="display-1">猜你喜歡</h1>
            </div>
          </v-col>
        </v-row>

        <!-- 猜你喜歡商品卡片 -->
        <v-row no-gutters>
          <v-col v-for="(product, index) in productsContainingA" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-2">
            <v-card>
              <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image" class="product-image"
                @click="navigateToProduct(product.productId)"></v-img>
              <v-card-title class="product-name">{{ product.productName }}</v-card-title>
              <v-card-text>
                <div v-if="product.specialPrice && product.specialPrice > 0" class="special-price">
                  特價: <span class="red--text text--accent-4">{{ product.specialPrice }}</span>
                </div>
                <div v-else class="original-price">
                  原價: {{ product.price }}
                </div>
                <div v-if="product.specialPrice && product.specialPrice > 0" class="original-price line-through">
                  原價: {{ product.price }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="success" @click="addToCart(product.productId)">加入購物車</v-btn>
                <v-btn icon flat @click="toggleWishlist(product.productId)">
                  <v-btn icon flat @click="toggleWishlist(product)">
                    <v-icon :color="product.inWishlist ? 'pink' : 'black'">mdi-heart</v-icon>
                  </v-btn>
                </v-btn>
              </v-card-actions>
              <!-- <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="600">
                {{ snackbarText }}
                <v-btn color="white" text @click="snackbar = false">關閉</v-btn>
              </v-snackbar> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import ProductCard from '@/components/ProductCard.vue';
import Swal from 'sweetalert2';
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
      displayedProducts: [], // 存放API取得的產品資料
      productsContainingA: [], // 用於存儲包含關鍵字 "a" 的商品

      categories: [ // 添加大分類的數據
        '筆記型電腦', '光碟機', '顯示卡', '硬碟_SSD',
        '桌上型電腦', '電供_線材', '軟體'
      ],

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
  components: {
    ProductCard
  },
  watch: {
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchProducts(this.selectedCategoryName);
      }
    }
  },
  //願望清單 生命茅點
  created() {
    if (Array.isArray(this.displayedProducts)) {
      this.displayedProducts.forEach(product => {
        product.inWishlist = localStorage.getItem(product.productid) === 'true';
      });
    }
  },

  methods: {
    // 加入購物車方法
    addToCart(productId) {
      axios.post(`http://localhost:8080/customer/api/shoppingCart?productId=${productId}`)
        .then(response => {
          // this.showSnackbar('商品已成功加入购物车。', 'success');
          //提示窗
          Swal.fire({
            icon: "success",
            title: "商品加入購物車",
            showConfirmButton: false,
            timer: 1000
          });
        })
        .catch(error => {
          // this.showSnackbar('无法添加商品到购物车。', 'error');
          Swal.fire({
            icon: "warning",
            title: "商品庫存不足",
            showConfirmButton: false,
            timer: 1000
          });
          console.error('Error adding product to cart:', error);
        });
    },
    handleAddToCart(productId) {
      // 在这里编写加入购物车的逻辑
      // 通常是调用API接口将商品添加到用户的购物车中
      axios.post('/api/path/to/cart', { productId: productId })
        .then(response => {
          // 处理成功响应，可能是通知用户商品已添加到购物车
          alert('商品已添加到购物车');
        })
        .catch(error => {
          // 处理错误响应，可能是通知用户操作失败
          console.error('添加到购物车失败', error);
          alert('无法添加商品到购物车，请稍后再试');
        });
    },
    
    // showSnackbar(message, color) {
    //   this.snackbarText = message;
    //   this.snackbarColor = color;
    //   this.snackbar = true;
    // },
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
      this.$emit('toggle-wishlist', this.product);

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
    selectCategory(category) {
      // 在這裡實現選擇商品類別後的邏輯
      console.log(`Selected category: ${category}`);
      // 根據選擇的類別拉取產品資料
      this.fetchCategoryProducts(category);
    },

    fetchCategoryProducts(categoryName = '筆記類型電腦') {
      // 使用axios調用API
      axios.get("http://localhost:8080/public/api/categoryname", {
        params: {
          categoryname: categoryName,
          minPrice: 0, // 起始價格
          maxPrice: 999999.99, // 最高價格
          page: 1, // 頁碼
          pageSize: 4, // 每頁4筆資料
        }
      }).then(response => {
        console.log('API response:', response.data); // 檢查數據結構
        if (response.data && response.data.content && response.data.content.length) {
          // 使用返回的数据赋值给displayedProducts
          this.displayedProducts = response.data.content;
        }
      }).catch(error => {
        console.error("Error fetching category products:", error);
        this.displayedProducts = []; // 出错时清空数组});
      });
    },

    //添加跳轉頁面到productPage
    navigateToProduct(productid) {
      console.log('Navigating to product with ID:', productid); // 調試信息
      this.$router.push({ name: 'ProductPage', params: { productId: productid } });

    },


    fetchProductsWithKeyword(keyword = 'a') {
      const params = {
        productname: keyword,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        page: this.currentPage,
      };
      axios.get('http://localhost:8080/public/api/products', { params })
        .then(response => {
          if (response.data && response.data.content) {
            this.productsContainingA = response.data.content;
          } else {
            this.productsContainingA = [];
          }
        })
        .catch(error => {
          console.error('Error fetching products with keyword:', error);
          this.productsContainingA = [];

        });
    },


  },
  // 当组件创建完成后立即获取数据
  mounted() {

    this.fetchCategoryProducts('筆記型電腦'); // 也可以在这里调用方法获取默认类别的数据
    this.fetchProductsWithKeyword('a');        // 當組件掛載完成後執行


  },
  // ... 其他方法 ...
};
</script>

<style scoped>
.product-image {
  height: 140px;
  /* 固定圖片的高度 */
  width: 100%;
  /* 圖片寬度與卡片相同 */
  object-fit: cover;
  /* 圖片覆蓋整個可用空間，可能會被裁剪 */
}

.product-name {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  /* 限制最大寬度 */
}

.product-card {
  width: 100%;
  /* 卡片寬度與包含它的容器寬度相同 */
  max-width: 250px;
  /* 最大寬度，確保卡片不會太大 */
  margin-bottom: 16px;
  /* 添加適當的底部外邊距 */
  display: flex;
  /* 使用flex布局 */
  flex-direction: column;
  /* 子項目垂直堆疊 */
  justify-content: space-between;
  /* 子項目之間的空間均勻分佈 */
  height: 350px;
  /* 固定卡片高度 */

}

.original-price {
  font-size: 16px;
  /* 設定原價的字體大小 */
}

.special-price {
  font-size: 20px;
  /* 設定特價的字體大小 */
  color: red;
  /* 特價顯示為紅色 */
}

.price-text {
  text-align: center;
  /* 将文本居中对齐 */
}

.raised-box {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影创建浮起效果 */
  padding: 1rem;
  /* 添加一些内边距 */
  border-radius: 8px;
  /* 如果需要可以加圆角 */
  background-color: white;
  /* 设置背景颜色 */
  margin: 1rem 0;
  /* 添加一些外边距 */

  /* 添加置中样式 */
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  text-align: center;
  /* 文本对齐方式为居中 */
}

.category-section {
  border: 1px solid #ddd;
  margin: 0 6px 0 0;
  /* 为整个分类列表添加边框 */

}

.product-name {
  display: -webkit-box;
  /* 创建一个块级别的弹性盒对象 */
  -webkit-box-orient: vertical;
  /* 设置盒子的子元素布局方向为垂直 */
  -webkit-line-clamp: 2;
  /* 限制文本的行数为两行 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
  text-overflow: ellipsis;
  /* 用省略号表示文本溢出 */
  height: 3em;
  /* 根据行高设置容器高度，这里的3em是假设行高为1.5em */
  line-height: 1.5em;
  /* 设置行高 */
  white-space: normal;
  /* 恢复默认的换行设置 */
  margin: 0;
  /* 移除外边距，根据实际情况可能需要调整 */
  padding: 0 10px;
  /* 添加水平内边距，防止文本紧贴容器边缘 */
}

.line-through {
  text-decoration: line-through;
  /* 劃掉文字 */
}

.card2 {
  margin: 0px 6px 12px 6px;
  /*每日發現card大小 */
}

/**------------------- */
.product-image:hover {
  transform: scale(1.05);
  /* 當鼠標懸停時輕微放大 */
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
  transition: transform 0.3s ease;
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
  min-height: 380px;

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
