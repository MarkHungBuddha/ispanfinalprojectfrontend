<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container>
      <navbar/>
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
        <v-col cols="12">
          <v-file-input
              multiple
              show-size
              accept="image/*"
              v-model="productImages"
              :counter="10"
              label="上傳商品圖片 (最多10張)"
          ></v-file-input>
        </v-col>

        <v-col cols="6">
          <v-select
              :items="categories"
              label="商品分類"
              v-model="selectedCategory"
          ></v-select>
        </v-col>

        <v-col cols="6">
          <v-text-field label="商品數量" v-model="productQuantity" type="number"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea label="商品描述" v-model="productDescription"></v-textarea>
        </v-col>

        <v-col cols="12" class="text-right">
          <v-btn color="primary" @click="uploadProduct">上傳商品</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

</template>

<script>
export default {
  data() {
    return {
      productName: "",
      productPrice: 0,
      productDiscountPrice: 0,
      selectedCategory: null,
      productQuantity: 0,
      productDescription: "",
      categories: ["電子產品", "服飾", "食品", "家居用品", "其他"], // 示例分類，可根據需要修改
    };
  },
  methods: {
    uploadProduct() {
      // 在這裡處理商品上傳的邏輯
      console.log("商品上傳");
    },
  },
};
</script>
