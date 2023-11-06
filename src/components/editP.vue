<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline blue lighten-2 white--text">編輯您的個人資料</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- 头像显示 -->
              <v-avatar size="120" class="mb-3">
                <img :src="imageFullPath" alt="Profile image">
              </v-avatar>

              <!-- 头像上传 -->
              <v-file-input
                label="選擇大頭照"
                prepend-icon="mdi-camera"
                @change="uploadImage"
                accept="image/*"
              ></v-file-input>

              <!-- 用户名 -->
              <v-text-field
                v-model="user.username"
                :rules="usernameRules"
                label="會員名稱"
                required
              ></v-text-field>
              
              <!-- 名字 -->
              <v-text-field
                v-model="user.firstname"
                label="名字"
                required
              ></v-text-field>

              <!-- 姓氏 -->
              <v-text-field
                v-model="user.lastname"
                label="姓氏"
                required
              ></v-text-field>

              <!-- 性別 -->
              <v-select
                v-model="user.gender"
                :items="['男', '女', '其他']"
                label="性別"
                required
              ></v-select>

              <!-- 出生日期 -->
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="user.birthdate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    ref="birthdate"
                    v-model="user.birthdate"
                    label="出生日期"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="user.birthdate"
                  no-title
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>

              <!-- 電話 -->
              <v-text-field
                v-model="user.phone"
                label="電話號碼"
                required
              ></v-text-field>

              <!-- Email -->
              <v-text-field
                v-model="user.email"
                label="Email"
                required
              ></v-text-field>

              <!-- 國家 -->
              <v-text-field
                v-model="user.country"
                label="國家"
                required
              ></v-text-field>

              <!-- 城市 -->
              <v-text-field
                v-model="user.city"
                label="城市"
                required
              ></v-text-field>

              <!-- 地區 -->
              <v-text-field
                v-model="user.region"
                label="地區"
                required
              ></v-text-field>

              <!-- 街道 -->
              <v-text-field
                v-model="user.street"
                label="街道"
                required
              ></v-text-field>

              <!-- 郵政編碼 -->
              <v-text-field
                v-model="user.postalcode"
                label="郵政編碼"
                required
              ></v-text-field>

              <!-- 提交和重設按鈕 -->
              <v-btn color="primary" :disabled="!valid" @click="submit">更新資料</v-btn>
              <v-btn color="error" @click="reset">重設</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      bottom
      right
    >
      {{ snackbar.text }}
      <v-btn color="white" text @click="snackbar.show = false">關閉</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import flatpickr from 'flatpickr';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.css';

export default {
  data() {
    return {
      valid: true,
      menu: false,
      user: {
        id: '',
        username: '',
        firstname: '',
        lastname: '',
        gender: '',
        birthdate: '',
        phone: '',
        email: '',
        country: '',
        city: '',
        region: '',
        street: '',
        postalcode: '',
        memberimgpath: '',
      },
      snackbar: {
        show: false,
        color: '',
        text: '',
      },
      usernameRules: [
        v => !!v || '會員名稱是必填的',
        v => (v && v.length >= 3) || '會員名稱必須至少3個字符',
      ],
    };
  },
  computed: {
    imageFullPath() {
      return this.user.memberimgpath ? `https://i.imgur.com/${this.user.memberimgpath}.jpeg` : '';
    },
  },
  methods: {
    setupFlatpickr() {
      this.$nextTick(() => {
        if(this.$refs.birthdate && this.$refs.birthdate.$el) {
          flatpickr(this.$refs.birthdate.$el.querySelector('input'), {
            dateFormat: 'Y-m-d',
            onChange: (selectedDates, dateStr) => {
              this.user.birthdate = dateStr;
            },
          });
        }
      });
    },
    fetchUserProfile() {
      axios.get("http://localhost:8080/public/api/currentUser")
        .then((response) => {
          if (response.status === 200) {
            this.user.id = response.data; // Set the user ID
            this.fetchMemberData(this.user.id); // Fetch the full member data
          } else {
            // Handle not logged in
            this.$router.push('/login');
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user profile: ", error);
          this.$router.push('/login');
        });
    },
    fetchMemberData(userId) {
      axios.get(`http://localhost:8080/public/api/member/${userId}`)
        .then((response) => {
          this.user = { ...this.user, ...response.data }; // Merge the fetched data into user object
        })
        .catch((error) => {
          console.error("Failed to fetch member data: ", error);
        });
    },
    submit() {
  if (this.$refs.form.validate()) {
    // 创建一个不包含密码的用户对象副本
    const userToUpdate = { ...this.user };
    delete userToUpdate.passwdbcrypt;
    axios.put(`http://localhost:8080/public/api/member/update/${this.user.id}`, userToUpdate)
      .then(response => {
            if (response.data.success) {
              // 设置并显示成功的 snackbar
              this.snackbar.show = true;
              this.snackbar.color = 'success';
              this.snackbar.text = '更新成功！';
            } else {
              // 设置并显示错误的 snackbar
              this.snackbar.show = true;
              this.snackbar.color = 'error';
              this.snackbar.text = '更新失败：' + response.data.error;
            }
          })
          .catch(error => {
            // 设置并显示错误的 snackbar
            this.snackbar.show = true;
            this.snackbar.color = 'error';
            this.snackbar.text = '更新失败：' + error.message;
          });
      }
    },
    reset() {
      this.$refs.form.reset();
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
      // 假設響應中包含了新圖片的路徑或代碼
      this.user.memberimgpath = response.data.filePath;
      // 更新頭像顯示
      this.$forceUpdate(); // 強制Vue重新渲染組件
      // 反饋給用戶上傳成功的訊息
      this.snackbar.show = true;
      this.snackbar.color = 'success';
      this.snackbar.text = '大頭照上傳成功';
    })
    .catch(error => {
      console.error("Image upload failed: ", error);
      this.snackbar.show = true;
      this.snackbar.color = 'error';
      this.snackbar.text = '大頭照上傳失敗' + error.message;
    });
  }
}

  },
  created() {
    this.fetchUserProfile();
  },
  mounted() {
    this.setupFlatpickr();
  },
};
</script>


<style>
@import "flatpickr/dist/flatpickr.css";
</style>
