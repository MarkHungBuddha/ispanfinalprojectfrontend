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
                <img :src="imageFullPath" alt="Profile image" style="object-fit: contain; width: 100%; height: 100%;">
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
    label="會員帳號"
    readonly
></v-text-field>

              <!-- 名字 -->
              <v-text-field
                  v-model="user.firstname"
                  :rules="nameRules"
                  label="名字"
                  required
              ></v-text-field>

              <!-- 姓氏 -->
              <v-text-field
                  v-model="user.lastname"
                  :rules="nameRules"
                  label="姓氏"
                  required
              ></v-text-field>
              <!-- 性別 -->
              <v-select
                  v-model="selectedGender"
                  :items="genders"
                  label="性別"
                  required
                  @change="onGenderChange"
              ></v-select>
              <v-text-field
                  v-if="selectedGender === '其他 請輸入:'"
                  v-model="customGender"
                  :rules="customGenderRules"
                  label="自定義性別"
                  required
              ></v-text-field>


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
  :rules="phoneRules"
  label="電話號碼"
  required
  readonly
></v-text-field>

<v-row align="center" class="phone-verification-row">
  <v-col cols="auto" class="shrink-on-mobile">
    <v-btn v-if="membertypeid > 3" @click="$router.push('/phone')">
      手機驗證
    </v-btn>
    <v-icon v-else color="green">mdi-check-circle</v-icon>
  </v-col>
  <v-col>
    <span class="verified-text">電話號碼已認證</span>
  </v-col>
</v-row>
              <!-- Email -->
              <v-text-field
  v-model="user.email"
  label="Email"
  required
  readonly
></v-text-field>

<v-row align="center" class="email-verification-row">
  <v-col cols="auto" class="shrink-on-mobile">
    <!-- 假设email也有一个状态标识，我们这里使用membertypeid来判断 -->
    <v-icon color="green">mdi-check-circle</v-icon>
  </v-col>
  <v-col>
    <span class="verified-text">Email已認證</span>
  </v-col>
</v-row>

              <!-- 國家 -->
              <v-select
                  v-model="user.country"
                  :items="countries"
                  label="國家"
                  required
                  return-object
              ></v-select>

              <!-- 城市 -->
              <v-select
                  v-model="selectedCity"
                  :items="Object.keys(taiwanLocations)"
                  label="選擇城市"
                  @change="updateDistricts"
              ></v-select>

              <!-- 行政區 -->
              <v-select
                  v-model="selectedDistrict"
                  :items="selectedCity ? taiwanLocations[selectedCity] : []"
                  label="選擇行政區"
              ></v-select>

              <!-- 街道 -->
              <v-text-field
                  v-model="user.street"
                  :rules="streetRules"
                  label="街道,巷弄,門號,樓層"
                  required
              ></v-text-field>

              <!-- 郵政編碼 -->
              <v-text-field
                  v-model="user.postalcode"
                  :rules="postalCodeRules"
                  label="郵遞區號"
                  required
              ></v-text-field>

              <!-- 提交和重設按鈕 -->
              <v-btn color="primary" :disabled="!valid" @click="submit">更新資料</v-btn>
              <v-btn color="error" @click="reset">重設</v-btn>
              <!-- <v-card-actions class="d-flex justify-end"> -->
              <v-btn color="blue" style="margin-left: 450px;" @click="goToMember">回到會員資料</v-btn>



              <!-- </v-card-actions> -->
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
      membertypeid: null,  // 添加这一行
      nameRules: [
        v => /^[\u4e00-\u9fa5a-zA-Z]+$/g.test(v) || '名字與姓氏限定中文或英文',
      ],
      phoneRules: [
        v => /^(09)\d{8}$/g.test(v) || '',
      ],
      streetRules: [
        v => /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(v) || '街道規定只能中文英文與數字',
      ],
      postalCodeRules: [
        v => /^\d+$/g.test(v) || '郵遞區號規定數字',
      ],
      selectedGender: null,
      customGender: '',
      genders: ['男', '女', '其他 請輸入:'],
      customGenderRules: [
        v => !!v || '性別是必填的',
        v => /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/.test(v) || '性別只能包含中文、英文和數字，且最多10個字符',
      ],
      taiwanLocations: {
        '臺北市': [
          '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
        ],
        '新北市': [
          '板橋區', '新莊區', '泰山區', '林口區', '淡水區', '金山區', '八里區', '萬里區', '石門區', '三芝區', '瑞芳區', '汐止區', '平溪區', '貢寮區', '雙溪區', '深坑區', '石碇區', '新店區', '坪林區', '烏來區', '中和區', '永和區', '土城區', '三峽區', '樹林區', '鶯歌區', '三重區', '蘆洲區', '五股區'
        ],
        '基隆市': [
          '仁愛區', '中正區', '信義區', '中山區', '安樂區', '暖暖區', '七堵區'
        ],
        '桃園市': [
          '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '龜山區', '龍潭區', '大溪區', '大園區', '觀音區', '新屋區', '復興區'
        ],
        '新竹縣': [
          '竹北市', '竹東鎮', '新埔鎮', '關西鎮', '峨眉鄉', '寶山鄉', '北埔鄉', '橫山鄉', '芎林鄉', '湖口鄉', '新豐鄉', '尖石鄉', '五峰鄉'
        ],
        '新竹市': [
          '東區', '北區', '香山區'
        ],
        '苗栗縣': [
          '苗栗市', '通霄鎮', '苑裡鎮', '竹南鎮', '頭份鎮', '後龍鎮', '卓蘭鎮', '西湖鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '造橋鄉', '三灣鄉', '南庄鄉', '大湖鄉', '獅潭鄉', '泰安鄉'
        ],
        '臺中市': [
          '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '東勢區', '石岡區', '新社區', '和平區', '神岡區', '潭子區', '大雅區', '大肚區', '龍井區', '沙鹿區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'
        ],
        '南投縣': [
          '南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'
        ],
        '彰化縣': [
          '彰化市', '員林鎮', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'
        ],
        '雲林縣': [
          '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '莿桐鄉', '林內鄉', '古坑鄉', '大埤鄉', '崙背鄉', '二崙鄉', '麥寮鄉', '臺西鄉', '東勢鄉', '褒忠鄉', '四湖鄉', '口湖鄉', '水林鄉', '元長鄉'
        ],
        '嘉義縣': [
          '太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'
        ],
        '嘉義市': [
          '東區', '西區'
        ],
        '臺南市': [
          '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'
        ],
        '高雄市': [
          '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區', '新興區', '苓雅區', '前鎮區', '小港區', '旗津區', '鳳山區', '大寮區', '鳥松區', '林園區', '仁武區', '大樹區', '大社區', '岡山區', '路竹區', '橋頭區', '梓官區', '彌陀區', '永安區', '燕巢區', '田寮區', '阿蓮區', '茄萣區', '湖內區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '茂林區', '桃源區', '那瑪夏區'
        ],
        '屏東縣': [
          '屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉', '三地門鄉'
        ],
        '宜蘭縣': [
          '宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'
        ],
        '花蓮縣': [
          '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '秀林鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '富里鄉', '卓溪鄉'
        ],
        '臺東縣': [
          '臺東市', '成功鎮', '關山鎮', '長濱鄉', '海端鄉', '池上鄉', '東河鄉', '鹿野鄉', '延平鄉', '卑南鄉', '金峰鄉', '大武鄉', '達仁鄉', '綠島鄉', '蘭嶼鄉', '太麻里鄉'
        ],
        '澎湖縣': [
          '馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'
        ],
        '金門縣': [
          '金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'
        ],
        '連江縣': [
          '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
        ],},
      selectedCity: '',
      selectedDistrict: '',
      cityOptions: [],
      regionOptions: [],
      streetOptions: [],
      cityLoading: false,
      regionLoading: false,
      streetLoading: false,
      countries: [],
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
    genderChanged(newGender) {
      // 如果選擇的性別不是 "其他"，則清空自定義性別字段並更新用戶的性別
      if (newGender !== '其他') {
        this.customGender = ''; // 清空自定義性別字段
        this.user.gender = newGender; // 更新用戶性別為選擇的性別
        this.showCustomGenderInput = false;
      } else {
        // 如果選擇的是 "其他"，則顯示自定義性別輸入框
        this.showCustomGenderInput = true;
      }
    },
    onGenderChange() {
      if (this.selectedGender !== '其他 請輸入:') {
        this.customGender = ''; // Clear the custom gender field
        this.user.gender = this.selectedGender; // Update user's gender
      } else {
        // If '其他 請輸入:' is selected, customGender will be used
        this.user.gender = this.customGender;
      }
    },
    saveData() {
      let genderToSave = this.selectedGender.includes('其他') ? this.customGender : this.selectedGender;
      // 儲存 genderToSave 到資料庫或進行其他處理
    },
    goToMember() {
      this.$router.push('/member').then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
      });
    },
    updateDistricts(city) {
      if (city) {
        this.regionOptions = this.taiwanLocations[city]; // 或者是直接更新选项
      } else {
        this.regionOptions = [];
      }
      // 如果需要，你也可以在这里设置 selectedDistrict 的默认值
    },


    fetchCountries() {
      axios.get('https://restcountries.com/v3.1/all')
          .then((response) => {
            this.countries = response.data
                .map(country => country.name.common) // 取得所有國家的通用名稱
                .sort((a, b) => a.localeCompare(b)); // 根據字母順序進行排序
          })
          .catch((error) => {
            console.error('Error fetching countries:', error);
          });
    },

    setupFlatpickr() {
      this.$nextTick(() => {
        if(this.$refs.birthdate && this.$refs.birthdate.$el) {
          flatpickr(this.$refs.birthdate.$el.querySelector('input'), {
            dateFormat: 'Y-m-d',
            defaultDate: '2000-01-01', // 设置默认日期为2000年1月1日
            onChange: (selectedDates, dateStr) => {
              this.user.birthdate = dateStr;
            },
          });
        }
      });
      flatpickr(this.$refs.birthdate.$el.querySelector('input'), {
        dateFormat: 'Y-m-d',
        defaultDate: '2000-01-01', // 设置默认日期为2000年1月1日
        onChange: (selectedDates, dateStr) => {
          this.user.birthdate = dateStr;
        },
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
            this.selectedCity = this.user.city;
            // 确保先更新行政区选项
            this.updateDistricts(this.selectedCity);
            // 然后设置选中的行政区
            this.selectedDistrict = this.user.region;
            if (['男', '女'].includes(this.user.gender)) {
              this.selectedGender = this.user.gender;
            } else if (this.user.gender && this.user.gender.trim() !== '') {
              this.selectedGender = '其他 請輸入:';
              this.customGender = this.user.gender;
            }
          })
          .catch((error) => {
            console.error("Failed to fetch member data: ", error);
          });
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.selectedGender === '其他 請輸入:' && this.customGender.trim()) {
          this.user.gender = this.customGender.trim();
        } else {
          this.user.gender = this.selectedGender;
        }

        // 创建一个不包含密码的用户对象副本
        const userToUpdate = { ...this.user,city: this.selectedCity,
          region: this.selectedDistrict };
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

    this.fetchCountries();
  },
  mounted() {
    this.setupFlatpickr();
    this.fetchCountries();
  },
};
</script>


<style scoped>
@import "flatpickr/dist/flatpickr.css";

.v-input .v-input__control .v-input__slot {
  opacity: 1; /* 全不透明 */
  color: #000000; /* 黑色文字 */
}

/* 或者如果你需要更具體的針對文本欄 */
.v-text-field .v-text-field__slot {
  opacity: 1; /* 全不透明 */
  color: #000000; /* 黑色文字 */
}
.phone-verification-row {
  margin-top: -30px; /* Adds a small space between the text field and this row */
}
.email-verification-row {
  margin-top:-30px; /* Adds a small space between the text field and this row */
}

.shrink-on-mobile {
  flex-basis: auto;
}

.verified-text {
  color: green;
  font-size: 0.8rem; /* Adjust the size to your preference */
}
</style>