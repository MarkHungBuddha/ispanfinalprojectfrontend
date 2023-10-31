<template>
    <div class="text-center">
        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props"> 行動通訊 </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu open-on-hover>
            <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on">大型家電</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in items2" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
  
<script>
export default {
    data: () => ({
        items: [
            { title: '行動電源_手機配件' },
            { title: '相機配件' },
            { title: '行車導航' },
            { title: '手機' },
            { title: '相機_攝影' },
            { title: '穿戴裝置' },
            { title: '平板電腦' },
        ],
        items2: [
            { title: '洗衣機' },
            { title: '乾衣機' },
        ],
    }),
}
</script>
    
<style></style>