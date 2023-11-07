<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-overlay :value="isCheckingOut">
      <v-progress-circular indeterminate color="pink-lighten-2"></v-progress-circular>
      <span>結帳中，請稍後....</span>
    </v-overlay>
    <v-dialog v-model="showDialog" persistent>
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDialog = false">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
            <v-btn icon="$vuetify" small color="red" @click="decrement(item, index)" variant="text">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-text-field
                type="number"
                v-model="item.quantity"
                class="quantity-input"
                @input="onQuantityChange(item, index)"
            ></v-text-field>


            <v-btn icon="$vuetify" small color="green" @click="increment(item, index)" variant="text">
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
            <v-btn small color="error" @click="removeFromCart(item.transactionId, index)">刪除</v-btn>
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
      itemList: [],
      showDialog: false,
      dialogMessage: '',
      isCheckingOut: false, // Add this new property
    };
  },
  methods: {
    increment(item, index) {
      let newQuantity = item.quantity + 1;
      this.changeQuantity(item.productid, newQuantity, index);
    },
    decrement(item, index) {
      if (item.quantity > 1) {
        let newQuantity = item.quantity - 1;
        this.changeQuantity(item.productid, newQuantity, index);
      } else {
        // 數量為 1 時直接刪除
        this.removeFromCart(item.productid, index);
      }
    },
    onQuantityChange(item, index) {
      // 使用者直接修改數量欄位時，會調用這個方法
      const quantity = parseInt(item.quantity); // 確保數量是整數
      if (quantity < 1) {
        // 如果數量小於1，則重設為1並返回
        this.$set(this.itemList, index, {
          ...item,
          quantity: 1
        });
        return;
      }
      // 呼叫changeQuantity更新數量
      this.changeQuantity(item.productid, quantity, index);
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
    changeQuantity(productid, quantity, index) {
      axios
          .put(`http://localhost:8080/customer/api/change`, null, {
            params: {
              productid: productid,
              quantity: quantity
            }
          })
          .then(response => {
            console.log(response.data);
            // 如果庫存沒問題，更新數量
            this.itemList[index].quantity = quantity;
          })
          .catch(error => {
            if (error.response && error.response.status === 500) {
              // 如果超出庫存，顯示錯誤並重設數量
              this.showDialog = true;
              this.dialogMessage = '超過庫存';
              this.itemList[index].quantity = this.itemList[index].quantity - 1;
            } else {
              console.error(error);
            }
          });
    },
    async checkoutItems() {
      this.isCheckingOut = true; // Show the overlay
      const checkedItems = this.itemList.filter(item => item.checked);
      const productData = checkedItems.map(item => ({
        productID: item.productid,
        quantity: item.quantity
      }));

      console.log("即將發送的訂單數據:", productData);
      this.isCheckingOut = false; // Hide the overlay

      try {
        const response = await axios.post("http://localhost:8080/customer/api/order/checkout", productData);
        const orderData = response.data;
        console.log("orderData=", orderData);

        // 保存 orderData 到 Vuex store
        this.$store.dispatch('saveOrderData', orderData);

        // 然后跳转到 checkoutOrder 路由
        this.$router.push({ name: 'checkoutOrder' });
      } catch (error) {
        console.error("結帳過程中出錯:", error.response ? error.response.data : error.message);
        this.isCheckingOut = false;
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

.v-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Stack the circular progress and message vertically */
}

</style>
