<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container fluid>
      <navbar/>

      <v-row class="my-4">
        <v-col cols="6" class="font-weight-bold">商品</v-col>
        <v-col cols="6" class="text-right font-weight-bold">操作</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="(item, index) in itemList" :key="item.id" class="py-3 item-row align-center">
        <v-col cols="6" class="d-flex align-center">
          <v-img :src="item.imgUrl" max-width="80" class="mr-3"></v-img>
          <span class="font-weight-medium">{{ item.itemName }}</span>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn small color="primary" @click="addToCart(item)">加入購物車</v-btn>
          <v-btn small color="error" @click="removeFromWishlist(item.id, index)">刪除</v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      itemList: this.$store.state.wishlist.map(item => ({
        id: item.id,
        itemName: item.productname,
        imgUrl: `https://i.imgur.com/${item.productimage}.png`
      }))
    };
  },
  methods: {
    addToCart(item) {
      axios
          .post("http://localhost:8080/customer/api/shoppingCart", {
            productId: item.id
          })
          .then(response => {
            console.log(response.data); // you might want to display this to the user
          })
          .catch(error => {
            console.error(error);
          });
    },
    removeFromWishlist(productId, index) {
      axios
          .delete(`http://localhost:8080/customer/api/wishlist/${productId}`)
          .then(response => {
            this.itemList.splice(index, 1);
            console.log(response.data); // you might want to display this to the user
          })
          .catch(error => {
            console.error(error);
          });
    }
  },
  created() {
    if (!this.$store.state.wishlist.length) {
      axios.get('http://localhost:8080/customer/api/wishlist')
          .then((response) => {
            this.$store.commit('setWishList', response.data);
          });
    }
  }
}
</script>

<style scoped>
body {
  background-color: rgba(0, 0, 0, .2);
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
