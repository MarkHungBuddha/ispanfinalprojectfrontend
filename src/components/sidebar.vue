<template>
      <v-navigation-drawer app>
        <v-list>
          <v-list-item-group>
            <v-expansion-panels>
              <v-expansion-panel>
                <template v-slot:header>
                  <v-expansion-panel-header>
                    商品管理
                  </v-expansion-panel-header>
                </template>
                <v-expansion-panel-content>
                  <v-list-item>
                    <v-list-item-title @click="UploadProduct">新增商品</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="FindProduct">商品管理</v-list-item-title>
                  </v-list-item>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <template v-slot:header>
                  <v-expansion-panel-header>
                    訂單管理
                  </v-expansion-panel-header>
                </template>
                <v-expansion-panel-content>
                  <v-list-item>
                    <v-list-item-title>待回問題</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>待確認訂單</v-list-item-title>
                  </v-list-item>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <template v-slot:header>
                  <v-expansion-panel-header>
                    数据分析
                  </v-expansion-panel-header>
                </template>
                <v-expansion-panel-content>
                  <v-list-item>
                    <v-list-item-title>提問數量</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>評論數量</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>營收分析</v-list-item-title>
                  </v-list-item>

                </v-expansion-panel-content>
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
    }
  }
};
</script>
