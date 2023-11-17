<template>
  <v-app>
    <v-main>
      <v-container>
        <sidebar></sidebar>
        <!-- 收入Dashboard标题 -->
        <v-row>
          <v-col cols="12">
            <h1 class="display-2">收入Dashboard</h1>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <!-- 年份选择 -->
          <v-col cols="12" md="4">
            <v-select v-model="selectedYear" :items="years" label="选择年份" @change="fetchYearlyIncome"></v-select>
          </v-col>

          <!-- 月份选择 -->
          <v-col cols="12" md="4">
            <v-select v-model="selectedMonth" :items="months" label="选择月份" @change="fetchMonthlyIncome"></v-select>
          </v-col>
        </v-row>

        <v-row>
          <!-- 年收入展示卡片 -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>{{ selectedYear }}年收入</v-card-title>
              <v-card-text>
                <h3>{{ totalYearlyIncome | currency }}</h3>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 月收入展示卡片 -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>{{ selectedYear }}年{{ selectedMonth }}收入</v-card-title>
              <v-card-text>
                <h3>{{ totalMonthlyIncome | currency }}</h3>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <Chart :selectedYear="selectedYear"></Chart>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
import Chart from '@/components/Chart.vue';
export default {
  name: 'IncomeDashboard',
  components: {
    navbar,
    sidebar
  },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      selectedMonth: '一月',
      years: [...Array(10).keys()].map(i => new Date().getFullYear() - i),
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      totalYearlyIncome: 0,
      totalMonthlyIncome: 0,
      monthMap: {
        '一月': 1,
        '二月': 2,
        '三月': 3,
        '四月': 4,
        '五月': 5,
        '六月': 6,
        '七月': 7,
        '八月': 8,
        '九月': 9,
        '十月': 10,
        '十一月': 11,
        '十二月': 12
      }
    };
  },
  methods: {
    async fetchYearlyIncome() {
      try {
        const response = await axios.get(`http://localhost:8080/seller/api/revenue/year?year=${this.selectedYear}`);
        this.totalYearlyIncome = response.data; // 假设返回的数据是年收入总额
      } catch (error) {
        console.error('Error fetching the yearly income:', error);
        // 处理错误情况
      }
    },
    async fetchMonthlyIncome() {
      if (this.selectedYear && this.selectedMonth) {
        const monthNumber = this.monthMap[this.selectedMonth];

        try {
          const response = await axios.get(`http://localhost:8080/seller/api/revenue/month?year=${this.selectedYear}&month=${monthNumber}`);
          this.totalMonthlyIncome = response.data;
        } catch (error) {
          console.error('Error fetching the monthly income:', error);
          // 处理错误
        }
      }
    },
  },
  watch: {
    selectedYear(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchYearlyIncome();
        this.fetchMonthlyIncome(); // 也可以根据需求来决定是否在这里调用
      }
    },
    selectedMonth(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchMonthlyIncome();
      }
    }
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD'
      }).format(value);
    },
  },
  mounted() {
    this.fetchYearlyIncome(); // 获取当前年份的年收入
    this.fetchMonthlyIncome(); // 获取当前年份和月份的月收入
  },
};
</script>
<style>
.v-application {
  background-image: url('@/assets/seller01.png'), linear-gradient(to bottom, #dfdd8d, #d0aaae);
  background-repeat: no-repeat, repeat;
  background-position: right bottom;
  /* 圖片位置在右下角 */
  background-attachment: fixed;
  /* 圖片固定在視窗中 */
  background-size: 13%;
}
</style>
