<template>
  <v-app>
    <v-main>
      <sidebar></sidebar>
      <v-container fluid>
        <div v-if="reviews.length > 0">
          <v-card
              v-for="review in reviews"
              :key="review.orderid"
              class="mb-4"
              @click="goToProduct(review.productid)"
          >
            <v-card-title>商品名稱: {{ productsMap.get(review.productid)?.productName }}</v-card-title>
            <v-card-text>
              <div>訂單編號: {{ review.orderid }}</div>
              <div>評分: {{ review.rating }}</div>
              <div>評論內容: {{ review.reviewcontent }}</div>
              <div>評論時間: {{ review.reviewtime }}</div>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          目前沒有評價。
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import sidebar from "@/components/sidebar.vue";
import navbar from "@/components/navbar.vue";

const router = useRouter();
const reviews = ref([]);
const productsMap = reactive(new Map());

const fetchProductInfo = async (productId) => {
  if (productsMap.has(productId)) {
    return productsMap.get(productId);
  } else {
    try {
      const response = await axios.get(`http://localhost:8080/public/product/${productId}`);
      productsMap.set(productId, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product info:', error);
      return null;
    }
  }
};

const fetchReviewsAndProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/seller/api/reviews');
    reviews.value = response.data;
    for (const review of reviews.value) {
      await fetchProductInfo(review.productid);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

const goToProduct = (productId) => {
  router.push(`/product/${productId}`);
};

onMounted(fetchReviewsAndProducts);
</script>


<style scoped>
.v-application {
  background-image: url('@/assets/seller01.png'), linear-gradient(to bottom, #dfdd8d, #d0aaae);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

/* 歡迎文字 */
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 這會將所有子元素對齊到容器的頂部 */
  align-items: center;
  height: 100vh;
  padding-top: 300px;
  /* 可以調整這個值來改變上邊距 */
}

.welcome-message {
  font-size: 3rem;
}
</style>
