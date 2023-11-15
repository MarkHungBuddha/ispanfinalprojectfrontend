<template>
  <v-toolbar :elevation="2" class="custom-navbar">
    <v-toolbar-title>
      <v-btn text @click="redirectTo('/')">
        <img src="https://i.imgur.com/tsjp9Vx.jpg" alt="Logo" class="logo-img">
      </v-btn>
      <v-btn v-if="isLoggedIn && userType < 3" text @click="redirectTo('/seller')" icon>
        <img src="https://i.imgur.com/MBHoqXu.png" alt="Seller" class="icon-img">
      </v-btn>

    </v-toolbar-title>

    <!-- 新的搜尋框組件 -->

    <v-card class="d-flex align-center justify-center" color="grey-lighten-3" style="width: 40%; padding: 0;">
      <v-card-text style="padding: 0;">
        <v-text-field v-model="searchText" :loading="loading" density="compact" variant="solo" label="Search templates"
          append-inner-icon="mdi-magnify" single-line hide-details @click:append="onClick" @keyup.enter="onClick">
          <!-- 點擊(click:append)放大鏡圖標時觸發搜索 --><!-- 按下 Enter 鍵時觸發搜索 -->
        </v-text-field>
      </v-card-text>
    </v-card>




    <v-spacer></v-spacer>
    <!-- 頭像顯示 -->


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
      <img src="https://i.imgur.com/xS0SdbL.png" alt="Order" class="icon-img">
    </v-btn>
    <!-- 會員中心按鈕 -->
    <v-btn v-if="isLoggedIn" @click="redirectTo('/member')" icon class="elevation-6">
      <!-- <img src="https://i.imgur.com/WYW1y2p.png" alt="Member" class="icon-img"> -->
      <v-avatar size="45">
        <img :src="imageFullPath" alt="Profile image" class="avatar-img">
      </v-avatar>

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
      loading: false,
      userType: null,  // 添加用於存儲用戶類型的變數
      user: { memberimgpath: "" }, //頭像
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },

    imageFullPath() {
      const { memberimgpath } = this.user;
      return memberimgpath ? `https://i.imgur.com/${memberimgpath}.jpg` : '';
    },
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
      axios.get('http://localhost:8080/public/api/wishlist')
        .then((response) => {
          this.$store.commit('setWishList', response.data);
          this.$router.push('/wishList');
        });
    },
    onClick() {
      this.$router.push({ name: 'ProductFuzzySearch', query: { search: this.searchText } });

    },

    logout() {
      axios.post('http://localhost:8080/public/member/logout')
        .then(() => {
          this.$store.dispatch('updateLoginStatus', false);
          this.$router.push('/');
        });
    },
    getuserType() {
      axios.get("http://localhost:8080/public/api/userType")
        .then(response => {
          this.userType = response.data; // 將用戶類型存儲到 userType 變數
        })
        .catch(error => {
          console.error("Error fetching user type:", error);
        });
    },
    async fetchUserProfile() {
      try {
        const { data } = await axios.get("http://localhost:8080/public/api/checkLoginStatus");
        if (data.isLoggedIn) {
          this.$store.dispatch('updateLoginStatus', true);
          this.userType = data.role; // 根据返回的 role 更新 userType
          this.fetchMemberData(data.memberId);
        } else {
          this.$store.dispatch('updateLoginStatus', false);
        }
      } catch (error) {
        console.error("Failed to fetch user profile: ", error);
      }
    },
    // 頭像
    async fetchMemberData(memberId) {
      try {
        const { data } = await axios.get(`http://localhost:8080/public/api/member/${memberId}`);
        this.user = { ...this.user, ...data };
      } catch (error) {
        console.error("Failed to fetch member data: ", error);
      }
    }



  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      console.log("isLoggedIn changed from", oldVal, "to", newVal);
    }
  },
  created() {
    console.log("isLoggedIn in child:", this.isLoggedIn);
  },
  mounted() {
    this.getuserType(); // 在組件掛載後調用 getuserType 方法
    if (this.isLoggedIn) {

      this.fetchUserProfile();
      this.fetchMemberData();
    }
  },
};

</script>


<style scoped>
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

/**頭像*/
.avatar-img {
  border-radius: 50%;
  object-fit: cover;
  /* 確保圖片填滿頭像區域 */
  width: 100%;
  height: 100%;
}
</style>
