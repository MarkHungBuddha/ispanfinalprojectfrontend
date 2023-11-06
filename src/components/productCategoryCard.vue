<template>
  <v-app>
    <v-main>
      <v-container>

        <!-- 头部，包含搜索栏和购物车图标 -->
        <v-row class="mb-5">
          <v-col>
            <v-text-field clearable prepend-inner-icon="mdi-magnify" placeholder="搜索商品..."></v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn icon>
              <v-badge color="red" content="3">
                <v-icon large>mdi-cart</v-icon>
              </v-badge>
            </v-btn>
          </v-col>
        </v-row>

        <!-- 商品目录标题 -->
        <v-row>
          <v-col>
            <h1 class="display-1">商品目录</h1>
          </v-col>
        </v-row>

        <!-- 商品卡片 -->
        <v-row no-gutters>
          <v-col cols="12" class="workspaces">
            <v-row>
              <v-col v-for="(product, index) in displayedProducts" :key="index" cols="12" sm="6" md="4" lg="3">
                <v-card class="product-card">
                  <v-card-text class="d-flex flex-column align-center">
                    <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                      class="product-image"></v-img>
                    <div class="product-name">{{ product.productname }}</div>
                    <div class="original-price">原價: {{ product.price }}</div>
                    <div class="special-price">特價: {{ product.specialprice }}</div>
                    <v-btn block color="primary" @click="fetchCategoryProducts(category)"> {{ category }}
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
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
      displayedProducts: [], // 存放API取得的產品資料
      categories: [ // 添加大分類的數據
        '筆記型電腦', '主機板', '記憶體', '光碟機',
        '機殼', '散熱風扇', '顯示卡', '硬碟_SSD',
        '桌上型電腦', '電供_線材', '軟體'
      ],

    };
  },
  methods: {

    fetchCategoryProducts(categoryName) {
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
          // 取前4条数据赋值给displayedProducts
          this.displayedProducts = response.data.content.slice(0, 4);
        }
      }).catch(error => {
        console.error("Error fetching category products:", error);
        this.displayedProducts = []; // 出错时清空数组        });
      });
    },
    selectProduct(product) {
      // 在这里实现选择商品后的逻辑
      console.log('选择的商品:', product.productname);
      // 例如，添加商品到购物车的代码
    },
    navigateToProduct(productId) {
      // 实现导航到商品详细页面的逻辑
      // this.$router.push({ name: 'ProductDetails', params: { productId } });
    },

  },
  // 当组件创建完成后立即获取数据
  mounted() {

    this.fetchCategoryProducts('筆記型電腦'); // 也可以在这里调用方法获取默认类别的数据
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

/* 其他元素如標題和副標題可能需要調整來適應固定大小的卡片 */
.v-card-title {
  white-space: normal;
  /* 允許換行 */
  line-height: 1.2;
  /* 行高可以根據需要調整 */
  margin: 0;
  /* 移除可能的外邊距 */
  padding: 0;
  /* 移除可能的內邊距 */
}

.v-card-subtitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-card {
  overflow: hidden;
  /* 隱藏超出邊界的內容 */
}

.first-row {
  margin-top: 20px;
  /* 或者您想要的距離 */
}

.product-name {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  /* 限制最大寬度 */
}

.product-card {

  height: auto;
  width: 250px;
  /* 設定固定寬度 */
  height: 350px;
  /* 設定固定高度 */
  display: flex;
  flex-direction: column;
}

/* 添加样式 */
.mb-5 {
  margin-bottom: 5rem;
  /* 添加适当的下边距 */
}

/* 购物车图标样式 */
.v-btn--icon {
  margin-right: 1rem;
  /* 图标间隔 */
}
</style>