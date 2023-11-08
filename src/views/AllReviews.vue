<template>
  <v-app>
    <v-main>
      <v-container>
        <div v-for="review in state.reviews" :key="review.orderid" class="mb-4">
          <v-card
              @click="goToProduct(review.productid)"
          >
            <v-card-title>
              {{ state.productsMap.get(review.productid)?.productName }}
            </v-card-title>
            <v-card-text>
              <div>{{ review.reviewcontent }}</div>
            </v-card-text>
            <div>評分: {{ review.rating }} / 5</div>
            <div>評價時間: {{ review.reviewtime }}</div>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>



<script setup>
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const router = useRouter();
const state = reactive({
  product: null,
  reviews: [],
  productsMap: new Map() // 使用 Map 來存儲每個評論對應的商品信息
});

const fetchProductInfo = async (productId) => {
  if (state.productsMap.has(productId)) {
    return state.productsMap.get(productId);
  } else {
    try {
      const response = await axios.get(`http://localhost:8080/public/product/${productId}`);
      state.productsMap.set(productId, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product info:', error);
      return null;
    }
  }
};

const fetchReviewsAndProducts = async () => {
  try {
    const reviewsResponse = await axios.get('http://localhost:8080/seller/api/reviews');
    state.reviews = reviewsResponse.data;
    for (const review of state.reviews) {
      await fetchProductInfo(review.productid); // 為每個評論獲取商品信息
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
  background-image: url('@/assets/buy01.png'), linear-gradient(to bottom, rgb(243, 215, 163), rgb(129, 245, 245));
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}

.item_header {
  display: flex;
  width: 1000px;
  margin: 0 auto;
  height: 30px;
  background-color: #fff;
  border-radius: 3px;
  padding-left: 10px;
}

.item_header div {
  width: 200px;
  color: #888;
  line-height: 30px;
}

.item_header .item_detail {
  width: 50%;
}

.item_body {
  margin-top: 20px;
  height: 100px;
  align-items: center;
}

.item_detail img {
  width: 80px;
  height: 80px;
  border-radius: 3px;
  /* margin-top: 10px; */
  float: left;
}

.item_detail .name {
  margin-left: 100px;
  margin-top: 20px;
}

.item-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}
</style>
