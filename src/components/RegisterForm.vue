<template>
  <v-container>
    <v-form @submit.prevent>

      <v-radio-group v-model="membershipType" label="會員種類" row>
        <v-radio label="買家" value="buyer"></v-radio>
        <v-radio label="賣家" value="seller"></v-radio>
      </v-radio-group>

      <v-text-field v-model="username" label="帳號" required></v-text-field>

      <v-radio-group v-model="membershipType" label="會員種類" row>
        <v-radio label="買家" value="buyer" color="green"></v-radio>
        <v-radio label="賣家" value="seller" color="green"></v-radio>
        <v-radio label="賣家客服" value="customer_service" color="green"></v-radio>
      </v-radio-group>


      <v-text-field v-if="gender === 'other'" v-model="customGender" label="自行輸入性別" maxlength="10"></v-text-field>

      <v-text-field v-model="password" label="密碼" type="password" required></v-text-field>
      <v-text-field v-model="birthdate" label="生日" type="date" required></v-text-field>
      <v-text-field v-model="phone" label="電話" required></v-text-field>
      <v-text-field v-model="country" label="國家" required></v-text-field>
      <v-text-field v-model="city" label="城市" required></v-text-field>
      <v-text-field v-model="region" label="地區"></v-text-field>
      <v-text-field v-model="street" label="街道" required></v-text-field>
      <v-text-field v-model="postalCode" label="郵遞區號"></v-text-field>

      <v-btn type="submit" color="primary">提交</v-btn>

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
