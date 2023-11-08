<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card>
          <v-card-title class="headline blue lighten-2 white--text">您的資料</v-card-title>
          <v-card-text v-if="isLoggedIn">
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>會員帳號</v-list-item-title>
                  <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>會員類型</v-list-item-title>
                  <v-list-item-subtitle>{{ user.membertype }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- 大頭照顯示 -->
              <v-avatar size="120" class="mb-3">
                <img :src="imageFullPath" alt="Profile image" style="object-fit: contain; width: 100%; height: 100%;">
              </v-avatar>
              <!-- ... 其他資料欄位 ... -->

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>姓名</v-list-item-title>
                  <v-list-item-subtitle>{{ user.firstname }} {{ user.lastname }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>性別</v-list-item-title>
                  <v-list-item-subtitle>{{ user.gender }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>出生日期</v-list-item-title>
                  <v-list-item-subtitle>{{ user.birthdate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>電話</v-list-item-title>
                  <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>會員創建日期</v-list-item-title>
                  <v-list-item-subtitle>{{ user.membercreationdate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>地址</v-list-item-title>
                  <v-list-item-subtitle>{{ address }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </v-list>
            <v-card-actions>
              <v-btn color="primary" text @click="editProfile">編輯資料</v-btn>

              <input type="file" id="fileInput" ref="fileInput" style="display: none" @change="uploadImage" accept="image/*">
            </v-card-actions>
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
      return this.user.memberimgpath ? `https://i.imgur.com/${this.user.memberimgpath}.jpeg` : '';
    },
    address() {
      return `${this.user.country}, ${this.user.city}, ${this.user.region}, ${this.user.street}, ${this.user.postalcode}`;
    }
  },
  methods: {

    async fetchUserProfile() {
      try {
        const response = await axios.get("http://localhost:8080/public/api/checkLoginStatus");
        const data = response.data;
        if (data.isLoggedIn) {
          this.user.username = data.username;
          this.user.membertype = data.role;
          this.isLoggedIn = true;
          // 确保使用正确的键来获取用户ID
          if(data.memberId !== undefined) {
            this.fetchMemberData(data.memberId);
          } else {
            console.error("用户ID未定义。");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile: ", error);
      }
    },
    fetchMemberData(userId) {
      axios.get(`http://localhost:8080/public/api/member/${userId}`)
          .then((response) => {
            this.user = { ...this.user, ...response.data };
          })
          .catch((error) => {
            console.error("Failed to fetch member data: ", error);
          });
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('memberId', this.user.id);

        axios.post('http://localhost:8080/public/api/member/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
            .then(response => {
              this.user.memberimgpath = response.data.split('/')[4].split('.')[0]; // 假设返回的是完整URL，我们需要的是imageCode
            })
            .catch(error => {
              console.error("Image upload failed: ", error);
            });
      }
    },
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