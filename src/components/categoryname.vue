<template>
    <div class="text-center">
        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">行動通訊</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">大型家電</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(appliance, index) in appliances" :key="index">
                    <v-list-item-title>{{ appliance }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">電腦資訊</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(info, index) in computerInfo" :key="index">
                    <v-list-item-title>{{ info }}</v-list-item-title>
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
        appliances: ['洗衣機', '乾衣機', '冷氣', '冰箱'],
        computerInfo: [
            '筆記型電腦', '主機板', '記憶體', '光碟機',
            '機殼', '散熱風扇', '顯示卡', '硬碟_SSD',
            '桌上型電腦', '電供_線材', '軟體'
        ],
    }),
};
</script>
  