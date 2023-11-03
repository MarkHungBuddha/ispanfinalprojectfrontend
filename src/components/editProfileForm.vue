<template>
    <v-app>
      <v-container>
        <navbar></navbar>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title>Edit Profile</v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field label="Username" v-model="user.username"></v-text-field>
                  <v-text-field label="First Name" v-model="user.firstname"></v-text-field>
                  <v-text-field label="Last Name" v-model="user.lastname"></v-text-field>
                  <v-text-field label="City" v-model="user.city"></v-text-field>
                  <v-text-field label="Country" v-model="user.country"></v-text-field>
                  <v-text-field label="Gender" v-model="user.gender"></v-text-field>
                  <v-text-field label="Phone" v-model="user.phone"></v-text-field>
                  <v-text-field label="Postal Code" v-model="user.postalcode"></v-text-field>
                  <v-text-field label="Region" v-model="user.region"></v-text-field>
                  <v-text-field label="Street" v-model="user.street"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="updateProfile">Save</v-btn>
              </v-card-actions>
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
          firstname: "",
          lastname: "",
          city: "",
          country: "",
          gender: "",
          phone: "",
          postalcode: "",
          region: "",
          street: "",
        },
        userId: null, // 存储用户ID
      };
    },
    methods: {
      async updateProfile() {
        try {
          // 使用当前登录用户的ID
          const response = await axios.put(`http://localhost:8080/public/api/member/update/${this.userId}`, this.user);
  
          if (response.data && response.data.success) {
            alert(response.data.success);
            // 更新成功后，可以导航回个人资料页面或其他页面
            this.$router.push("/member");
          } else if (response.data && response.data.error) {
            alert(response.data.error);
          } else {
            alert("未知的响应格式");
          }
        } catch (error) {
          console.error("更新时发生错误: ", error.message || "未知的错误");
          alert(error.message || "更新时发生错误");
        }
      },
      async fetchUserProfileData() {
        try {
          const response = await axios.get("http://localhost:8080/public/api/checkLoginStatus");
          const data = response.data;
  
          if (data.isLoggedIn) {
            // 根据登录状态获取用户ID
            this.userId = data.userId; // 存储用户ID
  
            // 根据用户ID获取用户资料
            const userProfileResponse = await axios.get(`http://localhost:8080/public/api/member/${this.userId}`);
            this.user = { ...this.user, ...userProfileResponse.data };
          }
        } catch (error) {
          console.error("获取用户个人资料时发生错误: ", error);
        }
      },
    },
    created() {
      this.fetchUserProfileData();
    },
  };
  </script>
  