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
              <v-list-item>
                <v-list-item-title @click="UploadProduct">新增商品</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="FindProduct">商品管理</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <!-- 其他 v-expansion-panel 結構省略... -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              營收分析
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item>
                <v-list-item-title @click="FindRevenue">收入</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>回復</v-list-item-title>
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
    FindRevenue() {
      this.$router.push('/showRevenue');
    }
  }
};
</script>
