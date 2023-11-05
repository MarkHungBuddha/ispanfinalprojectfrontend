<template>
  <v-navigation-drawer app>
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
    Unanswer(){
      this.$router.push('/unanswer');
    }
  }
};
</script>
