<template>
  <v-navigation-drawer app>
    <!-- 添加買家頁面的標題 -->
    <v-toolbar flat dense color="rgb(248, 176, 200)">
      <v-toolbar-title class="text-h5">
        買家頁面
      </v-toolbar-title>
    </v-toolbar>
    <!-- 導航抽屜的內容 -->
    <v-list>
      <v-list-item-group>
        <v-expansion-panels>

          <v-expansion-panel>
            <v-expansion-panel-title>
              我的帳戶
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item to="/member">
                <v-list-item-title>個人檔案</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              購買清單
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item to="/order">
                <v-list-item-title>購買清單</v-list-item-title>
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


<style scoped>
/* 導航抽屜樣式 */
.v-navigation-drawer {
  background-color: transparent;

  /* 透明背景 */
}

/* 擴展面板標題樣式 */
.v-expansion-panel-title {
  font-size: 1.2rem;
  color: rgb(82, 5, 23);
  /* 淺粉色文字 */
  cursor: pointer;
}

.v-expansion-panel-title:hover,
.v-expansion-panel--active .v-expansion-panel-title {
  color: rgb(82, 5, 23);
}

/* 擴展面板內容樣式 */
.v-expansion-panel-text {
  padding-left: 20px;
  color: #880E4F;
}

/* 清單項目樣式 */
.v-list-item {
  color: rgb(82, 5, 23);
  font-size: 1rem;
}

.v-list-item:hover {
  background-color: #facfde;

  /* 非常淺的粉色背景懸停 */
}

/* 清單項目標題樣式 */
.v-list-item-title {
  font-weight: 500;
}

/* 面板樣式 */
.v-expansion-panel {
  box-shadow: none;
  border: none;
}

/* 當擴展面板被打開時的樣式 */
.v-expansion-panel--active {
  background-color: #fadfe7;

  /* 非常淺的粉色背景 */
}
</style>
