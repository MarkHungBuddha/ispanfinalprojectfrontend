<template>
  <v-app>
    <v-container>
      <navbar/>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-card-title>Your Profile</v-card-title>
            <v-card-text>
              <div v-if="isLoggedIn">
                <p>大頭照: {{ user.memberimgpath }}</p>
                <p>會員帳號: {{ user.username }}</p>
                <p>會員類型: {{ user.membertype }}</p>
                <p>姓氏: {{ user.lastname }}</p>
                <p>名字: {{ user.firstname }}</p>
                <p>性別: {{ user.gender }}</p>
                <p>生日: {{ user.birthdate }}</p>
                <p>手機: {{ user.phone }}</p>
                <p>Email: {{ user.email }}</p>
                <p>會員註冊日期: {{ user.membercreationdate }}</p>
                <p>地址: {{ user.country }}, {{ user.city }}, {{ user.region }}, {{ user.street }}, {{ user.postalcode }}</p>
                <v-btn @click="editProfile">Edit Profile</v-btn>
              </div>
              <div v-else>
                <p>You are not logged in.</p>
                <v-btn @click="login">Login</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        username: "",
        membertype: "",
        memberimgpath: "",
        firstname: "",
        lastname: "",
        gender: "",
        birthdate: "",
        phone: "",
        email: "",
        membercreationdate: "",
        country: "",
        city: "",
        region: "",
        street: "",
        postalcode: "",
      },
      isLoggedIn: false,
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get("http://localhost:8080/public/api/checkLoginStatus");
        const data = response.data;
        if (data.isLoggedIn) {
          this.user.username = data.username;
          this.user.membertype = data.role;
          this.isLoggedIn = true;
          this.fetchMemberData(data.userId);
        }
      } catch (error) {
        console.error("Failed to fetch user profile: ", error);
      }
    },
    fetchMemberData(userId) {
      axios
        .get(`http://localhost:8080/public/api/member/${userId}`)
        .then((response) => {
          // 合併用戶角色信息和成員數據
          this.user = { ...this.user, ...response.data };
        })
        .catch((error) => {
          console.error("Failed to fetch member data: ", error);
        });
    },
    editProfile() {
      // 使用 Vue Router 或其他導航方法跳轉到編輯個人資料頁面
      this.$router.push("/editprofile");
    },
    login() {
      // 使用 Vue Router 跳轉到登入頁面
      this.$router.push("/login");
    },
  },
  created() {
    this.fetchUserProfile();
  },
};
</script>
