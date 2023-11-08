<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>發送驗證碼</v-card-title>
          <v-card-text>
            <v-alert
              v-if="message.content"
              :type="message.type"
              dismissible
              @input="message.content = ''"
            >
              {{ message.content }}
            </v-alert>

            <v-form @submit.prevent="sendVerificationCode">
              <v-text-field
                v-model="phone"
                label="手機號碼"
                required
              ></v-text-field>
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
              >
                發送驗證碼
              </v-btn>
            </v-form>

            <v-form @submit.prevent="verifyVerificationCode">
              <v-text-field
                v-model="verificationCode"
                label="驗證碼"
                required
              ></v-text-field>
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
              >
                確認驗證碼
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phone: '',
      verificationCode: '',
      userId: null,
      loading: false,
      message: {
        content: '',
        type: 'success',
      },
    };
  },
  methods: {
    async fetchUserIdFromSession() {
      try {
        const response = await axios.get('http://localhost:8080/public/api/currentUser');
        this.userId = response.data; // 假设后端正确返回用户 ID
      } catch (error) {
        console.error('無法獲取 ID', error);
        // 处理未登录或请求失败的情况
      }
    },
    async sendVerificationCode() {
  this.loading = true;
  try {
    // 请注意这里是将参数作为查询参数（query parameters）发送的
    const response = await axios.post('http://localhost:8080/customer/api/sendPhoneVCode', null, {
      params: {
        mobile: this.phone,
        userId: this.userId // 确保userId是从会话或者某个状态管理中正确获取的
      }
    });
    this.message.content = '驗證碼已成功發送';
    this.message.type = 'success';
  } catch (error) {
    this.message.content = '發送驗證碼時出錯: ' + (error.response ? error.response.data : error.message);
    this.message.type = 'error';
  } finally {
    this.loading = false;
  }
},
async verifyVerificationCode() {
  this.loading = true;
  try {
    // 發送驗證碼進行驗證
    const response = await axios.post('http://localhost:8080/customer/api/PhoneVCode', null, {
      params: {
        mobile: this.phone,
        verificationCode: this.verificationCode
      }
    });
    this.message.content = '會員手機驗證成功! 請等待跳轉';
    this.message.type = 'success';

    // 顯示成功消息一段時間後再跳轉
    setTimeout(() => {
      this.$router.push('/');
    }, 2000); // 這裡等待2秒，以便用戶能夠看到成功訊息

  } catch (error) {
    this.message.content = '確認驗證碼時出錯: ' + (error.response ? error.response.data : error.message);
    this.message.type = 'error';
  } finally {
    this.loading = false;
  }
},
    // ... 其他方法 ...
  },
  created() {
    this.fetchUserIdFromSession();
  },
};
</script>
