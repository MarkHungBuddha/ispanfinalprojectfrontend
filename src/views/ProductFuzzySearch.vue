<template>
  <v-container>
    <!-- 循環顯示產品 -->
    <v-row>
      <v-col v-for="product in products" :key="product.productId" cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text class="d-flex flex-column align-center">
            <!-- 商品圖片 -->
            <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image" class="product-image mr-2"
              @click="navigateToProduct(product.productId)">
            </v-img>
            <!-- 商品名稱 -->
            <div class="product-name">{{ product.productName }}</div>
            <!-- 原價 -->
            <div class="original-price" :class="{ 'line-through': product.specialPrice < product.price }">
              原價: {{ product.price }}
            </div>
            <!-- 特價 -->
            <div v-if="product.specialPrice && product.specialPrice < product.price" class="special-price">
              特價: {{ product.specialPrice }}
            </div>
            <!-- 平均評價 -->
            <v-card-actions>
              <v-btn color="primary" @click="addProductToCart(product.productId)">加入購物車</v-btn>

              <v-btn icon @click="toggleWishlist(product)">
                <v-icon :color="product.inWishlist ? 'pink' : 'grey'">mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios'; // 在這裡導入 axios
import ProductCard from '@/components/ProductCard.vue';

export default {
  components: {
    ProductCard
  },
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
    '$route.query.search': function (newVal) {
      this.searchText = newVal || '';
      this.currentPage = 1; // 重置为第一页
      this.fetchProducts();
    },
    currentPage: function (newVal) {
      if (newVal !== this.oldValue) {
        this.fetchProducts();
      }
    }
  },

  // 當前組件創建時的生命周期鉤子
  created() {
    // 當組件被創建時，檢查 URL 查詢參數並執行搜索
    this.searchText = this.$route.query.search || '';
    if (this.searchText) {
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

.product-image {
  width: 100%;
  /* 宽度占满卡片宽度 */
  height: 0;
  /* 初始高度设为0 */
  padding-top: 100%;
  /* 利用padding百分比设定基于宽度的高度 */
  object-fit: cover;
  /* 覆盖整个内容区域，可能会被裁剪 */
  /* 其他样式保持不变 */
}

.line-through {
  text-decoration: line-through;
  /* 劃掉文字 */
}
</style>
