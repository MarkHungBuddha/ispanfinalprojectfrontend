<template>
  <v-row class="category-bar">
    <v-col>
      <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props">行動通訊</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(title, index) in items" :key="index" @click="handleCategoryClick(title)">
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
            <v-btn color="primary" v-bind="props">大型家電</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(appliance, index) in appliances" :key="index" @click="handleCategoryClick(appliance)">
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
            <v-btn color="primary" v-bind="props">電腦資訊</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(info, index) in computerInfo" :key="index" @click="handleCategoryClick(info)">
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
            <v-btn color="primary" v-bind="props">電腦周邊</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(computerPeripheral, index) in computerPeripherals" :key="index"
              @click="handleCategoryClick(computerPeripheral)">
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
            <v-btn color="primary" v-bind="props">小型家電</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(smallAppliance, index) in smallAppliances" :key="index"
              @click="handleCategoryClick(smallAppliance)">
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
            <v-btn color="primary" v-bind="props">視聽娛樂</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(entertainment, index) in entertainments" :key="index"
              @click="handleCategoryClick(entertainment)">
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
            <v-btn color="primary" v-bind="props">辦公耗材</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(officeSupply, index) in officeSupplies" :key="index"
              @click="handleCategoryClick(officeSupply)">
              <v-list-item-title>{{ officeSupply }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-col>
  </v-row>
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
            pageSize: 4,
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
              this.navigateToProducts(categoryName);
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
    navigateToProducts(category) {
      this.$router.push({ name: 'ProductList', params: { category: category } });
    },
    handleCategoryClick(category) {
      this.fetchProducts(category);
      this.navigateToProducts(category);
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
  height: 150px;
  /* 固定图片高度 */
  object-fit: cover;
  /* 确保图片覆盖整个可用空间，可能会被裁剪 */
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
  bottom: 16px;
  /* 距離卡片底部的距離，根據需要調整 */
  right: 16px;
  /* 距離卡片右側的距離，根據需要調整 */
  z-index: 2;
  /* 確保按鈕在卡片之上 */
}

.category-bar {
  height: 70px;
  background-color: #FEB5C5;
}



.product-card {
  display: flex;
  /* 使用 flex 布局 */
  flex-direction: column;
  /* 确保内容是垂直方向 */
  justify-content: space-between;
  /* 在项目之间保持空间 */
  height: auto;
  /* 卡片高度自动根据内容调整 */
  margin: 0;
  /* 移除卡片的外边距 */

}
</style>
