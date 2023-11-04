<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row no-gutters>
          <!-- 左側的按鈕列 -->
          <v-col cols="2" class="sidebar">
            <v-btn block @click="fetchCategoryProducts('筆記型電腦', 1)">Button 1</v-btn>
            <v-btn block @click="fetchCategoryProducts('主機板', 2)">Button 2</v-btn>
            <!-- 更多按鈕... -->
          </v-col>

          <!-- 右側的工作區域 -->
          <v-col cols="10" class="workspaces">
            <div class="workspace" v-for="n in 4" :key="n" :id="`workspace-${n}`">
              Workspace {{ n }}
              <!-- 这里将根据按钮点击动态填充内容 -->
            </div>
          </v-col>
        </v-row>
        <!-- ... 其他模板代碼 ... -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // ... 其他數據屬性 ...
      displayedProducts: [], // 这里存放从API获取的产品数据
      // ... 其他數據屬性 ...
    };
  },
  methods: {
    fetchCategoryProducts(categoryName, workspaceNumber) {
      // 使用axios調用API
      axios.get("http://localhost:8080/public/api/categoryname", {
        params: {
          categoryname: categoryName,
          minPrice: 0, // 起始價格
          maxPrice: 999999.99, // 最高價格
          page: 1, // 頁碼
          pageSize: 4, // 每頁4筆資料
        }
      }).then(response => {
        console.log('API response:', response.data); // 檢查數據結構
        if (response.data && response.data.content) {
          // 将响应中的content数组赋值给displayedProducts
          this.displayedProducts = response.data.content;
        }
      }).catch(error => {
        console.error("Error fetching category products:", error);
        this.displayedProducts = []; // 出错时清空数组

      });
    },
  },
  // 当组件创建完成后立即获取数据
  mounted() {
    this.fetchCategoryProducts('筆記型電腦'); // 也可以在这里调用方法获取默认类别的数据
  },
  // ... 其他方法 ...
};
</script>

<style scoped>
.product-image {
  height: 200px;
  /* Fixed height for images */
  object-fit: cover;
  /* Cover the aspect ratio of the image */
}
</style>
