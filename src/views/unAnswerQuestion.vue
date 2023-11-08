<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import sidebar from "@/components/sidebar.vue";
import { VApp, VMain, VContainer, VCard, VCardTitle, VCardText, VDivider, VImg } from 'vuetify/components';
import { useRouter } from 'vue-router';

const unansweredQuestions = ref([]);
const router = useRouter();
const fetchMemberInfo = async (memberId) => {
  try {
    const response = await axios.get(`http://localhost:8080/public/api/member/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching member info:', error);
    return null;
  }
};
const navigateToAnswerForm = (questionDetail) => {
  router.push({
    name: 'AnswerForm',
    params: { qandaId: questionDetail.qandaid }, // 注意這裡的改動
    query: {
      productName: questionDetail.productName,
      productImagePath: questionDetail.productImagePath,
      question: questionDetail.question,
      memberUsername: questionDetail.memberUsername,
      memberImgPath: questionDetail.memberImgPath
    }
  });
};


const fetchProductInfo = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:8080/public/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
};

const fetchProductImage = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:8080/public/productImage/${productId}/first`);
    return response.data; // 直接返回圖片的路徑
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/seller/api/qanda/unanswered');
    const questionsWithDetails = await Promise.all(response.data.map(async (question) => {
      const memberInfo = await fetchMemberInfo(question.buyerMemberid);
      const productInfo = await fetchProductInfo(question.productId);
      const productImagePath = await fetchProductImage(question.productId);
      return {
        ...question,
        memberUsername: memberInfo ? memberInfo.username : 'Unknown',
        memberImgPath: memberInfo ? memberInfo.memberimgpath : '',
        productName: productInfo ? productInfo.productName : 'Unknown',
        productImagePath, // 直接使用獲取到的圖片路徑
      };
    }));
    unansweredQuestions.value = questionsWithDetails;
  } catch (error) {
    console.error('There was an error fetching the unanswered questions:', error);
  }
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <sidebar></sidebar>
        <v-row>
          <v-col v-for="detail in unansweredQuestions" :key="detail.productId" cols="12" sm="6">
            <v-card @click="navigateToAnswerForm(detail)" class="mb-5 question-card">
              <v-card-title>
                {{ detail.productName }}
              </v-card-title>
              <v-divider></v-divider>
              <v-img :src="`https://i.imgur.com/${detail.productImagePath}.jpeg`" aspect-ratio="1.7" max-height="200px"
                     max-width="100%" class="mb-3"></v-img>
              <v-card-text>
                <div>Question: {{ detail.question }}</div>
                <div>Question Time: {{ new Date(detail.questiontime).toLocaleString() }}</div>
                <div>User: {{ detail.memberUsername }}</div>
                <v-img :src="detail.memberImgPath" aspect-ratio="1.7" max-height="100px" max-width="100px"
                       class="mb-3"></v-img>
                <!-- Only show answer fields if there is an answer -->
                <template v-if="detail.answer">
                  <div>Answer: {{ detail.answer }}</div>
                  <div>Answer Time: {{ new Date(detail.answertime).toLocaleString() }}</div>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<style>
/* Add styles for the question card with a background color */
.question-card {
  background-color: #f5f5f5;
  /* Light grey background */
  border-radius: 4px;
}

/* Style for the images */
.v-img {
  border-radius: 4px;
}
</style>
