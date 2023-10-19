<script >

export default {
  data: () => ({
    valid: false,
    membershipType: '',
    gender: '',
    customGender: '', // 用于自定义性別的输入
    username: '',
    password: '',
    birthdate: null,
    phone: '',
    country: '',
    city: '',
    region: '',
    street: '',
    postalCode: ''
  })
}

</script>

<template>

    <v-form v-model="valid">
      <v-container>
        <v-row>
          <!-- 會員種類 -->
          <v-col cols="12">
            <v-radio-group v-model="membershipType" label="會員種類">
              <v-radio label="買家" value="buyer"></v-radio>
              <v-radio label="賣家" value="seller"></v-radio>
              <v-radio label="賣家客服" value="customer_service"></v-radio>
            </v-radio-group>
          </v-col>

          <!-- 会员圖片 -->
          <v-col cols="12">
            <!-- 这里可以添加文件上传组件来上传会员图片 -->
          </v-col>

          <!-- 帳號 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="username"
                label="帳號"
                required
            ></v-text-field>
          </v-col>



          <!-- 性別 -->
          <v-col cols="12">
            <v-radio-group v-model="gender" label="性別">
              <v-radio label="男性" value="male"></v-radio>
              <v-radio label="女性" value="female"></v-radio>
              <v-radio label="其他" value="other"></v-radio>
            </v-radio-group>
          </v-col>

          <!-- 如果性別選擇其他，顯示自行輸入性別 -->
          <v-col cols="12" v-if="gender === 'other'">
            <v-text-field
                v-model="customGender"
                label="自行輸入性別"
                maxlength="10"
            ></v-text-field>
          </v-col>

          <!-- 密碼 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="password"
                label="密碼"
                type="password"
                required
            ></v-text-field>
          </v-col>

          <!-- 生日 -->
          <v-col cols="12" md="6">
            <v-date-picker
                v-model="birthdate"
                label="生日"
                required
            ></v-date-picker>
          </v-col>

          <!-- 電話 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="phone"
                label="電話"
                required
            ></v-text-field>
          </v-col>

          <!-- 國家 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="country"
                label="國家"
                required
            ></v-text-field>
          </v-col>

          <!-- 城市 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="city"
                label="城市"
                required
            ></v-text-field>
          </v-col>

          <!-- 地區 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="region"
                label="地區"
            ></v-text-field>
          </v-col>

          <!-- 街道 -->
          <v-col cols="12">
            <v-text-field
                v-model="street"
                label="街道"
                required
            ></v-text-field>
          </v-col>

          <!-- 郵遞區號 -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="postalCode"
                label="郵遞區號"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>



</template>

<style scoped>


</style>
