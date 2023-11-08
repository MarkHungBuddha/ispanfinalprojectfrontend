<template>
  <v-toolbar :elevation="2" class="custom-navbar">
    <v-toolbar-title>
      <v-btn text @click="redirectTo('/')">
        <img src="https://i.imgur.com/tsjp9Vx.jpg" alt="Logo" class="logo-img">
      </v-btn>
      <v-btn v-if="isLoggedIn" text @click="redirectTo('/seller')" icon>
        <img src="https://i.imgur.com/MBHoqXu.png" alt="Seller" class="icon-img">
      </v-btn>
    </v-toolbar-title>

    <!-- 新的搜尋框組件 -->

    <v-card class="d-flex align-center justify-center" color="grey-lighten-3" style="width: 40%; padding: 0;">
      <v-card-text style="padding: 0;">
        <v-text-field v-model="searchText" :loading="loading" density="compact" variant="solo" label="Search templates"
          append-inner-icon="mdi-magnify" single-line hide-details @click:append-inner="onClick"></v-text-field>
      </v-card-text>
    </v-card>




    <v-spacer></v-spacer>

    <!-- 購物車按鈕 -->
    <v-btn v-if="isLoggedIn" @click="redirectToShoppingCart" icon>
      <img src="https://i.imgur.com/YHFDBf9.png" alt="Shopping Cart" class="icon-img">
    </v-btn>
    <!-- 願望清單按鈕 -->
    <v-btn v-if="isLoggedIn" @click="redirectToWishList" icon>
      <img src="https://i.imgur.com/35bjgaz.png" alt="Wish List" class="icon-img">
    </v-btn>
    <!-- 訂單按鈕 -->
    <v-btn v-if="isLoggedIn" @click="redirectTo('/order')" icon>
      <img src="https://i.imgur.com/H8nqWWB.png" alt="Order" class="icon-img">
    </v-btn>
    <!-- 會員中心按鈕 -->
    <v-btn v-if="isLoggedIn" @click="redirectTo('/member')" icon>
      <!-- <img src="https://i.imgur.com/WYW1y2p.png" alt="Member" class="icon-img"> -->
      <img src="https://i.imgur.com/F6mWj8r.png" alt="Member" class="icon-img">
    </v-btn>
    <!-- 登出按鈕 -->
    <v-btn v-if="isLoggedIn" @click="logout" class="custom-btn">登出</v-btn>
    <!-- 登入按鈕 -->
    <v-btn v-else @click="redirectTo('/login')" class="custom-btn">登入</v-btn>
    <!-- 註冊按鈕 -->
    <v-btn v-if="!isLoggedIn" @click="redirectTo('/register')" class="custom-btn">註冊</v-btn>
  </v-toolbar>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchText: '',
      loading: false
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    }
  },
  methods: {
    redirectTo(path) {
      this.$router.push(path);
    },
    redirectToShoppingCart() {
      axios.get('http://localhost:8080/customer/api/shoppingCart')
        .then(() => {
          this.$router.push('/shoppingCart');
        });
    },
    redirectToWishList() {
      axios.get('http://localhost:8080/customer/api/wishlist')
        .then((response) => {
          this.$store.commit('setWishList', response.data);
          this.$router.push('/wishList');
        });
    },
    onClick() {
      console.log('Search Text:', this.searchText); // 加入這行來輸出搜尋文本
      const search = this.searchText;
      this.loading = true;
      // 執行搜尋
      axios.get("http://localhost:8080/public/api/products", {
        params: {
          productname: search,
        }
      }).then((response) => {
        this.loading = false;
        // 導航到 searchResult.vue 並帶上搜尋字串
        this.$router.push({ name: 'searchResult', query: { search: this.searchText } });
      }).catch((error) => {
        this.loading = false;
        console.error("Error during search:", error);
      });
    },

    logout() {
      axios.post('http://localhost:8080/customer/member/logout')
        .then(() => {
          this.$store.dispatch('updateLoginStatus', false);
          this.$router.push('/');
        });
    }
  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      console.log("isLoggedIn changed from", oldVal, "to", newVal);
    }
  },
  created() {
    console.log("isLoggedIn in child:", this.isLoggedIn);
  }
};
</script>

<style>
.icon-img {
  width: 40px;
  /* Adjust as needed */
  height: 40px;
}

.custom-navbar {
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
  margin: 0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.search-bar {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.search-bar:focus-within {
  background-color: rgba(255, 255, 255, 0.3);
}

.custom-btn {
  background-color: white;
  color: #FE6B8B;
  margin-left: 10px;
  border-radius: 25px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.custom-btn:hover {
  background-color: #FF8E53;
  color: white;
}

.logo-img {
  width: 40px;
  /* Adjust as needed */
  height: 80%;
}
</style>
