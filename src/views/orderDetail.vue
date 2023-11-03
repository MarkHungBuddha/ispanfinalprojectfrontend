<template>
  <v-app>
    <v-container>

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
          <div>訂單狀態：{{ orderDetails.statusname }}</div>
          <div>送貨地址：{{ orderDetails.orderaddess }}</div>
        </v-card-text>

        <!-- 付款按鈕 -->
        <div class="d-flex justify-end">
          <v-btn color="primary" @click="payForOrder(orderDetails.orderid)">付款</v-btn>
        </div>
        <v-divider class="my-4"></v-divider>

        <!-- 顯示產品列表 -->
        <v-card v-for="product in orderDetails.products" :key="product.productID" class="mb-3">
          <v-row>
            <!-- 產品圖片列 -->
            <v-col cols="4">
              <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                class="product-image"></v-img>
            </v-col>

            <!-- 產品信息列，使用 "text-right" class 來對齊文本到右側 -->
            <v-col cols="8" class="text-right product-details">
              <v-card-title>{{ product.productName }}</v-card-title>
              <v-card-subtitle>
                數量：{{ product.quantity }}，單價：{{ product.unitprice }}
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
  </v-app>
</template>

<script>
import axios from 'axios';


export default {
  props: {
    orderid: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      orderDetails: null,
      paymentSuccessful: false,
      paymentError: null,
    };
  },
  created() {
    this.fetchOrderDetails();
  },
  methods: {
    // 方法：獲取訂單詳情
    fetchOrderDetails() {
      axios.get(`http://localhost:8080/customer/api/findOneOrder`, {
        params: { orderid: this.orderid }
      })
        .then(response => {
          this.orderDetails = response.data;
        })
        .catch(error => {
          console.error('無法檢索訂單詳情：', error);
          // 可以在這裡設置一些錯誤處理的邏輯
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

    // 新增方法：處理付款邏輯
    payForOrder(orderId) {
      axios.put(`http://localhost:8080/customer/api/${orderId}/payOrder`)
        .then(response => {
          // 處理響應，更新訂單詳情
          this.orderDetails = response.data;
          // 可能還需要顯示一個成功消息或導航到其他頁面
        })
        .catch(error => {
          // 處理錯誤，顯示錯誤消息
          console.error('付款失敗：', error);
          // 可以顯示一個錯誤提示給用戶
        });
    }
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
  max-width: 150px;
  height: auto;
}
</style>
