<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container fluid>
      <v-row class="my-4">
        <v-col cols="1"></v-col>
        <v-col cols="5" class="font-weight-bold">商品</v-col>
        <v-col cols="2" class="font-weight-bold">數量</v-col>
        <v-col cols="2" class="font-weight-bold">價格</v-col>
        <v-col cols="2" class="text-right font-weight-bold">操作</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="(item, index) in itemList" :key="item.id" class="py-2 item-row align-center">
        <v-card class="pa-2 mb-2 w-100 condensed-card">
          <v-col cols="1">
            <v-checkbox v-model="item.checked"></v-checkbox>
          </v-col>
          <v-col cols="5" class="d-flex align-center">
            <v-img :src="item.imgUrl" width="100" height="100" contain></v-img>
            <span class="font-weight-medium">{{ item.itemName }}</span>
          </v-col>

          <v-col cols="2" class="d-flex align-center">
            <v-btn icon="$vuetify" small color="red" @click="decrement(item)" variant="text">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-text-field
                type="number"
                v-model="item.quantity"
                class="quantity-input"
                @input="onQuantityChange(item)"
            ></v-text-field>

            <v-btn icon="$vuetify" small color="green" @click="increment(item)" variant="text">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>


          <v-col cols="2" class="font-weight-bold">
            <p v-if="item.specialPrice && item.specialPrice !== 0">
              <del>${{ item.price * item.quantity }}</del>
              <span style="color: red; font-size: 1.5em;">${{ item.specialPrice * item.quantity }}</span>
            </p>
            <p v-else>${{ item.price * item.quantity }}</p>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn small color="error" @click="removeFromCart(item.productid, index)">刪除</v-btn>
          </v-col>
        </v-card>
      </v-row>

      <v-divider></v-divider>
      <v-btn @click="checkoutItems">Checkout</v-btn>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      itemList: []
    };
  },
  methods: {
    increment(item) {
      item.quantity++;
      this.changeQuantity(item.productid, item.quantity);
    },
    decrement(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.changeQuantity(item.productid, item.quantity);
      }
    },
    removeFromCart(transactionId, index) {
      axios
          .delete(`http://localhost:8080/customer/api/shoppingCart`, {
            params: {
              transactionId: transactionId
            }
          })
          .then(response => {
            this.itemList.splice(index, 1);
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    },
    changeQuantity(productid, quantity) {
      axios
          .put(`http://localhost:8080/customer/api/change`, null, {
            params: {
              productid: productid, // 這裡也要確保使用 'productid'
              quantity: quantity
            }
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    },
    async checkoutItems() {
      // 過濾出已勾選的物品
      const checkedItems = this.itemList.filter(item => item.checked);

      // 將物品格式化為所需的JSON結構
      const productData = checkedItems.map(item => ({
        productID: item.productid,
        quantity: item.quantity
      }));

      // 輸出格式化後的物品數據
      console.log("即將發送的訂單數據:", productData);

      try {
        // 使用axios發送API請求
        const response = await axios.post("http://localhost:8080/customer/api/order/checkout", productData);

        // 重定向到 /checkoutOrder 頁面並攜帶返回的數據
        const orderData = response.data;
// 使用名稱來導航，並且將數據作為查詢參數傳遞
        this.$router.push({
          name: 'checkoutOrder', // 使用路由配置中定義的名稱
          query: {orderDto: JSON.stringify(orderData)} // 將數據轉為字符串格式作為查詢參數
        });

      } catch (error) {
        // 處理任何錯誤
        console.error("結帳過程中出錯:", error.response ? error.response.data : error.message);
      }
    }
  },
  created() {
    axios
        .get('http://localhost:8080/customer/api/shoppingCart')
        .then((response) => {
          this.itemList = response.data.map(item => ({
            id: item.transactionId,
            productid: item.productId, // 確保這裡使用的是 'productid'
            itemName: item.productname,
            imgUrl: `https://i.imgur.com/${item.imagepath}.jpeg`,
            price: item.price,
            specialPrice: item.specialPrice,
            quantity: item.quantity,
            checked: false
          }));
        });
  },
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
  height: 80px; /* Reduce height */
  align-items: center;
}

.item_detail img {
  width: 60px; /* Reduce image width */
  height: 60px; /* Reduce image height */
  border-radius: 3px;
  float: left;
}

.item_detail .name {
  margin-left: 80px; /* Adjusted for reduced image width */
  margin-top: 15px; /* Adjusted margin */
}

/* Added condensed card styles */
.condensed-card {
  padding: 8px !important;
}

</style>
