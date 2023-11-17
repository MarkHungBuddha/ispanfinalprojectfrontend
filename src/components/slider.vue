<template>
  <v-container fluid> <!-- 使容器滿版 -->
    <v-col cols="12"> <!-- 使用所有12個欄位 -->
      <v-carousel cycle height="330" hide-delimiter-background show-arrows="hover">
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet height="100%" class="d-flex align-center justify-center">
            <!-- 圖片將覆蓋整個可用空間，可能會被裁剪以適應 -->
            <v-img :src="slide" :alt="`Slide ${i + 1}`" cover @click="handleSlideClick(i)" />
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        'https://i.imgur.com/3r4DBjR.jpg',
        'https://i.imgur.com/C1KYdmM.jpg',
        'https://i.imgur.com/Vqvbl7S.jpg',
        'https://i.imgur.com/ZQiMpio.jpg',
        'https://i.imgur.com/RBfQ9Q6.jpg',
      ],
    }
  },
  methods: {
    handleSlideClick(index) {
      // 根據點擊的圖片索引導航到對應的路徑
      const paths = [
        '/products/筆記型電腦',
        '/products/冰箱',
        '/products/顯示卡',
        '/products/網路裝置',
        '/products/耳機_喇叭',
        // ...其他路徑
      ];
      if (index >= 0 && index < paths.length) {
        this.$router.push(paths[index]);
      }
    }
  },
}
</script>
