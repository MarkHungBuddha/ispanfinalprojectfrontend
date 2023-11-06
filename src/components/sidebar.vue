<template>
  <v-navigation-drawer app>
    <!-- 添加賣家頁面的標題 -->
    <v-toolbar flat dense color="#f8cdb5">
      <v-toolbar-title class="text-h5">
        賣家頁面
      </v-toolbar-title>
    </v-toolbar>
    <!-- 導航抽屜的內容 -->
    <v-list>
      <v-list-item-group>
        <v-expansion-panels>

          <v-expansion-panel>
            <v-expansion-panel-title>
              商品管理
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item @click="UploadProduct">
                <v-list-item-title>新增商品</v-list-item-title>
              </v-list-item>
              <v-list-item @click="FindProduct">
                <v-list-item-title>商品列表</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              訂單管理
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item @click="Unanswer">
                <v-list-item-title>待回問題</v-list-item-title>
              </v-list-item>
              <v-list-item @click="ManageOrders">
                <v-list-item-title>訂單管理</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              數據分析
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item>
                <v-list-item-title>提問數量</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>評論數量</v-list-item-title>
              </v-list-item>
              <v-list-item @click="FindRevenue">
                <v-list-item-title>營收分析</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

        </v-expansion-panels>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    UploadProduct() {
      this.$router.push('/uploadProduct');
    },
    FindProduct() {
      this.$router.push('/showAllProduct');
    },
    ManageOrders() {
      this.$router.push('/sellerOrder');
    },
    FindRevenue() {
      this.$router.push('/showRevenue');
    },
    Unanswer() {
      this.$router.push('/unanswer');
    }
  }
};
</script>

<style scoped>
/* 擴展面板標題樣式，當擴展時更深的色調 */
.v-expansion-panel-title {
  font-size: 1.1rem;
  /* 設定字體大小 */
  color: #5d4037;
  /* 深色調文字 */
  cursor: pointer;
}

/* 標題懸停效果，略微淺色 */
.v-expansion-panel-title:hover,
.v-expansion-panel--active .v-expansion-panel-title {
  background-color: #f8cdb5;
  /* 懸停時的淺色調背景 */
  color: #4e342e;
  /* 懸停時的深色調文字 */
}

/* 擴展面板文本區域樣式 */
.v-expansion-panel-text {
  background-color: #fcf1e9;
  /* 更淺的背景色 */
  color: #5d4037;
  /* 文字顏色 */
}

/* 清單項目樣式 */
.v-list-item {
  color: #5d4037;
  /* 文字顏色 */
  font-size: 0.95rem;
}

/* 清單項目懸停效果 */
.v-list-item:hover {
  background-color: #fae4d9;
  /* 懸停時的背景色 */
}




/* 修改擴展面板的默認陰影和邊框樣式 */
.v-expansion-panels .v-expansion-panel--active {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* 添加陰影效果 */
  border-left: 5px solid #eeccbb;
  /* 添加左邊框標識 */
}
</style>

