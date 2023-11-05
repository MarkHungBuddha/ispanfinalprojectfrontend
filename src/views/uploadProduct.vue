<script setup>
import navbar from "@/components/navbar.vue";
import axios from 'axios';
import sidebar from "@/components/sidebar.vue";


</script>
<template>
  <v-app>
    <v-container>
      <sidebar></sidebar>
      <v-row>
        <v-col cols="12">
          <v-text-field label="商品名稱" v-model="productName"></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field label="商品價格" v-model="productPrice" type="number"></v-text-field>
        </v-col>


        <v-col cols="6">
          <v-text-field label="商品特價價格" v-model="productDiscountPrice" type="number"></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-select v-model="selectedCategory" :items="categories" label="商品分類"></v-select>
        </v-col>

        <v-col cols="6">
          <v-select v-model="selectedNewOption" :items="getNewOptions(selectedCategory)" label="細項分類"></v-select>
        </v-col>

        <v-col cols="6">
          <v-text-field label="商品數量" v-model="productQuantity" type="number"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea label="商品描述" v-model="productDescription"></v-textarea>
        </v-col>


        <v-btn color="primary" @click="uploadProduct">下一步</v-btn>
      </v-row>


    </v-container>
  </v-app>
</template>

<script>

import axios from "axios";

export default {
  data() {
    return {

      productName: "",
      productPrice: 0,
      productDiscountPrice: 0,
      productQuantity: 0,
      productDescription: "",
      selectedCategory: null,
      selectedNewOption: null,
      categories: ["行動家電", "大型家電", "電腦資訊", "電腦周邊", "小型家電", "視聽娛樂", "辦公耗材"],
      newOptions: {
        "行動家電": ["行動電源_手機配件", "相機配件", "行車導航", "手機", "相機_攝影", "穿戴裝置", "平板電腦"],
        "大型家電": ["洗衣機", "乾衣機", "冷氣", "冰箱"],
        "電腦資訊": ["顯示卡", "硬碟_SSD", "桌上型電腦", "電供_線材", "軟體", "筆記型電腦", "主機板", "記憶體", "光碟機", "機殼 散熱風扇"],
        "電腦周邊": ["外接擴充", "鍵盤滑鼠電競周邊", "外接擴充", "鍵鼠週邊", "線材_接頭", "列印掃描", "電腦耳機_喇叭", "影像輸入裝置", "儲存裝置", "電源周邊", "網路裝置"],
        "小型家電": ["耳機_喇叭", "生活家電", "廚房家電", "健康家電", "季節家電", "烹調家電", "家電配備"],
        "視聽娛樂": ["音樂_錄音", "電視配件", "電視遊樂器", "喇叭音響", "液晶電視", "投影機周邊", "視聽播放", "視聽配件"],
        "辦公耗材": ["墨水碳粉色帶", "光碟片", "工具", "紙材", "辦公OA設備"],
        // 其他商品分類的选项
      },
      categoryMappings: {
        "行動電源_手機配件": 1,
        "相機配件": 2,
        "行車導航": 3,
        "手機": 4,
        "相機_攝影": 5,
        "穿戴裝置": 6,
        "平板電腦": 7,
        "洗衣機": 8,
        "乾衣機": 9,
        "冷氣": 10,
        "冰箱": 11,
        "顯示卡": 12,
        "硬碟_SSD": 13,
        "桌上型電腦": 14,
        "電供_線材": 15,
        "軟體": 16,
        "筆記型電腦": 17,
        "主機板": 18,
        "記憶體": 19,
        "光碟機": 20,
        "機殼 散熱風扇": 21,
        "外接擴充": 22,
        "鍵盤滑鼠電競周邊": 23,
        "外接擴充": 24,
        "鍵鼠週邊": 25,
        "線材_接頭": 26,
        "列印掃描": 27,
        "電腦耳機_喇叭": 28,
        "影像輸入裝置": 29,
        "儲存裝置": 30,
        "電源周邊": 31,
        "網路裝置": 32,
        "耳機_喇叭": 33,
        "生活家電": 34,
        "廚房家電": 35,
        "健康家電": 36,
        "季節家電": 37,
        "烹調家電": 38,
        "家電配備": 39,
        "音樂_錄音": 40,
        "電視配件": 41,
        "電視遊樂器": 42,
        "喇叭音響": 43,
        "液晶電視": 44,
        "投影機周邊": 45,
        "視聽播放": 46,
        "視聽配件": 47,
        "墨水碳粉色帶": 48,
        "光碟片": 49,
        "工具": 50,
        "紙材": 51,
        "辦公OA設備": 52,
      },


    };
  },
  watch: {
    selectedCategory(newCategory) {
      // 当选择新的商品分组时，清空新选项字段
      this.selectedNewOption = null;
    },
  },
  methods: {
    async uploadProduct() {
      const selectedCategoryId = this.categoryMappings[this.selectedNewOption];

      // 用於存放待發送資料的 FormData 對象
      const formData = new FormData();
      formData.append('productname', this.productName);
      formData.append('price', this.productPrice);
      formData.append('specialprice', this.productDiscountPrice);
      formData.append('categoryid', selectedCategoryId);
      formData.append('quantity', this.productQuantity);
      formData.append('description', this.productDescription);


      // 發送表單數據
      axios({
        method: 'post',
        url: 'http://localhost:8080/seller/api/product',
        data: formData,
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        const productId = response.data.productId; // Correctly accessing productId from the response
        if (productId) {
          this.$router.push(`/uploadImage/${productId}`); // Using backticks and ${} to include the productId in the URL
        } else {
          console.error("Product ID was not returned from the API.");
        }
      }).catch(error => {
        console.error("API請求失敗: ", error);
      });
    },
    getNewOptions(category) {
      return this.newOptions[category] || [];
    },
  },
};

</script>
