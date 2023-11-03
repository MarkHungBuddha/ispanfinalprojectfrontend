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
          <span v-else-if="isUsernameValid === false" class="error-icon">帳號無效</span>
        </div>
        <v-text-field v-model="password" @blur="validatePassword" clearable label="密碼" type="password" required autocomplete="new-password"></v-text-field>
        <div class="validation-result">
          <v-icon v-if="isPasswordValid" class="success-icon">mdi-check-circle</v-icon>
          <v-icon v-else-if="isPasswordValid === false" class="error-icon">mdi-close-circle</v-icon>

          <span v-if="isPasswordValid" class="success-message">密碼可以使用</span>
          <span v-else-if="isPasswordValid === false" class="error-icon">密碼無效</span>
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
            <v-text-field v-model="email" label="Email" type="email" required :disabled="emailLocked"></v-text-field>
          </v-col>
          <v-col xs12 md6>
            <v-btn @click="sendVerificationCode" color="primary" class="ma-2">寄送驗證碼</v-btn>
          </v-col>
        </v-row>

        <!-- 驗證碼字段 -->
        <v-row>
          <v-col xs12 md6>
            <v-text-field v-model="verificationCode" label="驗證碼" required></v-text-field>
          </v-col>
          <v-col xs12 md6>
            <v-btn @click="confirmVerificationCode" color="primary" class="ma-2">確認驗證碼</v-btn>
          </v-col>
        </v-row>

        <!-- 提交按钮 -->
        <v-btn type="submit" color="primary">提交</v-btn>
      </v-responsive>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    membershipType: '',
    gender: '',
    customGender: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    birthdate: null,
    phone: '',
    otp: '',
    email: '',
    verificationCode: '',
    emailLocked: false,
    isUsernameValid: null, // 用于显示帳號验证结果
    isPasswordValid: null, // 用于显示密碼验证结果
  }),
  computed: {
    lastnameRules() {
      return [
        v => !!v || '姓氏不能為空',
        v => /^[\u4e00-\u9fa5a-zA-Z\s]*$/.test(v) || '無效字符',
      ];
    },
    firstnameRules() {
      return [
        v => !!v || '名字不能為空',
        v => /^[\u4e00-\u9fa5a-zA-Z\s]*$/.test(v) || '無效字符',
      ];
    },
    phoneRules() {
      return [
        v => !!v || '電話不能為空',
        v => /^[0-9]*$/.test(v) || '無效字符',
      ];
    },
  },
  methods: {
    clearValidation(field) {
      // 清除验证状态，使其重新验证
      if (field === 'username') {
        this.isUsernameValid = null;
      } else if (field === 'password') {
        this.isPasswordValid = null;
      }
    },
    sendVerificationCode() {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      this.verificationCode = randomCode.toString();
      // 发送验证码给用户的逻辑，可以在这里添加
    },
    confirmVerificationCode() {
      if (this.verificationCode === this.generatedCode) {
        this.verificationCodeValid = true;
        this.emailLocked = true;
      } else {
        this.verificationCodeValid = false;
      }
    },
    validateUsername() {
      if (/^[a-zA-Z0-9@_]+$/.test(this.username)) {
        this.isUsernameValid = true;
      } else {
        this.isUsernameValid = false;
      }
    },
    validatePassword() {
      if (/^[a-zA-Z0-9@_]+$/.test(this.password)) {
        this.isPasswordValid = true;
      } else {
        this.isPasswordValid = false;
      }
    },
    validateLastname() {
      this.clearValidation('lastname');
    },
    validateFirstname() {
      this.clearValidation('firstname');
    },
    validatePhone() {
      this.clearValidation('phone');
    },
    // 其他方法...
  },
  watch: {
    generatedCode: function (newCode) {
      // 生成验证码的逻辑，可以在需要的地方设置生成的验证码
      this.generatedCode = newCode;
    },
  },
}
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
