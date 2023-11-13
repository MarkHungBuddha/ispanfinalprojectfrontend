<template>
  <div>
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from 'axios';

export default {
  name: 'ChartComponent',
  props: {
    selectedYear: Number,
  },
  data() {
    return {
      chartData: [] // 初始化 chartData
    };
  },
  mounted() {
    this.fetchChartData(); // 在 mounted 鉤子中調用數據獲取方法
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await axios.get(`http://localhost:8080/seller/api/revenue/yearEachMonth`, {
          params: { year: this.selectedYear }
        });
        this.chartData = response.data.map(item => item.totalamount);
        this.renderChart(); // 數據獲取後再渲染圖表
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderChart() {
      const ctx = this.$refs.myChart;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          datasets: [{
            label: '年收入',
            data: this.chartData,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
};
</script>
