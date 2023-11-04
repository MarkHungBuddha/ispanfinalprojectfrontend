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
                <v-list-item-title>新增商品</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>商品列表</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              訂單管理
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item>
                <v-list-item-title>待回問題</v-list-item-title>
              </v-list-item>
              <v-list-item to="/sellerOrder">
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
              <v-list-item>
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
  // 如果有需要的話，這裡可以添加script部分。
}
</script>
