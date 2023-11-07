<template>
  <v-container>
    <v-form @submit.prevent="registerUser">
      <!-- Google Login Button -->
      <v-btn @click="handleGoogleLogin" color="primary">使用 Google 註冊</v-btn>
      <!-- Username Field -->
      <v-text-field
        v-model="username"
        label="帳號"
        required
        clearable
        @blur="validateUsername"
      ></v-text-field>
      <!-- Validation for Username -->
      <div v-if="usernameFeedback" class="validation-result">
        <v-icon :class="usernameFeedback.type">{{ usernameFeedback.icon }}</v-icon>
        <span :class="usernameFeedback.type">{{ usernameFeedback.message }}</span>
      </div>
      <!-- Password Field -->
      <v-text-field
        v-model="password"
        label="密碼"
        type="password"
        required
        clearable
        @blur="validatePassword"
        autocomplete="new-password"
      ></v-text-field>
      <!-- Validation for Password -->
      <div v-if="passwordFeedback" class="validation-result">
        <v-icon :class="passwordFeedback.type">{{ passwordFeedback.icon }}</v-icon>
        <span :class="passwordFeedback.type">{{ passwordFeedback.message }}</span>
      </div>
      <!-- Email Field -->
      <v-text-field
      v-model="email"
      label="Email"
      type="email"
      required
      :readonly="googleSignedIn"
    ></v-text-field>
      <!-- Verification Code Section -->
      <div v-if="!googleSignedIn">
        <v-btn @click="sendVerificationCode" color="primary" :disabled="emailLocked">寄送驗證碼</v-btn>
        <!-- Validation for Email -->
        <div v-if="emailFeedback" class="validation-result">
          <v-icon :class="emailFeedback.type">{{ emailFeedback.icon }}</v-icon>
          <span :class="emailFeedback.type">{{ emailFeedback.message }}</span>
        </div>
        <v-text-field
          v-model="verificationCode"
          label="驗證碼"
          required
          v-if="emailLocked"
        ></v-text-field>
        <v-btn @click="confirmVerificationCode" color="primary" :disabled="!emailLocked">確認驗證碼</v-btn>
        <!-- Validation for Verification Code -->
        <div v-if="verificationFeedback" class="validation-result">
          <v-icon :class="verificationFeedback.type">{{ verificationFeedback.icon }}</v-icon>
          <span :class="verificationFeedback.type">{{ verificationFeedback.message }}</span>
        </div>
      </div>
      <!-- Submit Button -->
      <v-btn type="submit" color="primary">送出</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      verificationCode: '',
      usernameFeedback: null,
      passwordFeedback: null,
      emailFeedback: null,
      emailLocked: false,
      verificationFeedback: null,
      googleSignedIn: false,
      googleUserData: null,
      isCodeVerified: false,
    };
  },
  methods: {
    validateUsername() {
  // 檢查是否至少有5個字符且全部為英數字母
  const usernamePattern = /^[A-Za-z0-9]{5,}$/;
  if (!usernamePattern.test(this.username)) {
    this.usernameFeedback = {
      type: 'error-message',
      icon: 'mdi-close-circle',
      message: '帳號至少需要5個字符，且只能包含英文字母和數字。',
    };
  } else {
    this.usernameFeedback = {
      type: 'success-message',
      icon: 'mdi-check-circle',
      message: '帳號有效。',
    };
  }
},
validatePassword() {
  // 檢查是否至少有8個字符且全部為英數字母
  const passwordPattern = /^[A-Za-z0-9]{8,}$/;
  if (!passwordPattern.test(this.password)) {
    this.passwordFeedback = {
      type: 'error-message',
      icon: 'mdi-close-circle',
      message: '密碼至少需要8個字符，且只能包含英文字母和數字。',
    };
  } else {
    this.passwordFeedback = {
      type: 'success-message',
      icon: 'mdi-check-circle',
      message: '密碼有效。',
    };
  }
},
    handleGoogleLogin() {
      // 请求后端获取Google登录URL
      axios.get('http://localhost:8080/public/api/google-login')
        .then(response => {
          // 在弹窗中打开Google登录页面
          const googleLoginUrl = response.data.authUrl;
          const popup = window.open(googleLoginUrl, 'google-login', 'width=500,height=500');

          // 监听弹窗关闭
          let popupTick = setInterval(() => {
            if (popup.closed) {
              clearInterval(popupTick);
              this.checkForGoogleCode();
            }
          }, 100);
        })
        .catch(error => {
          console.error('Error fetching Google login URL:', error);
        });
    },

    checkForGoogleCode() {
      // 从URL中提取code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        this.handleGoogleCallback(code);
      }
    },
    sendVerificationCode() {
      axios.post('http://localhost:8080/public/api/sendEmail', { recipient: this.email })
        .then(response => {
          this.emailFeedback = {
            type: 'success-message',
            icon: 'mdi-check-circle',
            message: '驗證碼已寄出。',
          };
          this.emailLocked = true;
        })
        .catch(error => {
  console.error('Error sending verification code:', error);
  this.emailFeedback = {
    type: 'error-message',
    icon: 'mdi-close-circle',
    message: '驗證碼寄送失敗。',
  };
  this.emailLocked = false;
});
    },
    confirmVerificationCode() {
      // 确认验证码逻辑...
      axios.post('http://localhost:8080/public/api/verifyCode', null, {
        params: {
          email: this.email,
          userInputCode: this.verificationCode
        }
      })
      .then(response => {
        this.verificationFeedback = {
          type: response.data === "驗證成功" ? 'success-message' : 'error-message',
          icon: response.data === "驗證成功" ? 'mdi-check-circle' : 'mdi-close-circle',
          message: response.data,
        };
        // 验证成功后更新 isCodeVerified 状态并锁定电子邮件输入框
        if(response.data === "驗證成功") {
          this.isCodeVerified = true;
          this.emailLocked = true;
        } else {
          this.isCodeVerified = false;
        }
      })
      .catch(error => {
        console.error('Error verifying code:', error);
        this.verificationFeedback = {
          type: 'error-message',
          icon: 'mdi-close-circle',
          message: '驗證碼確認失敗。',
        };
        this.isCodeVerified = false;
      });
    },
    registerUser() {
  if (this.googleSignedIn || this.isCodeVerified) {
    // 准备要发送的数据，这里添加了一些后端要求的默认值
    const userData = new URLSearchParams({
      username: this.username,
      passwdbcrypt: this.password,
      email: this.email,
      // 添加后端要求的默认值
      firstname: '放', // 預設名字
      lastname: '風吹', // 預設姓氏
      gender: '男', // 預設性別
      birthdate: '1990-01-01', // 預設生日
      phone: '0912345678', // 預設手機號碼，符合台灣手機號碼格式
      membertypeid: 3 // 預設會員類型ID
    });

    // 发送 POST 请求到注册接口
    axios.post('http://localhost:8080/public/api/member/post', userData)
    .then(response => {
      // 处理响应...
      if(response.data.okMsg) {
        alert(response.data.okMsg);
        // 可以重定向到登录页面或其他操作
      } else if(response.data.errorMsg) {
        alert(response.data.errorMsg);
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      alert('註冊失敗');
    });
  } else {
    alert('請先驗證Email。');
  }
}
  },
  mounted() {
    // 监听message事件来接收弹窗传回的用户数据
    window.addEventListener('message', (event) => {
      if (event.origin === 'http://localhost:8080') {
        this.googleUserData = event.data;
        if (this.googleUserData && this.googleUserData.email) {
          this.email = this.googleUserData.email;
          this.googleSignedIn = true;
          this.isCodeVerified = true; // 如果通过 Google 登录，则认为邮箱已验证
        }
      }
    }, false);
  },
};
</script>

<style scoped>
.validation-result .success-message {
  color: green;
}

.validation-result .error-message {
  color: red;
}
</style>
