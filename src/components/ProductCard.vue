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
/* 可以在這裡加入 ProductCard 特有的樣式 */
</style>
