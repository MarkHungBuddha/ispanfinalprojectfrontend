<template>
    <div>
      <h1>Your Profile</h1>
      <div v-if="isLoggedIn">
        <p>Username: {{ user.username }}</p>
        <p>Member Type: {{ user.membertype }}</p>
        <p>Member Image: {{ user.memberimgpath }}</p>
        <p>First Name: {{ user.firstname }}</p>
        <p>Last Name: {{ user.lastname }}</p>
        <p>Gender: {{ user.gender }}</p>
        <p>Birthdate: {{ user.birthdate }}</p>
        <p>Phone: {{ user.phone }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Member Creation Date: {{ user.membercreationdate }}</p>
        <p>Address: {{ user.country }}, {{ user.city }}, {{ user.region }}, {{ user.street }}, {{ user.postalcode }}</p>
        <button @click="editProfile">Edit Profile</button>
      </div>
      <div v-else>
        <p>You are not logged in.</p>
        <button @click="login">Login</button>
      </div>
    </div>
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
        this.$router.push("/edit-profile");
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
  