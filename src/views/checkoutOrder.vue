

<template>
  <v-container>
    <!-- 顯示每個商品的內容，用 v-card 包起來 -->
    <v-row>
      <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="item in orderDetails.productIDandQuentities"
          :key="item.productID"
      >
        <v-card>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>
            <div>Product ID: {{ item.productID }}</div>
            <div>Quantity: {{ item.quantity }}</div>
            <div>Price: ${{ item.price.toFixed(2) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 顯示總價 -->
    <v-row>
      <v-col cols="12">
        <v-card color="grey lighten-3" class="pa-3">
          <div class="text-h5">Total Price: ${{ orderDetails.totalPrice.toFixed(2) }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card outlined>
      <v-card-title>Order Address</v-card-title>
      <!-- 縣市選擇 -->
      <v-select
          :items="cityList"
          item-text="name"
          item-value="name"
          label="選擇縣市"
          v-model="selectedCity"
      ></v-select>

      <!-- 行政區選擇，當選擇縣市後顯示 -->
      <v-select
          v-if="selectedCity"
          :items="districts"
          label="選擇行政區"
          v-model="selectedDistrict"
      ></v-select>

      <!-- 顯示地址 -->
      <!-- Address input field, automatically updated when city or district is selected -->
      <v-text-field
          label="Address"
          v-model="fullAddress"
          :disabled="true"
      ></v-text-field>

      <!-- Submit button -->
      <v-btn color="primary" @click="submitOrder">下單</v-btn>
    </v-card>
  </v-container>
</template>
<script setup>
const cityList = ref([
      {
        name: '臺北市',
        districts: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '文山區', '南港區', '內湖區', '士林區', '北投區']
      },
      {
        name: '新北市',
        districts: ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區']
      },
      {
        name: '桃園市',
        districts: ['桃園區', '中壢區', '大溪區', '楊梅區', '蘆竹區', '大園區', '龜山區', '八德區', '龍潭區', '平鎮區', '新屋區', '觀音區', '復興區']
      },
      {
        name: '臺中市',
        districts: ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區', '大甲區', '清水區', '沙鹿區', '梧棲區', '后里區', '神岡區', '潭子區', '大雅區', '新社區', '石岡區', '外埔區', '大安區', '烏日區', '大肚區', '龍井區', '霧峰區', '太平區', '大里區', '和平區']
      },
      {
        name: '臺南市',
        districts: ['新營區', '鹽水區', '白河區', '柳營區', '後壁區', '東山區', '麻豆區', '下營區', '六甲區', '官田區', '大內區', '佳里區', '學甲區', '西港區', '七股區', '將軍區', '北門區', '新化區', '善化區', '新市區', '安定區', '山上區', '玉井區', '楠西區', '南化區', '左鎮區', '仁德區', '歸仁區', '關廟區', '龍崎區', '永康區', '東區', '南區', '北區', '安南區', '安平區', '中西區']
      },
      {
        name: '高雄市',
        districts: ['鹽埕區', '鼓山區', '左營區', '楠梓區', '三民區', '新興區', '前金區', '苓雅區', '前鎮區', '旗津區', '小港區', '鳳山區', '林園區', '大寮區', '大樹區', '大社區', '仁武區', '鳥松區', '岡山區', '橋頭區', '燕巢區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區']
      },
      {name: '基隆市', districts: ['中正區', '七堵區', '暖暖區', '仁愛區', '中山區', '安樂區', '信義區']},
      {name: '新竹市', districts: ['東區', '北區', '香山區']},
      {name: '嘉義市', districts: ['東區', '西區']},
      {
        name: '宜蘭縣',
        districts: ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉']
      },
      {
        name: '新竹縣',
        districts: ['竹北市', '關西鎮', '新埔鎮', '竹東鎮', '湖口鄉', '橫山鄉', '新豐鄉', '芎林鄉', '寶山鄉', '北埔鄉', '峨眉鄉', '尖石鄉', '五峰鄉']
      },
      {
        name: '苗栗縣',
        districts: ['苗栗市', '頭份市', '苑裡鎮', '通霄鎮', '竹南鎮', '後龍鎮', '卓蘭鎮', '大湖鄉', '公館鄉', '銅鑼鄉', '南庄鄉', '頭屋鄉', '三義鄉', '西湖鄉', '造橋鄉', '三灣鄉', '獅潭鄉', '泰安鄉']
      },
      {
        name: '彰化縣',
        districts: ['彰化市', '員林市', '鹿港鎮', '和美鎮', '北斗鎮', '溪湖鎮', '田中鎮', '二林鎮', '線西鄉', '伸港鄉', '福興鄉', '秀水鄉', '花壇鄉', '芬園鄉', '大村鄉', '埔鹽鄉', '埔心鄉', '永靖鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '芳苑鄉', '大城鄉', '竹塘鄉', '溪州鄉']
      },
      {
        name: '南投縣',
        districts: ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉']
      },
      {
        name: '雲林縣',
        districts: ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '二崙鄉', '崙背鄉', '麥寮鄉', '東勢鄉', '褒忠鄉', '臺西鄉', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉']
      },
      {
        name: '嘉義縣',
        districts: ['太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉']
      },
      {
        name: '屏東縣',
        districts: ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉']
      },
      {
        name: '臺東縣',
        districts: ['臺東市', '成功鎮', '關山鎮', '卑南鄉', '大武鄉', '太麻里鄉', '東河鄉', '長濱鄉', '鹿野鄉', '池上鄉', '綠島鄉', '延平鄉', '海端鄉', '達仁鄉', '金峰鄉', '蘭嶼鄉']
      },
      {
        name: '花蓮縣',
        districts: ['花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '富里鄉', '秀林鄉', '萬榮鄉', '卓溪鄉']
      },
      {name: '澎湖縣', districts: ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉']},
      {name: '金門縣', districts: ['金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉']},
      {name: '連江縣', districts: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']}

    ]
);
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

const store = useStore();
const router = useRouter();
// 選擇的縣市
const selectedCity = ref(null);
// 選擇的行政區
const selectedDistrict = ref(null);
// 組合的地址
const orderAddress = ref('');

// 監聽縣市和行政區的變化，更新地址
watch([selectedCity, selectedDistrict], () => {
  orderAddress.value = selectedCity.value + (selectedDistrict.value ? ` ${selectedDistrict.value}` : '');
});

// 行政區的計算屬性，根據選擇的縣市過濾
const districts = computed(() => {
  const city = cityList.value.find(c => c.name === selectedCity.value);
  return city ? city.districts : [];
});

// 從 Vuex 獲取 checkoutOrderDto
const checkoutOrderDto = computed(() => store.state.checkoutOrderDto);

// 提交訂單的函數
const submitOrder = async () => {
  try {
    const data = checkoutOrderDto.value;
    const params = new URLSearchParams({ orderAddress: orderAddress.value });

    const response = await axios.post(`http://localhost:8080/customer/api/order/addOrder?${params.toString()}`, data);

    if (response.status === 200) {
      router.push('/order');
    }
  } catch (error) {
    console.error('下單時發生錯誤:', error);
  }
};

</script>

<style scoped>
/* 可以在這裡添加你需要的樣式 */
</style>
