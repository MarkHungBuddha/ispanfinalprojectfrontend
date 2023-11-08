<template>
  <v-navigation-drawer app>
    <!-- 添加買家頁面的標題 -->
    <v-toolbar flat dense class="toolbar1">
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
              <v-list-item @click="member">
                <v-list-item-title>個人檔案</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              購買清單
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item @click="order">
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
  methods: {
    member() {
      this.$router.push('/member');
    },
    order() {
      this.$router.push('/order');
    },
  }
};

</script>


<style scoped>
.toolbar1 {
  background-color: rgb(10, 43, 187);
  color: white;

}

/* 導航抽屜樣式 */
.v-navigation-drawer {
  background-color: transparent;

  /* 透明背景 */
}

/* 擴展面板標題樣式 */
.v-expansion-panel-title {
  font-size: 1.2rem;
  color: rgb(0, 0, 0);
  /* 淺粉色文字 */
  cursor: pointer;
}


/* 擴展面板內容樣式 */
.v-expansion-panel-text {
  padding-left: 20px;
  color: #880E4F;
}

/* 清單項目樣式 */
.v-list-item {
  color: rgb(0, 0, 0);
  font-size: 1rem;
}

.v-list-item:hover {
  background-color: rgb(199, 199, 224)
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
  /* background-color: rgb(248, 227, 206); */
  background-color: rgb(223, 230, 255)
  /* 非常淺的粉色背景 */
}

.v-expansion-panels .v-expansion-panel--active {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* 添加陰影效果 */
  border-left: 5px solid #C4CAE0;
  /* 添加左邊框標識 */
}
</style>
