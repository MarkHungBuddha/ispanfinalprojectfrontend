<template>
  <v-app>
    <v-main>
      <sidebar-buyer />
      <v-container>
        <div v-for="qa in state.askedQuestions" :key="qa.qandaid" class="mb-4">
          <v-card @click="goToProduct(qa.productId)">
            <v-card-title>
              {{ getProduct(qa.productId)?.productName }}
            </v-card-title>
            <v-card-text>
              <div>問題: {{ qa.question }}</div>
              <div>提問時間: {{ formatTime(qa.questiontime) }}</div>
              <div v-if="qa.answer">回答: {{ qa.answer }}</div>
              <div v-if="qa.answer">回答時間: {{ formatTime(qa.answertime) }}</div>
            </v-card-text>
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
import SidebarBuyer from "../components/sidebarBuyer.vue";

const router = useRouter();
const state = reactive({
  askedQuestions: [],
  productsMap: new Map()
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

const getProduct = (productId) => {
  return state.productsMap.get(productId);
};

const fetchAskedQuestions = async () => {
  try {
    const response = await axios.get('http://localhost:8080/customer/api/qanda/asked');
    state.askedQuestions = response.data;
    for (const qa of state.askedQuestions) {
      await fetchProductInfo(qa.productId); // 為每個問答獲取商品信息
    }
  } catch (error) {
    console.error('Error fetching asked questions:', error);
  }
};

const goToProduct = (productId) => {
  router.push(`/product/${productId}`);
};
//時間格式
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  date.setHours(date.getHours() + 8); // 加上 8 小時
  return date.toISOString().replace('T', ' ').substring(0, 19);
};
onMounted(fetchAskedQuestions);
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
