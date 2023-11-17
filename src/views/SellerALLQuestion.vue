<template>
  <v-app>
    <v-main>
      <sidebar></sidebar>
      <v-container fluid>
        <!-- 顯示問答的列表 -->
        <div v-if="qandas.length > 0">
          <v-card
              v-for="qanda in qandas"
              :key="qanda.qandaid"
              class="mb-4"
              @click="goToProductPage(qanda.productId)"
          >
            <v-card-title>問題: {{ qanda.question }}</v-card-title>
            <v-card-text>
              <div>問題時間: {{ qanda.questiontime }}</div>
              <div v-if="qanda.answer">回答: {{ qanda.answer }}</div>
              <div v-if="qanda.answertime">回答時間: {{ qanda.answertime }}</div>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          目前沒有問答。
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import sidebar from "@/components/sidebar.vue";

const router = useRouter();
const qandas = ref([]);

const fetchQandAs = async () => {
  try {
    const response = await axios.get('http://localhost:8080/seller/api/qanda/all');
    qandas.value = response.data;
  } catch (error) {
    console.error('Error fetching QandAs:', error);
  }
};

const goToProductPage = (productId) => {
  // 確保你的路由配置中有 `/product/:productId` 的路徑
  router.push(`/product/${productId}`);
};

onMounted(fetchQandAs);
</script>


<style scoped>

</style>
