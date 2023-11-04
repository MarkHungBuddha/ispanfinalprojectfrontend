<template>
  <v-toolbar :elevation="2" class="custom-navbar">
    <v-toolbar-title>
      <v-btn text @click="redirectTo('/')">
        <img src="https://i.imgur.com/tsjp9Vx.jpg" alt="Logo" class="logo-img">
      </v-btn>
    </v-toolbar-title>

    <v-text-field v-if="!isLoggedIn" v-model="searchText" label="Search" hide-details class="search-bar"
      @input="fetchProductsWithSearch"></v-text-field>

    <v-spacer></v-spacer>

    <v-btn v-if="isLoggedIn" @click="redirectToShoppingCart" icon>
      <img src="https://i.imgur.com/kpCQMH5.png" alt="Shopping Cart" class="icon-img">
    </v-btn>
    <v-btn v-if="isLoggedIn" @click="redirectToWishList" icon>
      <img src="https://i.imgur.com/SDt6WzE.png" alt="Wish List" class="icon-img">
    </v-btn>
    <v-btn v-if="isLoggedIn" @click="logout" class="custom-btn">登出</v-btn>
    <v-btn v-else @click="redirectTo('/login')" class="custom-btn">登入</v-btn>
    <v-btn v-if="!isLoggedIn" @click="redirectTo('/register')" class="custom-btn">註冊</v-btn>
  </v-toolbar>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchText: '',
      searchResults: [], // 搜索结果
      isSearching: false, // 是否正在搜索
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    fetchProductsWithSearch() {
      if (!this.searchText.trim()) {
        // 如果搜索框為空或只有空格，則不進行搜索
        this.clearSearchResults();
        return;
      }

      // 開始搜索，可能還要顯示加載動畫
      this.isSearching = true;

      const params = {
        productname: this.searchText,
        // 其他需要的參數可以在這裡添加
      };
      axios.get('http://localhost:8080/public/api/products', { params })
        .then(response => {
          // 搜索成功，更新搜索結果
          this.updateSearchResults(response.data.content);
        })
        .catch(error => {
          // 處理錯誤
          console.error('搜索請求失敗:', error);
          this.clearSearchResults();
        })
        .finally(() => {
          // 結束搜索
          this.isSearching = false;
        });
    },
    updateSearchResults(results) {
      // 將搜索結果保存到數據屬性中
      this.searchResults = results;
    },
    clearSearchResults() {
      // 清空搜索結果
      this.searchResults = [];
    },

  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      console.log("isLoggedIn changed from", oldVal, "to", newVal);
    },
  },
  created() {
    console.log("isLoggedIn in child:", this.isLoggedIn);
  },

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
  logout() {
    axios.post('http://localhost:8080/customer/member/logout')
      .then(() => {
        this.$store.dispatch('updateLoginStatus', false);
        this.$router.push('/');
      });
  },

  watch: {
    isLoggedIn(newVal, oldVal) {
      console.log("isLoggedIn changed from", oldVal, "to", newVal);
    },
  },
  created() {
    console.log("isLoggedIn in child:", this.isLoggedIn);
  }
};
</script>

<style>
.icon-img {
  width: 24px;
  /* Adjust as needed */
  height: 24px;
}

.custom-navbar {
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
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
