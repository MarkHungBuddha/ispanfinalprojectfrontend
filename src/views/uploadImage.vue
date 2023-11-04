<script setup>
import navbar from "@/components/navbar.vue";
import axios from 'axios';
</script>
<template>
  <v-app>
    <v-container>
      <navbar />
      <ProductImageUpload ref="uploader1" label="上傳商品圖片 (封面)" :od="1" />
      <ProductImageUpload ref="uploader2" label="上傳商品圖片" :od="2" />
      <ProductImageUpload ref="uploader3" label="上傳商品圖片" :od="3" />
      <ProductImageUpload ref="uploader4" label="上傳商品圖片" :od="4" />
      <ProductImageUpload ref="uploader5" label="上傳商品圖片" :od="5" />
      <ProductImageUpload ref="uploader6" label="上傳商品圖片" :od="6" />
      <v-btn @click="submitAllImages">提交所有圖片</v-btn>
    </v-container>
  </v-app>
</template>
<script>
import navbar from "@/components/navbar.vue";
import ProductImageUpload from "@/components/Image.vue";
import axios from 'axios';

export default {
  props: {
    productId: Number
  },
  components: {
    navbar,
    ProductImageUpload
  },
  data() {
    return {
      productId: null
    };
  },
  created() {
    console.log('Created hook called');
    this.productId = this.$route.params.productId;
    console.log('ProductId:', this.productId);
  },

  methods: {
    submitAllImages() {
      console.log('submitAllImages called');
      for (let i = 1; i <= 6; i++) {
        let uploader = this.$refs[`uploader${i}`];
        // 检查 uploader 是否定义以及 productImages 是否有文件
        if (uploader && uploader.productImages.length > 0) {
          // 由于 multiple 属性设置，可能有多个文件，这里假设我们只上传第一个文件
          let file = uploader.productImages[0]; // 获取数组中的第一个文件对象
          console.log(`File selected for upload: ${file.name}`);
          this.uploadImage(file, i);
        } else {
          console.log(`No file selected for uploader ${i}`);
        }
      }
    }

    ,
    uploadImage(file, od) {
      let formData = new FormData();
      formData.append('file', file);

      axios.put(`http://localhost:8080/seller/api/product/${this.productId}/${od}/editImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log(`图片 ${od} 上传成功:`, response.data);
          this.$router.push('/seller');
        })
        .catch(error => {
          console.error(`图片 ${od} 上传失败:`, error);
        });
    }
  }
}
</script>