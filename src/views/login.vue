<script setup>
import axios from "axios"; // 引入axios
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container>
      <navbar />
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-card-title>Login</v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Username" name="username" v-model="username" :rules="[rules.required]"
                  required></v-text-field>
                <v-text-field label="Password" name="password" type="password" v-model="password"
                  :rules="[rules.required]" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="handleLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      rules: {
        required: value => !!value || 'Required.'
      }
    };
  },
  methods: {
    async handleLogin() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post(`http://localhost:8080/public/api/member/memberLogin?username=${this.username}&passwdbcrypt=${this.password}`);

          if (response.data && response.data.success) {
            // 登入成功，進行相應操作
            console.log(response.data.success);
            alert(response.data.success);
          } else if (response.data && response.data.error) {
            // 登入失敗，顯示後端返回的錯誤信息
            console.error(response.data.error);
            alert(response.data.error);
          } else {
            console.error("未知的響應格式");
          }
        } catch (error) {
          console.error("登入時發生錯誤: ", error.message || "未知的錯誤");
          alert(error.message || "登入時發生錯誤");
        }
      }
    }
  }
};
</script>


<style scoped></style>
