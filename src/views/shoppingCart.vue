<script setup>
import navbar from "@/components/navbar.vue";
import Swal from 'sweetalert2';
</script>
<style>
.py-2 div {
  float: left;
  text-align: center;
  width: 90%
}

.my-4 {
  text-align: center;
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
  height: 131px;
}

.item_detail img {
  width: 80px;
  height: 80px;
  border-radius: 3px;
  /* margin-top: 10px; */
  /* float: left; */
}

.item_detail .name {
  margin-bottom: 20px;
  margin-inline: auto;
}

/* Added condensed card styles */
.condensed-card {
  padding: 8px !important;
}

.v-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* Stack the circular progress and message vertically */
}

body {
  background-color: rgba(236, 239, 241, 0.3);
  /* 輕微半透明的藍灰色背景 */
}

.my-4 {
  width: 90%;
  margin: 0 auto;
  border-radius: 10px;
  background-color: white;
}

.item-row {
  width: 90%;
  margin: 0 auto;
}

.condensed-card {
  border-radius: 10px;
  /* 添加圓角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  /* 添加陰影以提升層次感 */
}

/* Added condensed card styles */
.condensed-card {
  padding: 8px !important;
}

/* 結帳按鈕樣式 */
.checkout-btn {
  float: right;
  margin-top: 4px;
  /* 增加字體大小 */
  background-color: #359f43;
  color: white;
  /* 字體顏色為白色 */
  border: none;
  /* 去除邊框 */
  border-radius: 5px;
  /* 輕微圓角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  /* 添加陰影 */
}

.changecolor {
  background-color: rgba(219, 120, 120, 0.307)
}
</style>
<template>
  <v-app>
    <v-overlay :value="isCheckingOut">
      <v-progress-circular indeterminate color="pink-lighten-2"></v-progress-circular>
      <span>結帳中，請稍後....</span>
    </v-overlay>
    <!-- <v-dialog v-model="showDialog" persistent>
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>{{ dialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDialog = false">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-container fluid>
      <v-row class="my-4">
        <v-col cols="1"></v-col>
        <v-col cols="5" class="mb-2">商品</v-col>
        <v-col cols="2">數量</v-col>
        <v-col cols="2">金額</v-col>
        <v-col cols="2" class="text-center">操作</v-col>
      </v-row>

      <v-divider></v-divider>


      <v-row v-for="(item, index) in itemList" :key="item.id" class="py-2 item-row align-center item_body">
        <v-card class="pa-2 mb-2 w-100 condensed-card" :class="{ 'changecolor': item.checked }">
          <v-col cols="1">
            <v-checkbox v-model="item.checked" @click="checkedchange()"></v-checkbox>
          </v-col>
          <v-col cols="5" class="d-flex align-center item_detail">
            <v-img :src="item.imgUrl" width="100" height="100" contain></v-img>
            <span class="font-weight-medium name">{{ item.itemName }}</span>
          </v-col>
          <v-col cols="2" class="d-flex align-center item_detail">
            <v-btn icon="$vuetify" small color="red" @click="decrement(item, index)" variant="text">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-text-field type="number" v-model="item.quantity" class="quantity-input"
              @input="onQuantityChange(item, index)"></v-text-field>
            <v-btn icon="$vuetify" small color="green" @click="increment(item, index)" variant="text">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>


          <v-col cols="2" class="font-weight-bold item_detail" style="margin-top:20px">
            <p v-if="item.specialprice && item.specialprice !== 0">
              <del>${{ item.price * item.quantity }}</del>
              <span style="color: red; font-size: 1.5em;">${{ item.specialprice * item.quantity }}</span>
            </p>
            <p v-else>${{ item.price * item.quantity }}</p>
          </v-col>

          <v-col cols="2" class="text-center item_detail" style="margin-top:20px">
            <v-btn small color="error" @click="removeFromCart(item.transactionId, index)">刪除</v-btn>
          </v-col>

        </v-card>
        <v-col><v-btn @click="checkoutItems" class="checkout-btn">Checkout</v-btn></v-col>
      </v-row>



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
    // 數量為 1 時直接刪除
    decrement(item, index) {
      if (item.quantity > 1) {
        let newQuantity = item.quantity - 1;
        this.changeQuantity(item.productid, newQuantity, index);
      } else {
        // 刪除提示窗
        Swal.fire({
          title: "你確定要刪除購物車商品嗎?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "確定",
          cancelButtonText: "返回"
        }).then((result) => {
          if (result.isConfirmed) {
            //刪除邏輯
            this.removeFromCart(item.transactionId, index);

            Swal.fire({
              title: "刪除購物車商品成功",
              icon: "success"
            });
          }
        });

      }



    },

    onQuantityChange(item, index) {
      // 使用者直接修改數量欄位時，會調用這個方法
      const quantity = parseInt(item.quantity); // 確保數量是整數
      if (quantity < 1) {
        this.removeFromCart(item.productid, index);
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
            Swal.fire({
              icon: "warning",
              title: "超出庫存",
              showConfirmButton: false,
              timer: 1000
            })
            // this.itemList[index].quantity = this.itemList[index].quantity - 1;
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
        this.itemList = response.data.map(item => {
          console.log(item.transactionId); // 打印每個項目的 transactionId，用於調試
          return {
            transactionId: item.transactionId,
            productid: item.productId,
            itemName: item.productname,
            imgUrl: `https://i.imgur.com/${item.imagepath}.jpeg`,
            price: item.price,
            specialprice: item.specialprice, // 確保這裡使用的是 'specialprice'
            quantity: item.quantity,
            checked: false
            // ...添加其他需要的屬性
          };
        });
      })
      .catch(error => {
        console.error("Error fetching shopping cart data:", error);
      });
  }
}
</script>
