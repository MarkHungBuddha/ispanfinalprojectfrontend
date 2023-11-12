<template>
  <v-app>
    <v-main>
      <sidebarBuyer></sidebarBuyer>
      <v-container>
        <!-- 上一頁按鈕 -->
        <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">提交失敗</v-card-title>
            <v-card-text>您的評論提交失敗，請稍後再試。</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">好的</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 為訂單詳情卡片設置最大寬度並添加背景顏色 -->
        <div v-if="orderDetails" class="mx-auto order-card">

          <!-- 訂單標題，顯示訂單編號 -->
          <v-card-title>
            訂單編號：{{ orderDetails.orderid }}
          </v-card-title>

          <!-- 訂單副標題，顯示訂單日期 -->
          <v-card-subtitle>
            訂單日期：{{ formatDate(orderDetails.merchanttradedate) }}
          </v-card-subtitle>

          <!-- 訂單內容，顯示訂單的買家、金額、狀態和地址 -->
          <v-card-text>
            <div>買家：{{ orderDetails.buyer }}</div>
            <div>訂單金額：{{ orderDetails.totalamount }}</div>
            <!-- 訂單狀態，根據isOrderCompleted動態改變文字顏色 -->
            <div :class="{ 'status-color-change': orderStatusClass }">
              <div>訂單狀態：{{ orderDetails.statusname }}</div>
            </div>
            <div>送貨地址：{{ orderDetails.orderaddess }}</div>
          </v-card-text>

          <div v-if="orderDetails.statusname === '待付款' || orderDetails.statusname === '待出貨'">
            <div v-if="!editingAddress">
              <!-- 显示更改地址按钮 -->
              <v-btn color="primary" @click="editingAddress = true">更改地址</v-btn>
            </div>

            <!-- 縣市區 -->
            <div v-else>
              <v-select v-model="selectedCity" :items="Object.keys(taiwanLocations)" label="選擇縣市"
                @update:modelValue="updateDistricts"></v-select>

              <v-select v-model="selectedDistrict" :items="selectedCity ? taiwanLocations[selectedCity] : []"
                label="選擇區域"></v-select>

              <v-text-field v-model="newAddress" label="詳細地址"></v-text-field>

              <v-btn color="success" @click="confirmNewAddress">確定地址</v-btn>
            </div>
          </div>

          <!-- 付款 按鈕 訂單狀態為'待付款'時顯示-->
          <div class="d-flex justify-end" v-if="orderDetails.statusname === '待付款'">
            <v-btn color="success" @click="payForOrder(orderDetails.orderid)">付款</v-btn>
          </div>

          <!-- 完成訂單 按鈕 訂單狀態為'待收貨'時顯示-->
          <div class="d-flex justify-end" v-if="orderDetails.statusname === '待收貨'">
            <v-btn color="success" @click="completeOrder(orderDetails.orderid)">完成訂單</v-btn>
          </div>

          <!-- 取消訂單 按鈕，當訂單狀態為 '待付款' 或 '待出貨' 時顯示 -->
          <div class="d-flex justify-end" v-if="orderDetails.statusname === '待付款' || orderDetails.statusname === '待出貨'">
            <v-btn color="red" @click="performCancelOrder(orderDetails.orderid)">取消訂單</v-btn>
          </div>

          <!-- 確認取消訂單的對話框 -->
          <!-- <v-dialog v-model="showDialog" persistent max-width="300px">
            <v-card>
              <v-card-title class="headline">確認操作</v-card-title>
              <v-card-text>您確定要取消這筆訂單嗎？</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="showDialog = false">不取消</v-btn>
                <v-btn color="red darken-1" text @click="performCancelOrder">取消訂單</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->

          <!-- 顯示產品列表 -->
          <v-card v-for="product in orderDetails.products" :key="product.productid" class="mb-3">
            <v-row @click="navigateToProduct(product.productid)">
              <!-- 產品圖片列 -->
              <v-col cols="4">
                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                  class="product-image"></v-img>
              </v-col>

              <!-- 產品信息列，使用 "text-right" class 來對齊文本到右側 -->
              <v-col cols="8" class="text-right product-details">
                <v-card-title>{{ product.productName }}</v-card-title>
                <v-card-subtitle @click="navigateToProduct(product.productid)">
                  數量：{{ product.quantity }}，單價：{{ product.unitprice }}，商品id：{{ product.productid }}
                </v-card-subtitle>
              </v-col>
            </v-row>
            <v-card v-if="canAddReview && !reviewedProducts[product.orderDetailId]" class="mt-3">
              <v-card-title>增加評論</v-card-title>
              <v-card-text>
                <v-rating v-model="product.rating" dense color="amber"></v-rating>
                <v-text-field v-model="product.reviewcontent" label="評論內容" :rules="[rules.required]"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="createProductReview(product)">提交評論</v-btn>
              </v-card-actions>
            </v-card>
          </v-card>


        </div>
        <!-- 如果訂單詳情不存在，顯示警告信息 -->
        <v-alert v-else type="warning">
          訂單資料正在加載中，或者無法顯示訂單資料。
        </v-alert>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import sidebarBuyer from '@/components/sidebarBuyer.vue';
import { mapGetters } from 'vuex';
import Swal from 'sweetalert2';

export default {
  components: {
    sidebarBuyer,
  },
  props: {
    orderid: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      orderStatusClass: '',
      orderDetails: null,
      showDialog: false,
      newAddress: '', // 存储新地址的变量
      editingAddress: false, // 标志是否在编辑地址

      selectedCity: '', // 使用者選擇的縣市
      selectedDistrict: '', // 使用者選擇的區域
      canAddReview: false,
      reviewedProducts: {},
      dialog: false, // Add this new property
      rules: {
        required: value => !!value || 'Required.', // This is a simple required rule
        // ... you can add other rules as needed
      },
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
        ],
      },
    };
  },
  created() {
    this.fetchOrderDetails();
  },
  computed: {
    memberId() {
      return this.$store.getters.memberId;
    }
  },
  mounted() {
    // 检查订单状态是否允许添加评价
    this.checkOrderStatus();
  },
  methods: {
    // 检查订单状态的方法
    checkOrderStatus() {
      axios.get(`http://localhost:8080/customer/api/order/${this.orderid}/status`)
        .then(response => {
          this.canAddReview = response.data;
        })
        .catch(error => {
          console.error('检查订单状态失败：', error);
        });
    },
    checkIfReviewed(orderDetailId) {
      axios.get('http://localhost:8080/customer/api/review/checkreviewed', {
        params: { orderDetailid: orderDetailid }
      })
        .then(response => {
          this.$set(this.reviewedProducts, orderDetailId, response.data);
          this.$nextTick(() => {
            // 可以在这里进行依赖于 DOM 更新后的操作
          });
        })
        .catch(error => {
          console.error('檢查評論失敗：', error);
        });
    },
    createProductReview(product) {
      console.log("Member ID is: ", this.memberId); // This will print the memberId to the console
      console.log("orderDetailid ID is: ", product.orederDetailid); // This will print the memberId to the console

      const productReviewDTO = {
        productid: product.productid,
        memberid: this.memberId, // Assuming you will get the memberId from your Vuex store or props
        orderid: parseInt(this.orderid, 10),
        orderdetailid: product.orederDetailid,
        rating: product.rating,
        reviewcontent: product.reviewcontent,
        reviewtime: new Date().toISOString(),
      };

      axios.post('http://localhost:8080/customer/api/reviews', productReviewDTO)
        .then(response => {
          if (response.status === 200) {
            // If the response status is 200, navigate to /customer/AllReview
            this.$router.push('/customer/CustomerAllReview');
          }
        })
        .catch(error => {
          console.error('提交评价失败：', error);
          this.dialog = true; // If there's an error, show the dialog
        });
    },


    // 方法：獲取訂單詳情
    fetchOrderDetails() {
      axios.get(`http://localhost:8080/customer/api/findOneOrder`, {
        params: { orderid: this.orderid }
      })
        .then(response => {
          this.orderDetails = response.data;
          // 確保為訂單中的每個產品調用 checkIfReviewed 方法
          this.orderDetails.products.forEach(product => {
            this.checkIfReviewed(product.orderDetailid);
          });
        })
        .catch(error => {
          console.error('無法檢索訂單詳情：', error);
        });
    },

    // 方法：格式化日期時間
    formatDate(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toISOString().substring(0, 19).replace('T', ' ');
    },

    // 上一頁
    goBack() {
      this.$router.go(-1); // 或者 this.$router.back();
    },

    // 付款
    payForOrder(orderId) {
      axios.put(`http://localhost:8080/customer/api/${orderId}/payOrder`)
        .then(response => {
          // 處理響應，更新訂單詳情
          this.orderDetails = response.data;
          this.orderStatusClass = 'status-color-change'; // 應用綠色
        })
        .catch(error => {
          console.error('付款失敗：', error);
        });
    },

    // 確認收貨
    completeOrder(orderId) {
      axios.put(`http://localhost:8080/customer/api/${orderId}/completeOrder`)
        .then(response => {
          //完成訂單提示窗
          Swal.fire({
            icon: "success",
            title: "完成訂單",
            showConfirmButton: false,
            timer: 1500
          });

          this.orderDetails = response.data;
          this.orderStatusClass = 'status-color-change'; // 應用綠色

        })
        .catch(error => {
          console.error('確認收貨失敗：', error);
        });
    },

    // 打開確認取消對話框
    // confirmCancelOrder() {
    //   this.showDialog = true;
    // },

    // 取消訂單
    performCancelOrder() {
      // 用戶確認取消後執行的操作
      this.showDialog = false; // 閉合對話框
      axios.put(`http://localhost:8080/customer/api/${this.orderDetails.orderid}/cancelOrder`)
        .then(response => {
          // 取消訂單提示窗
          Swal.fire({
            title: "你確定要取消訂單嗎?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "確定",
            cancelButtonText: "返回"
          }).then((result) => {
            if (result.isConfirmed) {
              // 處理成功取消訂單的邏輯...
              this.orderDetails = response.data;
              this.orderStatusClass = 'status-color-cancelled'; // 應用紅色
              Swal.fire({
                title: "取消訂單成功",
                icon: "success"
              });
            }
          });

        })
        .catch(error => {
          console.error('取消訂單失敗：', error);
        });
    },

    //地址重新選擇時，清空'區'
    updateDistricts(newValue) {
      this.selectedCity = newValue;
      this.selectedDistrict = '';
    },

    //改地址
    confirmNewAddress() {

      //縣市 區 地址 不能為空
      if (!this.selectedCity || !this.selectedDistrict || !this.newAddress) {
        alert("縣市、區和詳细地址不能為空。");
        return;
      }

      const fullAddress = `${this.selectedCity}${this.selectedDistrict}${this.newAddress}`;
      axios.put(`http://localhost:8080/customer/api/order/${this.orderDetails.orderid}`, {
        orderaddress: fullAddress
      })
        .then(response => {
          this.orderDetails = response.data;
          this.editingAddress = false; // 關編輯
        })
        .catch(error => {
          console.error('修改地址失敗：', error);
        });
    },
    //訂單的商品可跳至商品頁面
    navigateToProduct(productid) {
      this.$router.push({ name: 'ProductPage', params: { productId: productid } });
    },

  }
};
</script>

<style scoped>
/* 將整個應用的背景色設定為淡粉紅色 */
.v-application {
  background-color: rgb(247, 243, 238);
  /* 背景顏色 */
  background-image: url('@/assets/buy01.png');
  /* 背景圖片 */
  background-repeat: no-repeat;
  /* 背景不重複 */
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}


/* 訂單卡片樣式 */
.order-card {
  border: 3px solid rgb(241, 224, 206);
  max-width: 1300px;
  margin: 0 auto;
  /* 中心對齊 */
  padding: 15px;
  border-radius: 10px;
  background-color: #fdfdfd;
}

/* 產品詳情樣式調整 */
.product-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 圖片樣式 */
.product-image {
  max-width: 200px;
  /* 限制最大寬度，保持圖片比例 */
  height: auto;
}

/* 訂單狀態文字顏色 */
.status-color-cancelled {
  color: red;

}

.status-color-change {
  color: #4CAF50;
}

/* 文本框底邊距 */
.v-text-field {
  margin-bottom: 10px;
}

/* 自定義側邊欄樣式 */
.custom-sidebar {
  margin-top: 50px;
  /* 距頂部空間 */
  position: relative;
  z-index: 5;
}

/* 共用按鈕和對話框樣式 */
.v-btn,
.v-dialog,
.v-card {
  background-color: #fff;
}

/* 媒體查詢示例，根據需要調整 */
@media (max-width: 600px) {
  .order-card {
    padding: 10px;
    /* 對於小屏幕，減少內距 */
  }

  /* 其他需要調整的樣式 */
}
</style>
