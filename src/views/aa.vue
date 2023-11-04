<template>
  <v-app>
    <v-main>
      <v-container>

        <v-card tile flat class="d-flex flex-column fill-height">
          <v-row no-gutters class="flex-grow-1">
            <!-- Sidebar with buttons -->
            <v-col cols="2" class="d-flex flex-column sidebar">
              <v-btn block class="rounded-0 button-style">Button 1</v-btn>
              <v-btn block class="rounded-0 button-style">Button 2</v-btn>
              <v-btn block class="rounded-0 button-style">Button 3</v-btn>
              <v-btn block class="rounded-0 button-style">Button 4</v-btn>
              <v-btn block class="rounded-0 button-style">Button 5</v-btn>
              <v-btn block class="rounded-0 button-style">Button 6</v-btn>

            </v-col>
            <!-- Main content area -->
            <v-col cols="10">
              <div class="workspaces fill-height">
                <div class="workspace">Workspace 1</div>
                <div class="workspace">Workspace 2</div>
                <div class="workspace">Workspace 3</div>
                <div class="workspace">Workspace 4</div>
              </div>
            </v-col>
          </v-row>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>
    
<script setup>
import { ref } from 'vue';

// 示範用的按鈕數據
const buttons = [
  { id: 1, content: '按鈕1的內容' },
  { id: 2, content: '按鈕2的內容' },
  { id: 3, content: '按鈕3的內容' },
  { id: 4, content: '按鈕4的內容' },
  { id: 5, content: '按鈕5的內容' },
  { id: 6, content: '按鈕6的內容' }
];

// 反應式變數，用於儲存要在工作區顯示的內容
const displayedContent = ref('');

// 更新顯示內容的方法
const updateContent = (buttonId) => {
  // 根據 id 查找按鈕並更新顯示內容
  const button = buttons.find(b => b.id === buttonId);
  displayedContent.value = button ? button.content : '';
};
</script>
    
<style scoped>
.workspaces {
  display: flex;
}

.workspace {
  border-left: 1px dashed #3ca9f1;
  /* 保留左边虚线边框 */
  border-right: 1px dashed #3ca9f1;
  /* 保留右边虚线边框 */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-style {
  border: 1px dashed #3ca9f1;
  /* 原始虚线 */
  border-image: linear-gradient(to right,
      #3ca9f1 100%,
      /* 虚线颜色 */
      rgba(255, 255, 255, 0) 0%);
  border-image-slice: 1;
  border-image-repeat: repeat;
  /* ... 其他样式 ... */
}

.v-card {
  border: 2px solid #3ca9f1;
  /* 设置边框粗细为 2px */
  /* 其他样式保持不变 */
  max-width: 80%;
  margin: 0 auto;
}
</style>