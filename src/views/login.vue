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
                <v-text-field
                  label="會員帳號"
                  name="username"
                  v-model="username"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  label="會員密碼"
                  name="password"
                  type="password"
                  v-model="password"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showResetPasswordDialog">忘記密碼?</v-btn>
              <v-btn color="primary" @click="handleLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Password Reset Email Dialog -->
      <v-dialog v-model="emailDialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="headline">重置密碼</v-card-title>
          <v-card-text>
            <p>請輸入您的電子郵件地址以繼續。</p>
            <v-text-field
              label="E-mail"
              v-model="resetEmail"
              :rules="emailRules"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEmailDialog">取消</v-btn>
            <v-btn color="success" text @click="sendResetEmail">發送郵件</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Password Reset Dialog -->
      <v-dialog v-model="resetDialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="headline">設定新密碼</v-card-title>
          <v-card-text>
            <p>請輸入您收到的驗證碼以及您的新密碼。</p>
            <v-text-field
              label="驗證碼"
              v-model="resetToken"
              :rules="tokenRules"
              required
            ></v-text-field>
            <v-text-field
              label="新密碼"
              v-model="newPassword"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="resetDialog = false">取消</v-btn>
            <v-btn color="success" text @click="resetPassword">重置密碼</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import navbar from "@/components/navbar.vue";

export default {
  components: {
    navbar
  },
  data() {
    return {
      username: "",
      password: "",
      resetEmail: "",
      newPassword: "",
      resetToken: "",
      emailDialog: false,
      resetDialog: false,
      rules: {
        required: value => !!value || '必填項。'
      },
      emailRules: [
        v => !!v || '電子郵件是必填項。',
        v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件地址。'
      ],
      passwordRules: [
        v => !!v || '密碼是必填項。',
        v => v.length >= 8 || '密碼必須至少有8個字符。'
      ],
      tokenRules: [
        v => !!v || '驗證碼是必填項。'
      ]
    };
  },
  methods: {
    async handleLogin() {
  if (this.$refs.form.validate()) {
    try {
      const postData = new FormData();
      postData.append('username', this.username);
      postData.append('passwdbcrypt', this.password);

      const response = await axios.post('http://localhost:8080/public/api/member/memberLogin', postData);

      // 處理成功響應
      if (response.status === 200) {
        // 登入成功，進行相應操作
        console.log(response.data.message);
        alert(response.data.message);
        // Redirect to homepage or user dashboard
        this.$router.push({ name: 'Home' }); // 'Home' 是路由名稱，根據你的路由設定調整
      }
    } catch (error) {
      if (error.response) {
        // 請求已發出，但服務器以狀態碼
        // 響應，落在2xx的範圍之外
        console.error("登入失敗: ", error.response.data.error);
        alert(error.response.data.error);
      } else if (error.request) {
        // 請求已經發出，但沒有收到響應
        console.error("沒有響應: ", error.request);
      } else {
        // 在設置請求時觸發了某個錯誤
        console.error("錯誤: ", error.message);
      }
      alert(error.message || "登入時發生錯誤");
    }
  }
},

  
    showResetPasswordDialog() {
      this.emailDialog = true; // 打開輸入郵件的對話框
    },
    closeEmailDialog() {
      this.emailDialog = false;
    },
    async sendResetEmail() {
      if (this.emailRules.every(rule => rule(this.resetEmail) === true)) {
        try {
          await axios.post('http://localhost:8080/public/api/request', null, { params: { email: this.resetEmail } });
          alert("驗證信已寄出，請檢查您的郵箱。");
          this.emailDialog = false; // 發送郵件後關閉對話框
          this.resetDialog = true; // 打開輸入驗證碼和新密碼的對話框
        } catch (error) {
          console.error("發送密碼重置郵件時發生錯誤: ", error);
          alert(error.message || "發送密碼重置郵件時發生錯誤。");
        }
      }
    },
    async resetPassword() {
  // Validate the inputs for token and new password based on the rules defined
  if (this.tokenRules.every(rule => rule(this.resetToken) === true) &&
      this.passwordRules.every(rule => rule(this.newPassword) === true)) {
    try {
      // Make a POST request to the reset endpoint with the form data
      const response = await axios.post('http://localhost:8080/public/api/reset', null, {
        params: {
          email: this.resetEmail,
          resetToken: this.resetToken,
          newPassword: this.newPassword
        }
      });
      alert(response.data); // Show the response message from the server
      this.resetDialog = false; // Close the dialog on success
    } catch (error) {
      console.error("There was an error during the password reset process: ", error);
      alert(error.response.data || "An error occurred during the password reset process.");
    }
  }
},
  }
};
</script>

<style scoped>
</style>