<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card tile flat class="d-flex flex-column fill-height">
          <v-row no-gutters class="flex-grow-1">
            <!-- Sidebar with buttons -->
            <v-col cols="2" class="d-flex flex-column sidebar">
              <v-btn block class="rounded-0 button-style" v-for="button in buttons" :key="button.id"
                @click="updateContent(button.id)">
                {{ button.content }}
              </v-btn>
            </v-col>
            <!-- Main content area -->
            <v-col cols="10" class="workspaces">
              <v-col cols="12" v-for="(category, index) in displayedItems" :key="index" class="category">
                <v-row class="fill-height">
                  <v-col cols="3" class="item" v-for="subItem in category.subItems" :key="subItem">
                    {{ subItem }}
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      buttons: [
        { id: 1, content: 'Button 1' },
        { id: 2, content: 'Button 2' },
        { id: 3, content: 'Button 3' },
        { id: 4, content: 'Button 4' },

        // ... add more buttons as needed
      ],
      items: {
        1: { subItems: ['Item 1-1', 'Item 1-2', 'Item 1-3', 'Item 1-4'] },
        2: { subItems: ['Item 2-1', 'Item 2-2', 'Item 2-3', 'Item 2-4'] },
        3: { subItems: ['Item 3-1', 'Item 3-2', 'Item 3-3', 'Item 3-4'] },
        4: { subItems: ['Item 4-1', 'Item 4-2', 'Item 4-3', 'Item 4-4'] },
        // ... add more categories and items as needed
      },
      displayedItems: []
    };
  },
  methods: {
    updateContent(buttonId) {
      this.displayedItems = [this.items[buttonId]] || [];
    }
  }
};
</script>

<style scoped>
.sidebar .button-style {
  border: none;
  margin-bottom: 2px;
  /* Add space between buttons */
}

.workspaces .workspace {
  margin-bottom: 8px;
  /* Space between workspace rows */
}

.workspaces .item {
  border: 1px solid #3ca9f1;
  padding: 10px;
  /* 為項目內容添加間距 */
  text-align: center;
  /* 將文本居中對齊 */
  display: flex;
  /* 使用 flexbox 布局 */
  flex-direction: column;
  /* 將子元素按縱列排列 */
  justify-content: space-between;
  /* 將內容推向上下，使底部對齊 */
  height: 100%;
  /* 設置高度以填滿父元素 */
}

/* ... (other styles if needed) ... */
</style>



