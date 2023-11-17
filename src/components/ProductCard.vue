<template>
  <v-card>
    <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
      class="product-image mr-2 clickable-card" @click="navigateToProduct(product.productid)"></v-img>
    <v-card-title class="product-name">{{ product.productname }}</v-card-title>
    <v-card-text>
      <div v-if="product.specialprice > 0" class="special-price">
        特價: <span class="red--text text--accent-4">{{ product.specialprice }}</span>
      </div>
      <div v-else class="original-price">
        原價: {{ product.price }}
      </div>
      <div v-if="product.specialprice > 0" class="original-price text-decoration-line-through">
        原價: {{ product.price }}
      </div>
      <div v-if="product.averageReview">
        平均評價: {{ product.averageReview.toFixed(2) }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" @click="addToCart(product.productid)">加入購物車</v-btn>
      <v-btn icon flat class="wishlist-btn" @click="toggleWishlist(product)">
        <v-icon :color="product.inWishlist ? 'pink' : 'black'">mdi-heart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    product: Object
  },
  methods: {
    navigateToProduct(productid) {
      this.$emit('navigate', productid);
    },
    addToCart(productid) {
      this.$emit('add-to-cart', productid);
    },
    toggleWishlist(product) {
      this.$emit('toggle-wishlist', product);
    }
  }
};
</script>

<style scoped>
.product-image {
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
  /* 當鼠標懸停時輕微放大 */
}

.clickable-card {
  cursor: pointer;
}

.product-name {
  font-size: 1.2em;
  color: #424242;
  font-weight: bold;
  margin: 10px 0;
}

.special-price .red--text {
  color: #ff5252;
  font-weight: bold;
}

.original-price {
  color: #424242;
  font-size: 0.9em;
}

.text-decoration-line-through {
  text-decoration: line-through;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wishlist-btn {
  margin-left: auto;
}

.v-btn {
  border-radius: 4px;
}

.v-btn.success {
  background-color: #4CAF50;
  /* 綠色按鈕 */
  color: white;
}

.v-btn.success:hover {
  background-color: #66BB6A;
  /* 淺綠色 */
}

.v-icon {
  transition: color 0.3s ease;
}

/* 星號評價圖標 */
.v-icon.rating {
  color: #FFD700;
  /* 金色 */
}

/* 心形按鈕的動態樣式 */
.mdi-heart {
  transition: color 0.2s ease-in-out;
}

.mdi-heart:hover {
  color: #F48FB1;
  /* 淺紅色 */
}

/* 確保卡片本身都是相同高度 */
.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;

}

/* 圖像、標題和內容區域應該填充父元素並允許動作欄固定在底部 */
.v-card-title,
.v-card-text {
  flex: 1;
  margin-bottom: 10px;
}

/* 商品名稱過長時使用... */
.product-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制在兩行 */
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em;
  line-height: 1.5em;
  margin: 0;
}
</style>

