<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="custom-background"> <!-- Removed the 'flat' attribute -->
          <v-card-title class="headline blue lighten-2 white--text py-2">您的資料</v-card-title>
          <v-card-text v-if="isLoggedIn">
            <v-row>
              <!-- User Information Column -->
              <v-col cols="12" md="8">
                <v-list two-line>
                  <v-list-item-group dense>
                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">會員帳號</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.username }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">會員類型</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.membertype }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">姓名</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{user.lastname}} {{  user.firstname  }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">性別</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.gender }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">出生日期</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.birthdate }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">電話</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.phone }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">Email</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.email }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">會員創建日期</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ user.membercreationdate }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="my-2">
                      <v-list-item-content>
                        <v-list-item-title class="title">地址</v-list-item-title>
                        <v-list-item-subtitle class="subtitle">{{ address }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <!-- Avatar Column -->
              <v-col cols="12" md="4" class="d-flex justify-center align-center">
                <v-avatar size="350" class="elevation-6">
                  <img :src="imageFullPath" alt="Profile image" style="object-fit: contain; width: 100%; height: 100%;">
                </v-avatar>
              </v-col>
            </v-row>
            <!-- Actions -->


            <v-btn color="primary" @click="editProfile">編輯資料</v-btn>

          </v-card-text>
          <v-card-text v-else>
            <v-alert type="warning" text>您尚未登入。</v-alert>
            <v-btn color="primary" @click="login">登入</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  computed: {
    imageFullPath() {
      const { memberimgpath } = this.user;
      return memberimgpath ? `https://i.imgur.com/${memberimgpath}.jpeg` : '';
    },
    address() {
      const { country, city, region, street, postalcode } = this.user;
      return `${country}, ${city}, ${region}, ${street}, ${postalcode}`;
    },

  },

  methods: {
    async fetchUserProfile() {
      try {
        const { data } = await axios.get("http://localhost:8080/public/api/checkLoginStatus");
        if (data.isLoggedIn) {
          const { username, role, memberId } = data;
          this.user.username = username;
          this.user.membertype = role;
          this.isLoggedIn = true;
          this.fetchMemberData(memberId);
        }
      } catch (error) {
        console.error("Failed to fetch user profile: ", error);
      }
    },
    async fetchMemberData(userId) {
      try {
        const { data } = await axios.get(`http://localhost:8080/public/api/member/${userId}`);
        this.user = { ...this.user, ...data };
      } catch (error) {
        console.error("Failed to fetch member data: ", error);
      }
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    // async uploadImage(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('memberId', this.user.id);

    //     try {
    //       const { data } = await axios.post('http://localhost:8080/public/api/member/upload', formData, {
    //         headers: { 'Content-Type': 'multipart/form-data' }
    //       });
    //       this.user.memberimgpath = data.split('/')[4].split('.')[0];
    //     } catch (error) {
    //       console.error("Image upload failed: ", error);
    //     }
    //   }
    // },
    editProfile() {
      this.$router.push("/editprofile");
    },
    login() {
      this.$router.push("/login");
    },
  },
  created() {
    this.fetchUserProfile();
  },

};
</script>
<style scoped>
/* .bg-custom {
  background-color: #ed2e2e;
} */

/* 定義通用文字樣式 */
/* .text-custom {
  font-size: 1rem;
  color: #bd1f1f;
} */
/* .v-card {
  background-color: #f5f5f5;
} */
.title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1976D2;
}

.subtitle {
  font-size: 1rem;
  color: #424242;
}

.custom-background {
  background-color: rgb(227, 238, 142); /* 更改为你想要的颜色 */
}

.custom-background .v-card__text,
.custom-background .v-list {
  background-color: #fefffe; /* 确保子元素背景色与 v-card 相同 */
}

@media (min-width: 960px) {
  .v-avatar {
    position: relative;
    left: 10%;
    transform: translateX(-50%);
    margin-top: -200px;
  }
}
</style>
