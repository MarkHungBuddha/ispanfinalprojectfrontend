<script setup>
import navbar from "@/components/navbar.vue";
</script>
<template>
  <v-app>
    <v-container>
      <navbar/>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-card-title>Login</v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                    label="Username"
                    name="username"
                    v-model="username"
                    :rules="[rules.required]"
                    required
                ></v-text-field>
                <v-text-field
                    label="Password"
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
    handleLogin() {
      if (this.$refs.form.validate()) {
        // Perform login logic here
        console.log("Logged in with", this.username, this.password);
      }
    }
  }
};
</script>

<style scoped>
</style>
