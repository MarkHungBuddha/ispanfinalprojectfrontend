<template>
  <v-app>
    <v-container fluid>
      <navbar></navbar>

      <v-row class="header my-5 justify-center">
        <v-col cols="12" md="10">
          <v-subheader>商品</v-subheader>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-row class="item-row justify-space-between">
            <v-col cols="12" md="2" v-for="(item, index) in paginatedItemList" :key="item.id" class="d-flex flex-column align-center justify-center item-box mb-5">
              <v-img :src="item.imgUrl" width="100" height="100" class="mb-2 item-image"></v-img>
              <span class="font-weight-bold mb-1">{{ item.itemName }}</span>
              <span class="mb-1">{{ item.category }}</span>
              <span class="mb-2">{{ item.price }} 元</span>
              <v-btn small color="primary" @click="addToWishlist(item)" class="mb-1">加入願望清單</v-btn>
              <v-btn small color="secondary" @click="addToCart(item)">加入購物車</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="justify-center mt-5">
        <v-pagination
            v-model="currentPage"
            :length="Math.ceil(itemList.length / itemsPerPage)"
            color="primary"
            circle
        ></v-pagination>
      </v-row>
    </v-container>
  </v-app>
</template>



<script>
import navbar from "@/components/navbar.vue";

export default {
  components: {
    navbar,
  },
  data() {
    return {
      itemList: [
        {
          id: '5',
          itemName: '时尚连衣裙',
          imgUrl: 'https://i.imgur.com/JG5bQ.jpg',
          price: '750',
          count: '1',
          category: '服装'
        },
        {
          id: '6',
          itemName: '男士运动鞋',
          imgUrl: 'https://i.imgur.com/dZqLp.jpg',
          price: '1200',
          count: '1',
          category: '鞋类'
        },
        {
          id: '7',
          itemName: '女士手提包',
          imgUrl: 'https://i.imgur.com/xcrGu.jpg',
          price: '950',
          count: '1',
          category: '包包'
        },
        {
          id: '8',
          itemName: '家用咖啡机',
          imgUrl: 'https://i.imgur.com/UlatUJa.jpg',
          price: '300',
          count: '1',
          category: '家電'
        },
        {
          id: '9',
          itemName: '智能手表',
          imgUrl: 'https://i.imgur.com/YMUYK.jpg',
          price: '450',
          count: '1',
          category: '电子'
        },
        // Add more items as needed
      ],
      currentPage: 1,
      itemsPerPage: 25,
    };
  },
  computed: {
    paginatedItemList() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.itemList.slice(startIndex, endIndex);
    },
  },
  methods: {
    addToCart(item) {
      // Implement your addToCart logic here
    },
    handleDelete(index) {
      this.itemList.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.item-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.item-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
  margin-bottom: 30px;
}

.item-box {
  padding: 15px;
  border: 1px solid transparent; /* 这可以保证所有盒子的大小一致，即使它们内容不同 */
}

.item-image {
  object-fit: contain;
}


</style>
