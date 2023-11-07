<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-carousel cycle height="400" hide-delimiter-background show-arrows="hover">
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <!-- 檢查索引，並根據索引為圖片綁定不同的點擊事件 -->
            <v-img :src="slide" :alt="`Slide ${i + 1}`" height="100%" @click="handleSlideClick(i)" />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        'https://i.imgur.com/W4UDro2.jpg',
        'https://i.imgur.com/4bQcwkh.jpg',
        'https://i.imgur.com/Vqvbl7S.jpg',
        'https://i.imgur.com/1ZTYwQp.jpg',
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
        '/products/桌上型電腦',
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
