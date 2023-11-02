<script setup>
import navbar from "@/components/navbar.vue";
</script>

<template>
  <v-app>
    <v-container>
      <navbar/>


      
    </v-container>
  </v-app>

</template>

<script>
export default {
  data() {
    return {
      
};
},
methods: {
fetchProducts() {
      axios.get('http://localhost:8080/seller/api/product', {
        params: {
          id: id,
        },
      })
    }
},
};
</script>
