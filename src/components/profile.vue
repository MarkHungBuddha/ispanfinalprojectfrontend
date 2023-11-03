<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title class="headline blue lighten-2 white--text">您的資料</v-card-title>
            <v-card-text v-if="isLoggedIn">
              <v-list two-line>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>用戶名稱</v-list-item-title>
                    <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>會員類型</v-list-item-title>
                    <v-list-item-subtitle>{{ user.membertype }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <!-- ... 其他資料欄位 ... -->
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>姓名</v-list-item-title>
                    <v-list-item-subtitle>{{ user.firstname }} {{ user.lastname }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>性別</v-list-item-title>
                    <v-list-item-subtitle>{{ user.gender }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>出生日期</v-list-item-title>
                    <v-list-item-subtitle>{{ user.birthdate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>電話</v-list-item-title>
                    <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>會員創建日期</v-list-item-title>
                    <v-list-item-subtitle>{{ user.membercreationdate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>地址</v-list-item-title>
                    <v-list-item-subtitle>{{ `${user.country}, ${user.city}, ${user.region}, ${user.street}, ${user.postalcode}` }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
  
              </v-list>
              <v-card-actions>
                <v-btn color="primary" text @click="editProfile">編輯資料</v-btn>
              </v-card-actions>
            </v-card-text>
            <v-card-text v-else>
              <v-alert type="warning" text>您尚未登入。</v-alert>
              <v-btn color="primary" @click="login">登入</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
      // 合并用户角色信息和会员数据
      this.user = { ...this.user, ...response.data };
    })
    .catch((error) => {
      console.error("Failed to fetch member data: ", error);
    });
},
      editProfile() {
        // 导航到编辑页面，您可以使用 Vue Router 或其他导航方法
        this.$router.push("/editProfile");
      },
      login() {
        // 导航到登录页面
        this.$router.push("/login");
      },
    },
    created() {
      this.fetchUserProfile();
    },
  };
  </script>
  