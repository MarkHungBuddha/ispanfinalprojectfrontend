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
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">電腦周邊</v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(PCperipherals, index) in computerInfo" :key="index"
                                        @click="fetchProducts(PCperipherals)">
                                        <v-list-item-title>{{ PCperipherals }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">小型家電</v-btn>
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
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">視聽娛樂</v-btn>
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
                    <v-col>
                        <div class="text-center">
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props" @mouseenter="showItems">辦公耗材</v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(info, index) in computerInfo" :key="index"
                                        @click="fetchProducts(info)">
                                        <v-list-item-title>{{ info }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>



                </v-row>
                <v-row>
                    <v-col v-for="(product, index) in products" :key="index" cols="12" sm="6" md="4" lg="3" xl="2.4">
                        <v-card>
                            <v-card-text class="d-flex flex-column align-center">
                                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                                    class="product-image mr-2" style="width: 100px;"></v-img>
                                <v-card-title class="text-truncate">{{ product.productname }}</v-card-title>
                                <div>价格: {{ product.price }}</div>
                                <div>特价: {{ product.specialprice }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <!-- 使用 <v-pagination> 组件来显示页码 -->
                <div class="pagination">
                    <v-pagination v-model="currentPage" :length="totalPages" @input="pageChanged">
                    </v-pagination>

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
            PCperipherals: [

            ],












            currentPage: 1,
            totalPages: 0, // 初始化总页数为0
            showLargeAppliances: false, // 控制大型家電内容的显示状态
        };
    },

    methods: {
        // pageChanged(page) {
        //     this.fetchProducts(this.selectedCategoryName, page);
        // },
        fetchProducts(categoryName, page) {
            if (this.selectedCategoryName !== categoryName) {
                page = 1; // 如果类别改变，重置页码为1
            }
            this.currentPage = page; // 更新当前页码

            this.selectedCategoryName = categoryName; // 更新当前选中的类别





            axios
                .get("http://localhost:8080/public/api/categoryname", {
                    params: {
                        categoryname: categoryName,
                        minPrice: 0.0,
                        maxPrice: 999999.99,
                        page: this.currentPage, // 傳遞當前頁碼
                        pageSize: 4,
                    },
                })
                .then((response) => {

                    this.products = response.data.content; // 当前页的产品数据
                    this.totalPages = response.data.totalPages; // 总页数，假设后端提供了这个信息

                })
                .catch((error) => {
                    console.error("Error fetching products:", error);


                });
        },
        showItems() {
            // 当鼠标进入 "行動通訊" 下拉菜单时触发的事件处理程序
        },
        showLargeAppliances() {
            this.showLargeAppliances = true;
        },
        pageChanged(newPage) {
            this.fetchProducts(this.selectedCategoryName, newPage);
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

.v-card-title {
    word-wrap: break-word;
    /* 允许在单词边界自动换行 */
    overflow-wrap: break-word;
    /* 允许在任意字符之间自动换行 */
    max-width: 100%;
    /* 确保标题宽度不超过卡片宽度 */
    white-space: normal;
    /* 允许文本自然换行 */
    overflow: hidden;
    /* 隐藏超出元素框的内容 */
    text-overflow: ellipsis;
    /* 文本溢出时显示省略号 */
    display: -webkit-box;
    /* 将对象作为弹性盒子模型显示 */
    -webkit-line-clamp: 2;
    /* 限制显示的文本行数 */
    -webkit-box-orient: vertical;
    /* 定义弹性盒子元素的子元素的排列方向 */
}
</style>
  