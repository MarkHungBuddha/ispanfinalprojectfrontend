<template>
  <v-app>
    <v-main>
      <v-container>
        <barList></barList>
        <navbar></navbar>

        <v-tabs v-model="tab" align-with-title :items="items" class="elevation-1 mt-5">
          <v-tab v-for="(item, index) in items" :key="item" :value="item" @click="handleTabClick(item)">
            {{ item }}
          </v-tab>
        </v-tabs>

        <div v-for="order in orders" :key="order.orderid" class="mb-3">
          <v-card>
            <v-card-title>
              訂單編號: {{ order.orderid }}
            </v-card-title>
            <v-card-subtitle>
              訂單日期: {{ formatDate(order.merchanttradedate) }}
            </v-card-subtitle>
            <v-card-text>
              <div>買家: {{ order.buyer }}</div>
              <div>訂單金額: {{ order.totalamount }}</div>
              <div>訂單狀態: {{ order.statusname }}</div>
              <div>送貨地址: {{ order.orderaddess }}</div>
              <div v-for="product in order.products" :key="product.imagepath" class="d-flex align-center mb-2">
                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                  class="product-image mr-2" style="width: 100px;"></v-img>
                <div class="flex-grow-1">
                  <strong>{{ product.productName }}</strong>
                  <div>數量: {{ product.quantity }}</div>
                  <div>單價: {{ product.unitprice }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <v-alert v-if="orders == null" type="info">沒有訂單資料</v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
import barList from "@/components/barList.vue";

export default {
  components: {
    navbar,
    barList
  },
  data() {
    return {
      tab: null,
      items: ['所有訂單', '待付款', '待出貨', '待收貨', '已完成', '已取消'],
      orders: [],
    };
  },
  methods: {
    fetchOrders(statusid) {
      axios
        .get('http://localhost:8080/customer/api/findorders/Status', {
          params: {
            p: 1,
            statusid,
          },
        })
        .then((response) => {
          this.orders = response.data.content;
        })
        .catch((error) => {
          console.error('無法檢索訂單：', error);
        });
    },
    fetchAllOrders() {
      axios
        .get('http://localhost:8080/customer/api/findAllOrders', {
          params: { p: 1 },
        })
        .then((response) => {
          this.orders = response.data.content;
        })
        .catch((error) => {
          console.error('無法檢索所有訂單：', error);
        });
    },
    handleTabClick(item) {
      const statusMap = {
        '所有訂單': 0,
        '待付款': 1,
        '待出貨': 2,
        '待收貨': 3,
        '已完成': 4,
        '已取消': 5
      };
      if (item === '所有訂單') {
        this.fetchAllOrders();
      } else {
        this.fetchOrders(statusMap[item]);
      }
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      return date.toISOString().substring(0, 19).replace('T', ' ');
    },
  },
  created() {
    this.fetchAllOrders(); // 預設載入 '待付款' 狀態的訂單
  },
};
</script>

<style scoped>
.product-image {
  width: auto;
  max-width: 150px;
  height: auto;
}
</style>