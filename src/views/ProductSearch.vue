<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">行動通訊</v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(item, index) in items" :key="index"
                                        @click="fetchProducts(item.title)">
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">大型家電</v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(appliance, index) in appliances" :key="index"
                                        @click="fetchProducts(appliance)">
                                        <v-list-item-title>{{ appliance }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">電腦資訊</v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(info, index) in computerInfo" :key="index"
                                        @click="fetchProducts(info)">
                                        <v-list-item-title>{{ info }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>
                </v-row>
                <div>
                    <div v-if="showPriceAndSpecialPrice">
                        <v-card>
                            <v-card-title>商品详情</v-card-title>
                            <v-card-text>
                                <v-img v-if="selectedCategoryImagepath"
                                    :src="`https://i.imgur.com/${selectedCategoryImagepath}.png`" alt="Product Image"
                                    class="product-image mr-2" style="width: 100px;"></v-img>
                                {{ selectedCategoryName }}
                                <div>價格: {{ selectedCategoryPrice }}</div>
                                <div>特價: {{ selectedCategorySpecialPrice }}</div>
                            </v-card-text>
                        </v-card>
                    </div>
                </div>
                <!-- 使用 <v-pagination> 组件来显示页码 -->
                <div class="pagination">
                    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7"></v-pagination>
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            selectedCategory: "",
            selectedCategoryName: "",
            selectedCategoryImagepath: "",
            selectedCategoryPrice: 0,
            selectedCategorySpecialPrice: 0,
            showPriceAndSpecialPrice: false,
            products: [],
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
            currentPage: 1,
            showLargeAppliances: false, // 控制大型家電内容的显示状态
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.products.length / 12);
        },
    },
    methods: {
        fetchProducts(categoryName) {
            axios
                .get("http://localhost:8080/public/api/categoryname", {
                    params: {
                        categoryname: categoryName,
                        minPrice: 0.0,
                        maxPrice: 999999.99,
                        page: this.currentPage,
                        pageSize: 12,
                    },
                })
                .then((response) => {
                    // 将新的结果添加到现有的结果数组中
                    this.products = this.products.concat(response.data.content);

                    if (this.products.length > 0) {
                        this.selectedCategoryName = this.products[0].productname;
                        this.selectedCategoryImagepath = this.products[0].imagepath;
                        this.selectedCategoryPrice = this.products[0].price;
                        this.selectedCategorySpecialPrice = this.products[0].specialprice;
                        this.showPriceAndSpecialPrice = true;
                    }
                })
                .catch((error) => {
                    console.error("無法获取产品列表", error);
                });
        },
        showItems() {
            // 当鼠标进入 "行動通訊" 下拉菜单时触发的事件处理程序
        },
        showLargeAppliances() {
            this.showLargeAppliances = true;
        },
    },
};
</script>
  
<style>
.smaller-card {
    max-width: 200px;
    margin: 0 auto;
}

.text-center {
    text-align: center;
}

.pagination {
    text-align: center;
    margin-top: 20px;
}
</style>
  