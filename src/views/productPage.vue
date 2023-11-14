<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container>


      <!-- Breadcrumbs for Parent Category and Category -->
      <v-breadcrumbs divider=">">
        <v-breadcrumb-item>{{ productData.parentCategoryName }}</v-breadcrumb-item>
        >
        <v-breadcrumb-item>{{ productData.categoryName }}</v-breadcrumb-item>
      </v-breadcrumbs>

      <v-chip class="my-2">
        <span>{{ productData.sellerUsername }} ({{ productData.sellerFirstName }} {{
          productData.sellerLastName
        }})</span>
      </v-chip>

      <!-- Carousel to show product images -->
      <v-carousel :key="productImages.length" cycle height="400" hide-delimiter-background show-arrows="hover">
        <v-carousel-item v-for="(imageCode, index) in productImages" :key="index">
          <v-img :src="`https://i.imgur.com/${imageCode}.jpeg`" aspect-ratio="1.7"></v-img>
        </v-carousel-item>
      </v-carousel>

      <!-- Product Details -->
      <v-row>
        <!-- Product Details -->
        <v-col cols="8" md="9">
          <h2>{{ productData.productName }}</h2>
          <v-rating v-model="rating" readonly></v-rating>
          <v-spacer/>
          <span > ({{ roundedRating(rating) }} / 5)</span>

          <span >{{ reviewCount }}則評論</span>
          <p v-if="productData.specialPrice && productData.specialPrice !== 0">
            <del>價格: {{ productData.price }}</del>
            <span style="color: red; font-size: 1.5em;">特價價格: {{ productData.specialPrice }}</span>
          </p>
          <p v-else>價格: {{ productData.price }}</p>
          <p>數量: {{ productData.quantity }}</p>
        </v-col>

        <!-- Buttons -->
        <v-col cols="4" md="3" class="d-flex flex-column align-end justify-start">
          <v-btn color="pink" @click="addToWishlist" class="mb-2 self-end">加入願望清單</v-btn>
          <v-btn color="green" @click="addToCart" class="self-end">加入購物車</v-btn>
        </v-col>
      </v-row>
      <!--      <v-dialog v-model="dialog" max-width="290">-->
      <!--        <v-card>-->
      <!--          <v-card-text>-->
      <!--            <v-icon :color="dialogIconColor">{{ dialogIcon }}</v-icon> {{ dialogMessage }}-->
      <!--          </v-card-text>-->
      <!--        </v-card>-->
      <!--      </v-dialog>-->
      <!--      <v-text-field v-model="question" clearable label="Ask a question"></v-text-field>-->
      <!--      <v-btn @click="submitQuestion">Submit Question</v-btn>-->

      <v-card>
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
          <v-tab :value="1">商品描述</v-tab>
          <v-tab :value="2">商品問與答</v-tab>
          <v-tab :value="3">商品評論</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item :value="1">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-card class="my-3 product-description-card">
                    <v-card-text :style="{ 'white-space': 'pre-line' }">
                      {{ productData.description }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>

          <v-window-item :value="2">
            <v-container style="max-width:600px">
              <v-row v-for="qanda in productQandAs" :key="qanda.questiontime">
                <!-- 问答组合的外部v-card -->
                <v-card class="mb-4 pa-3 chat-screen full-width-card" color="#e8eaf6">
                  <v-card class="mb-2 chat-card question-card">
                    <v-list-item class="received-message">
                      <v-list-item-content>
                        <v-card-text class="pa-2 d-flex flex-column">
                          <span class="text-subtitle-1">{{ qanda.question }}</span>
                          <span class="text-caption font-italic align-self-start">{{ formatTime(qanda.questiontime)
                          }}</span>
                        </v-card-text>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>

                  <!-- 如果存在答案，则显示卖家的回答 -->
                  <v-card v-if="qanda.answer" class="chat-card answer-card">
                    <v-list-item class="sent-message justify-end">
                      <v-list-item-content>
                        <v-card-text class="pa-2 d-flex flex-column">
                          <span class="text-subtitle-1 chat-message">{{ qanda.answer }}</span>
                          <span class="text-caption font-italic align-self-start">{{ formatTime(qanda.answertime)
                          }}</span>
                        </v-card-text>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-card>
              </v-row>
            </v-container>
            <v-card flat>
              <v-card-text>
                <v-text-field v-model="question" label="Ask a question" clearable></v-text-field>
                <v-btn color="primary" @click="submitQuestion">我要提問</v-btn>
              </v-card-text>
            </v-card>
          </v-window-item>


          <v-window-item :value="3">
            <v-container fluid>
              <v-row>
                <v-col cols="12" v-for="review in productReviews" :key="review.orderdetailid">
                  <v-card>
                    <template v-slot:title>
                      <v-rating v-model="review.rating" readonly></v-rating>
                    </template>

                    <template v-slot:subtitle>
                      {{ review.reviewtime }}
                    </template>

                    <template v-slot:text>
                      {{ review.reviewcontent }}
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>



        </v-window>
      </v-card>
    </v-container>
  </v-app>
</template>


<script>
import axios from 'axios';
import Swal from 'sweetalert2';

//時間格式
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  date.setHours(date.getHours() + 8); // 加上 8 小時
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export default {
  data() {
    return {

      breadcrumbs: [
        { text: '商品母分類', disabled: false },
        { text: '商品分類', disabled: true }
      ],
      productImages: [],
      productReviews: [],
      rating: 0, // for example, a 4 out of 5 stars rating
      reviewCount:0,
      productId: null,
      productData: {
        productName: "",
        price: "",
        specialPrice: "",
        quantity: 0,
        description: ""
      },
      productQandAs: [], // For storing the Q&A data
      tab: 1, // Default active tab is "商品描述"
      question: '',
      dialog: false,
      dialogMessage: '',
      dialogIcon: '',
      dialogIconColor: ''
    };
  },
  async mounted() {
    const productId = this.$route.params.productId; // 從路由參數中取得 productId
    this.productId = productId; // 將 productId 設定在元件的數據中
    await this.fetchProductData(productId);
    await this.fetchProductImages(productId);
    await this.fetchProductQandAs(productId);
    await this.fetchProductAverageReview(productId);
    await this.fetchProductReviews(productId);

    // await this.submitQuestion();
  },
  created() {
    const productId = this.$route.params.productId;
  },
  methods: {
    formatTime,
    async fetchProductAverageReview(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/public/api/reviews/product/${productId}/average`);
        if (response.status === 200 && response.data) {
          this.rating = response.data.averageRating; // 假设返回的数据结构中包含一个名为"average"的属性
          this.reviewCount=response.data.reviewCount;
        }
      } catch (error) {
        console.error("Error fetching product average review:", error);
      }
    },
    roundedRating(rating) {
      return (Math.round(rating * 100) / 100).toFixed(2);
    },
    async fetchProductData(productId) {
      this.productId = productId;
      try {

        const response = await axios.get(`http://localhost:8080/public/product/${productId}`);
        if (response.status === 200) {
          this.productData = response.data;
        } else {
          console.error("Failed to fetch product data.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    },
    async fetchProductImages(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/public/productImage/${productId}`);
        if (response.status === 200) {
          this.productImages = response.data;
        } else {
          console.error("Failed to fetch product images.");
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    },
    async fetchProductQandAs(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/public/api/product/${productId}/qanda`);
        if (response.status === 200) {
          this.productQandAs = response.data;
        } else {
          console.error("Failed to fetch product Q&As.");
        }
      } catch (error) {
        console.error("Error fetching product Q&As:", error);
      }
    },
    async fetchProductReviews(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/public/api/reviews/product/${productId}`);
        if (response.status === 200 && response.data) {
          this.productReviews = response.data;
        }
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      }
    },
    async addToWishlist() {
      try {
        const response = await axios.post(`http://localhost:8080/customer/api/wishlist/${this.productData.productId}`);
        if (response.status === 200) {
          //提示窗
          Swal.fire({
            icon: "success",
            title: "商品已加入願望清單",
            showConfirmButton: false,
            timer: 1000
          })
          this.dialogMessage = "商品已加入願望清單";
          this.dialogIcon = "mdi-check-circle";
          this.dialogIconColor = "success";
          this.dialog = true;
        } else {
          this.showErrorDialog("Failed to add to wishlist");
        }
      } catch (error) {
        this.showErrorDialog(error.message || "Error adding to wishlist");
        //提示窗
        Swal.fire({
          icon: "warning",
          title: "商品已經加入願望清單",
          showConfirmButton: false,
          timer: 1000
        })
      }
    },
    async addToCart() {
      try {
        // 假定 productId 應該是 URL 參數
        const addToCartUrl = `http://localhost:8080/customer/api/shoppingCart?productId=${this.productId}`;
        const response = await axios.post(addToCartUrl);
        if (response.status === 200) {
          //提示窗
          Swal.fire({
            icon: "success",
            title: "商品已加入購物車",
            showConfirmButton: false,
            timer: 1000
          })

          this.dialogMessage = "商品已加入購物車";
          this.dialogIcon = "mdi-check-circle";
          this.dialogIconColor = "success";
          this.dialog = true;

        } else {
          this.showErrorDialog("Failed to add to cart");
        }
      } catch (error) {
        //提示窗
        Swal.fire({
          icon: 'error',
          title: '商品加入購物車失敗，庫存不足',
        });
      }
    },

    showErrorDialog(message) {

      this.dialogMessage = message;
      this.dialogIcon = "mdi-alert-circle";
      this.dialogIconColor = "error";
      this.dialog = true;
    },
    async submitQuestion() {
      // Make sure there's a question to submit
      if (!this.question.trim()) {
        this.showErrorDialog("Please enter a question before submitting.");
        return;
      }
      try {
        // Constructing the URL with the question as a query parameter
        const questionUrl = `http://localhost:8080/customer/api/product/qanda/add/${this.productId}?question=${encodeURIComponent(this.question)}`;
        const response = await axios.post(questionUrl); // Sending the GET request to the specified URL
        if (response.status === 200) {
          this.productQandAs.push(response.data);
          this.question = ''; // Clear the input field after successful submission
          this.dialogMessage = "Your question has been submitted successfully.";
          this.dialogIcon = "mdi-check-circle";
          this.dialogIconColor = "green";
          this.dialog = true;
        } else {
          this.showErrorDialog("Failed to submit question");
        }
      } catch (error) {
        this.showErrorDialog(error.response?.data?.message || "Error submitting question");
      }
    },


  },
};
</script>
<style scoped>
.product-description-card {
  background-color: #f6f6f6;
  /* Light gray background */
  /* Add any other styling properties you'd like for the card */
}

.chat-message {
  display: unset !important;
  white-space: break-spaces;
}

.chat-screen {
  max-height: 1000px;
  overflow-y: auto;
}

.flex-none {
  flex: unset;
}

.received-message::after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: 54px;
  right: auto;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #4caf50 transparent transparent transparent;
}

.sent-message::after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 54px;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #1976d2 transparent transparent transparent;
}

.received-message {
  background-color: #f5f5f5;
  border-radius: 8px;
}

.sent-message {
  background-color: #4caf50;
  color: white;
  border-radius: 8px;
}

.chat-card {
  max-width: 60%;
  /* 可根据需要调整，使其不超过75%的宽度 */
  margin: 0 auto;
}

.question-card {
  margin-left: 0;
  margin-right: auto;
}

.answer-card {
  margin-left: auto;
  margin-right: 0;
}

v-card {
  /* 使v-card在容器中居中 */
  max-width: 90%;
  /* 设置v-card的最大宽度为90% */
  /* 设置v-card的下边距 */
  margin: 0 auto 10px;
}

.full-width-card {
  width: 100%;
}
</style>
