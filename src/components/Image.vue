<template>
  <div>
    <v-col cols="12">
      <v-file-input
        multiple
        show-size
        accept="image/*"
        v-model="productImages"
        :counter="1"
        :label="label"
        @change="previewImages"
        @click:clear="clearPreview"
      ></v-file-input>
    </v-col>

    <div v-for="(image, index) in previewedImages" :key="index">
      <img :src="image" alt="Product Image" width="100">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
  data() {
    return {
      productImages: [], // 存储用户选择的图像文件
      previewedImages: [] // 存储图像预览的URL
    };
  },
  methods: {
    previewImages() {
      this.previewedImages = []; // 清空之前的预览图像

      for (let i = 0; i < this.productImages.length; i++) {
        const image = URL.createObjectURL(this.productImages[i]);
        this.previewedImages.push(image);
      }
    },
    clearPreview() {
      this.previewedImages = []; // 清空预览图像
    }
  }
}
</script>
