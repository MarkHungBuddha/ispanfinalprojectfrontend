<script setup>
import navbar from "@/components/navbar.vue";
import axios from 'axios';
import sidebar from "@/components/sidebar.vue";

</script>
<template>
  <v-app>
    <v-container>

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


        <v-btn color="primary" @click="uploadProduct">送出</v-btn>
      </v-row>


    </v-container>
  </v-app>
</template>

<script>

export default {
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      product: null,
      products: [],          // 原始产品列表
      searchResults: [],     // 搜索结果
      searchQuery: '',
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
        "行動電源_手機配件": 23,
        "相機配件": 24,
        "行車導航": 25,
        "手機": 26,
        "相機_攝影": 27,
        "穿戴裝置": 28,
        "平板電腦": 29,
        "洗衣機": 30,
        "乾衣機": 31,
        "冷氣": 32,
        "冰箱": 33,
        "顯示卡": 8,
        "硬碟_SSD": 9,
        "桌上型電腦": 10,
        "電供_線材": 11,
        "軟體": 12,
        "筆記型電腦": 1,
        "主機板": 2,
        "記憶體": 3,
        "光碟機": 4,
        "機殼 散熱風扇": 5,
        "外接擴充": 6,
        "鍵盤滑鼠電競周邊": 7,
        "外接擴充": 13,
        "鍵鼠週邊": 14,
        "線材_接頭": 15,
        "列印掃描": 16,
        "電腦耳機_喇叭": 17,
        "影像輸入裝置": 18,
        "儲存裝置": 19,
        "電源周邊": 20,
        "網路裝置": 21,
        "耳機_喇叭": 22,
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
  created() {
    // 在这里从 API 获取 product 数据
    this.fetchProducts();
  },
  methods: {
    async uploadProduct() {
      const formData = new FormData();

      // 填充表單數據
      formData.append('productData', new Blob([JSON.stringify({
        productname: this.productName,
        price: this.productPrice,
        specialprice: this.productDiscountPrice,
        categoryid: this.categoryMappings[this.selectedNewOption],
        quantity: this.productQuantity,
        description: this.productDescription,
      })], {
        type: "application/json"
      }));

      try {
        // 發送 PUT 請求
        const response = await axios.put(`http://localhost:8080/seller/api/product/${this.productId}`, formData);

        // 處理響應
        if (response.status === 200) {
          this.$router.push(`/uploadImage/${this.productId}`);

          // ...處理成功響應
        }
      } catch (error) {
        // ...處理錯誤
      }
    },
    getNewOptions(category) {
      return this.newOptions[category] || [];
    },

    fetchProducts() {
      axios.get('http://localhost:8080/seller/api/product', {
        params: { id: this.productId },
      })
          .then((response) => {
            this.product = response.data;

            // 将获取的产品数据设置为表单的默认值
            this.productName = this.product.productName;
            this.productPrice = this.product.price;
            this.productDiscountPrice = this.product.specialPrice;
            this.productQuantity = this.product.quantity;
            this.productDescription = this.product.description;
            // 还可以设置其他表单元素的默认值

          })
          .catch((error) => {
            console.error('API 请求失败：', error);
          });
    },

    fetchProductImages() {
      axios.get(`http://localhost:8080/public/productImage/${this.productId}`)
          .then((response) => {
            // Assuming the response is an array of image URLs
            this.productImages = response.data;
          })
          .catch((error) => {
            console.error('获取产品图像失败：', error);
          });
    },

  },
};

</script>
