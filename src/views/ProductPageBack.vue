<script setup>
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
</script>
<template>
  <v-app>
    <v-main>
      <sidebar></sidebar>
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
            <p v-if="productData.specialPrice && productData.specialPrice !== 0">
              <del>價格: {{ productData.price }}</del>
              <span style="color: red; font-size: 1.5em;">特價價格: {{ productData.specialPrice }}</span>
            </p>
            <p v-else>價格: {{ productData.price }}</p>
            <p>數量: {{ productData.quantity }}</p>
            <p>商品資料:{{ productData.description }}</p>
          </v-col>


        </v-row>

      </v-container>

    </v-main>
  </v-app>
</template>


<script>
import axios from 'axios';

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

    async fetchProductAverageReview(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/public/api/reviews/product/${productId}/average`);
        if (response.status === 200 && response.data) {
          this.rating = response.data.average; // 假设返回的数据结构中包含一个名为"average"的属性
        }
      } catch (error) {
        console.error("Error fetching product average review:", error);
      }
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
          this.dialogMessage = "商品已加入願望清單";
          this.dialogIcon = "mdi-check-circle";
          this.dialogIconColor = "success";
          this.dialog = true;
        } else {
          this.showErrorDialog("Failed to add to wishlist");
        }
      } catch (error) {
        this.showErrorDialog(error.message || "Error adding to wishlist");
      }
    },
    async addToCart() {
      try {
        // 假定 productId 應該是 URL 參數
        const addToCartUrl = `http://localhost:8080/customer/api/shoppingCart?productId=${this.productId}`;
        const response = await axios.post(addToCartUrl);
        if (response.status === 200) {
          this.dialogMessage = "商品已加入購物車";
          this.dialogIcon = "mdi-check-circle";
          this.dialogIconColor = "success";
          this.dialog = true;
        } else {
          this.showErrorDialog("Failed to add to cart");
        }
      } catch (error) {
        this.showErrorDialog(error.message || "Error adding to cart");
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