<template>
  <v-toolbar :elevation="2" class="custom-navbar">
    <v-toolbar-title>
      <v-btn text @click="redirectTo('/')">
        <img src="https://i.imgur.com/tsjp9Vx.jpg" alt="Logo" class="logo-img">
      </v-btn>
    </v-toolbar-title>

    <v-text-field
        v-if="!isLoggedIn"
        v-model="searchText"
        label="Search"
        hide-details
        class="search-bar"
    ></v-text-field>

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
  width: 24px; /* Adjust as needed */
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
  width: 40px; /* Adjust as needed */
  height: 80%;
}

</style>
