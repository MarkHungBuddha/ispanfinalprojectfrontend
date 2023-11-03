<template>
  <v-container>
    <v-form @submit.prevent>
      <v-responsive class="mx-auto" max-width="600">
        <!-- 其他表单字段... -->
        <v-text-field v-model="username" @blur="validateUsername" clearable label="帳號" required></v-text-field>
        <div class="validation-result">
          <v-icon v-if="isUsernameValid" class="success-icon">mdi-check-circle</v-icon>
          <v-icon v-else-if="isUsernameValid === false" class="error-icon">mdi-close-circle</v-icon>
          <span v-if="isUsernameValid" class="success-message">帳號可以使用</span>
          <span v-else-if="isUsernameValid === false" class="error-icon">帳號無效或已存在</span>
        </div>
        <v-text-field v-model="password" @blur="validatePassword" clearable label="密碼" type="password" required autocomplete="new-password"></v-text-field>
        <div class="validation-result">
          <v-icon v-if="isPasswordValid" class="success-icon">mdi-check-circle</v-icon>
          <v-icon v-else-if="isPasswordValid === false" class="error-icon">mdi-close-circle</v-icon>


          <span v-if="isPasswordValid" class="success-message">密碼可以使用</span>
          <span v-else-if="isPasswordValid === false" class="error-message">密碼無效</span>
        </div>
        <v-text-field v-model="birthdate" label="生日" type="date" required></v-text-field>
        <v-text-field v-model="lastname" @blur="validateLastname" :rules="lastnameRules" clearable hide-details="auto" label="姓氏"></v-text-field>
        <v-text-field v-model="firstname" @blur="validateFirstname" :rules="firstnameRules" clearable hide-details="auto" label="名字"></v-text-field>
        <v-text-field v-model="phone" @blur="validatePhone" :rules="phoneRules" clearable hide-details="auto" label="電話"></v-text-field>
        <v-select v-model="gender" label="性別" :items="['男', '女', '其他']"></v-select>
        <v-text-field v-if="gender === '其他'" v-model="customGender" label="自行輸入性別" maxlength="10"></v-text-field>

       <!-- Email字段 -->
       <v-row>
          <v-col xs12 md6>
            <v-text-field v-model="email" clearable label="Email" type="email" required :disabled="emailLocked"></v-text-field>
          </v-col>
          <v-col xs12 md6>
            <v-btn @click="sendVerificationEmail" color="primary" class="ma-2">寄送驗證信</v-btn>
          </v-col>
        </v-row>

        <!-- 驗證碼字段 -->
        <v-row>
          <v-col xs12 md6>
            <v-text-field v-model="verificationCode" label="驗證碼" required></v-text-field>
          </v-col>
          <v-col xs12 md6>
            <v-btn @click="confirmVerificationCode" color="primary" class="ma-2" :disabled="!verificationCode">確認驗證碼</v-btn>
            <span v-if="verificationSuccess" class="success-message">驗證成功</span>
            <span v-if="verificationFailure" class="error-message">驗證失敗</span>
          </v-col>
        </v-row>

        <!-- 提交按钮 -->
        <v-btn type="submit" color="primary">提交</v-btn>
      </v-responsive>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    email: '', // 添加 email 字段
    verificationCode: '',
    emailLocked: false,
    isEmailValid: null,
    verificationSuccess: false,
    verificationFailure: false,
  }),
  methods: {
    sendVerificationEmail() {
      if (this.email) { // 检查 email 是否有值
        // 使用 Axios 发送 POST 请求到后端的发送验证邮件 API
        axios
          .post('http://localhost:8080/email/public/api/sendEmail', { recipient: this.email })
          .then((response) => {
            if (response.data === '驗證碼已發送') {
              // 邮件已发送成功
              // 这里可以添加额外的逻辑或显示消息给用户
            } else {
              // 发送失败
              // 这里可以添加错误处理逻辑或显示错误消息给用户
            }
          })
          .catch((error) => {
            console.error(error);
            // 这里可以添加错误处理逻辑或显示错误消息给用户
          });
      }
    },
    confirmVerificationCode() {
      const enteredVerificationCode = this.verificationCode;
      // 使用 Axios 发送 POST 请求到后端的验证验证码 API
      axios
        .post(`http://localhost:8080/email/public/api/verifyCode?userInputCode=${this.verificationCode}`)
        .then((response) => {
          if (response.data === '驗證成功') {
            this.verificationSuccess = true;
            this.verificationFailure = false;
          } else {
            this.verificationSuccess = false;
            this.verificationFailure = true;
          }
        })
        .catch((error) => {
          console.error(error.response.data);
          this.verificationSuccess = false;
          this.verificationFailure = true;
        });
    },

    // 添加 checkEmailAvailability 方法来检查邮箱是否可用
   
    submitForm() {
      // 在表单提交时调用注册 API
      if (this.email && this.verificationCode) {
        // 构建要发送到后端的数据对象
        const requestData = {
          username: this.username,
          passwdbcrypt: this.password,
          membertypeid: this.membertypeid,
          firstname: this.firstname,
          lastname: this.lastname,
          gender: this.gender,
          birthdate: this.birthdate,
          phone: this.phone,
          email: this.email,
          membercreationdate: this.membercreationdate,
          country: this.country,
          city: this.city,
          region: this.region,
          street: this.street,
          postalcode: this.postalcode,
        };

        // 使用 Axios 发送 POST 请求到注册 API
        axios
          .post('/public/api/member/post', requestData)
          .then((response) => {
            if (response.data.okMsg) {
              // 注册成功
              // 这里可以添加额外的逻辑或显示成功消息给用户
            } else if (response.data.errorMsg) {
              // 注册失败
              // 这里可以添加错误处理逻辑或显示错误消息给用户
            }
          })
          .catch((error) => {
            console.error(error);
            // 这里可以添加错误处理逻辑或显示错误消息给用户
          });
      }
    },
  },
};
</script>

<style scoped>
.success-icon {
  color: green;
}

.error-icon {
  color: red;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
