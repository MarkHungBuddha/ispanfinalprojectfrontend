<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- 顯示問題和商品信息 -->
        <div>
          <h2>{{ productName }}</h2>
          <v-img :src="productImagePath" aspect-ratio="1.7" max-height="200px" class="mb-3"></v-img>
          <p>問題內容: {{ question }}</p>
          <p>提問人: {{ memberUsername }}</p>
          <v-img :src="memberImgPath" aspect-ratio="1.7" max-height="100px" class="mb-3"></v-img>
        </div>
        <!-- 回答表單 -->
        <form @submit.prevent="submitAnswer">
          <v-textarea v-model="answer" label="您的回答" required></v-textarea>
          <v-btn type="submit" color="primary">提交</v-btn>
        </form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const answer = ref('');
const router = useRouter();
const route = useRoute();

const productName = route.query.productName;
const productImagePath = route.query.productImagePath;
const question = route.query.question;
const memberUsername = route.query.memberUsername;
const memberImgPath = route.query.memberImgPath;

const submitAnswer = async () => {
  try {
    const qandaId = route.params.qandaId;
    const answerText = answer.value; // 获取答案的文本
    const params = new URLSearchParams({ answer: answerText }).toString(); // 创建查询字符串

    await axios.put(`http://localhost:8080/seller/api/product/qanda/answer/${qandaId}?${params}`);
    // 重定向回未回答问题页面
    router.push('/unanswer');
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};

</script>
