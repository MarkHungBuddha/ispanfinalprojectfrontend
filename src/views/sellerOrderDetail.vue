<template>
  <v-app>
    <v-main>
      <v-container>
        <sidebar></sidebar>

        <!-- 上一頁按鈕 -->
        <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <!-- 添加class "order-card" 並設置max-width -->
        <div v-if="orderDetails" class="mx-auto order-card">

          <!-- 訂單標題，顯示訂單編號 -->
          <v-card-title>
            訂單編號：{{ orderDetails.orderid }}
          </v-card-title>

          <!-- 訂單副標題，顯示訂單日期 -->
          <v-card-subtitle>
            訂單日期：{{ formatDate(orderDetails.merchanttradedate) }}
          </v-card-subtitle>

          <!-- 訂單內容，顯示訂單的買家、金額、狀態和地址 -->
          <v-card-text>
            <div>買家：{{ orderDetails.buyer }}</div>
            <div>訂單金額：{{ orderDetails.totalamount }}</div>
            <!-- 訂單狀態，根據isOrderCompleted動態改變文字顏色 -->
            <div :class="{ 'status-color-change': orderStatusClass }">
              <div>訂單狀態：{{ orderDetails.statusname }}</div>
            </div>
            <div>送貨地址：{{ orderDetails.orderaddess }}</div>
          </v-card-text>

          <!-- 訂單出貨 按鈕 訂單狀態為'待出貨'時顯示-->
          <div class="d-flex justify-end" v-if="orderDetails.statusname === '待出貨'">
            <v-btn color="success" @click="shipOrder(orderDetails.orderid)">訂單出貨</v-btn>
          </div>

          <!-- 顯示產品列表 -->
          <v-card v-for=" product in orderDetails.products" :key="product.productid" class="mb-3"
            @click="navigateToProduct(product.productid)">
            <v-row>
              <!-- 產品圖片列 -->
              <v-col cols="4">
                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                  class="product-image"></v-img>
              </v-col>

              <!-- 產品信息列，使用 "text-right" class 來對齊文本到右側 -->
              <v-col cols="8" class="text-right product-details">
                <v-card-title>{{ product.productName }}</v-card-title>
                <v-card-subtitle @click="navigateToProduct(product.productid)">
                  數量：{{ product.quantity }}，單價：{{ product.unitprice }}，商品id：{{ product.productid }}
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card>

        </div>
        <!-- 如果訂單詳情不存在，顯示警告信息 -->
        <v-alert v-else type="warning">
          訂單資料正在加載中，或者無法顯示訂單資料。
        </v-alert>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import sidebar from "@/components/sidebar.vue";

export default {
  components: {
    sidebar,
  },
  props: {
    orderid: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      orderStatusClass: '',
      orderDetails: null,
      showDialog: false,

    };
  },
  created() {
    this.fetchOrderDetails();
  },
  methods: {
    // 方法：獲取訂單詳情
    fetchOrderDetails() {
      axios.get(`http://localhost:8080/seller/api/sellerfindOneOrder`, {
        params: { orderid: this.orderid }
      })
        .then(response => {
          this.orderDetails = response.data;
        })
        .catch(error => {
          console.error('無法檢索訂單詳情：', error);
        });
    },
    // 方法：格式化日期時間
    formatDate(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toISOString().substring(0, 19).replace('T', ' ');
    },

    // 上一頁
    goBack() {
      this.$router.go(-1); // 或者 this.$router.back();
    },


    // 確認出貨
    shipOrder(orderId) {
      axios.put(`http://localhost:8080/seller/api/${orderId}/shipOrder`)
        .then(response => {
          this.orderDetails = response.data;
          this.orderStatusClass = 'status-color-change'; // 應用綠色

        })
        .catch(error => {
          console.error('確認出貨失敗：', error);
        });
    },
    //訂單的商品可跳至商品頁面
    navigateToProduct(productid) {
      this.$router.push({ name: 'ProductPage', params: { productId: productid } });
    },

  }
};
</script>

<style scoped>
/* 新增的樣式 */
.order-card {
  max-width: 1200px;
  /* 您可以根據需要調整這個值 */
}

/* 產品詳情樣式調整 */
.product-details {
  display: flexbox;
  flex-direction: column;
  justify-content: center;
}

/* 圖片樣式 */
.product-image {
  width: auto;
  max-width: 200px;
  height: auto;
}

/* 訂單狀態文字顏色變化為綠色 */
.status-color-change {
  color: #4CAF50;
}
</style>
