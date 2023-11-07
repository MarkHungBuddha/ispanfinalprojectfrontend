<template>
  <v-app>
    <v-main>
      <sidebar></sidebar>
      <v-container>

        <!-- 搜索訂單ID欄 -->
        <!-- <div class="selectbar">
          <v-text-field v-model="searchQuery" label="賣家搜索訂單ID" @input="searchOrder"></v-text-field>
        </div> -->

        <!-- 賣家家訂單頁面 -->
        <!-- 標籤選項卡 -->
        <v-tabs v-model="tab" align-with-title :items="items" class="elevation-1 mt-5">
          <v-tab v-for="(item, index) in items" :key="item" :value="item" @click="handleTabClick(item)"
            :class="{ 'tab--active': tab === item }">
            {{ item }}
          </v-tab>
        </v-tabs>
        <!-- 訂單列表 -->
        <div v-for="order in orders" :key="order.orderid" class="mb-3">
          <v-card class="light-gray-background" @click="goToOrderDetail(order.orderid)">
            <!-- 訂單卡片內容 -->
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


        <!-- 無訂單數據時的提示 -->
        <v-alert v-if="orders == null" type="info">沒有訂單資料</v-alert>

        <!-- 分頁控件 -->
        <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>


        <!-- 加載中的提示 -->
        <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
// import barList from "@/components/barList.vue";
import sidebar from '@/components/sidebar.vue';


export default {
  components: {
    navbar,
    // barList,
    sidebar,
  },
  data() {
    return {
      tab: null,
      items: ['所有訂單', '待付款', '待出貨', '待收貨', '已完成', '已取消'],
      orders: [],
      currentPage: 1, // 从1开始以匹配后端API
      totalPages: 1, // 初始设置为1，将从API响应中更新
      pageSize: 10, // 每页的项目数，这应该与后端设置匹配
      isLoading: false, // 加载状态标志

    };
  },
  watch: {
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchPage(); // 当页码变化时获取新数据
      }
    }
  },
  methods: {
    fetchPage() {
      this.isLoading = true;
      if (this.tab === '所有訂單') {
        this.fetchAllOrders();
      } else {
        const statusMap = {
          '待付款': 1,
          '待出貨': 2,
          '待收貨': 3,
          '已完成': 4,
          '已取消': 5
        };
        this.fetchOrders(statusMap[this.tab]);
      }
    },
    // 靠訂單狀態碼找訂單
    fetchOrders(statusid) {
      this.isLoading = true;

      axios
        .get('http://localhost:8080/seller/api/sellerfindorders/Status', {
          params: {
            p: this.currentPage,
            statusid: statusid,
          },
        })
        .then((response) => {
          this.orders = response.data.content;
          this.totalPages = response.data.totalPages;
          // 确保我们在前端显示从1开始的页码


          this.isLoading = false;
        })
        .catch((error) => {
          console.error('無法檢索訂單：', error);
          this.isLoading = false;
        });
    },
    // 找所有訂單
    fetchAllOrders() {
      this.isLoading = true;
      axios
        .get('http://localhost:8080/seller/api/findSellerOrders', {
          params: { p: this.currentPage },
        })
        .then((response) => {
          this.orders = response.data.content;
          this.totalPages = response.data.totalPages;
          this.isLoading = false;
          console.log(`总页数: ${this.totalPages}, 当前页数: ${this.currentPage}`);
        })
        .catch((error) => {
          console.error('無法檢索所有訂單：', error);
          this.isLoading = false;
        });
    },


    handleTabClick(item) {
      this.currentPage = 1; // 重置为第一页
      this.tab = item; // 更新当前活跃的标签
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
    // 時間格式
    formatDate(datetime) {
      const date = new Date(datetime);
      return date.toISOString().substring(0, 19).replace('T', ' ');
    },
    //按單筆訂單跳至訂單頁面
    goToOrderDetail(orderId) {
      // 或者使用命名路由和參數
      this.$router.push({ name: 'sellerOrderDetail', params: { orderid: orderId } });
    },
  },
  created() {
    this.fetchAllOrders(); // 預設載入 '全部訂單'
  },
};
</script>

<style scoped>
.v-application {
  background-image: url('@/assets/seller01.png'), linear-gradient(to bottom, #dfdd8d, #d0aaae);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

/* ::v-deep .v-navigation-drawer {
  background-image: linear-gradient(to bottom, rgb(247, 188, 38), rgb(121, 25, 12));
} */

.product-image {
  width: auto;
  max-width: 150px;
  height: auto;
  /*圖片控制 */
}

.light-gray-background {
  background-color: rgba(249, 227, 215, 0.5);
  /* 訂單背景色 + 透明度 */
}


.tab--active {
  background-color: #d0aaae;
  /* 指定選中標籤顏色 */
}
</style>
