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
                                    <v-list-item v-for="(computerPeripheral, index) in computerPeripherals" :key="index"
                                        @click="fetchProducts(computerPeripheral)">
                                        <v-list-item-title>{{ computerPeripheral }}</v-list-item-title>
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
                                    <v-list-item v-for="(smallAppliance, index) in smallAppliances" :key="index"
                                        @click="fetchProducts(smallAppliance)">
                                        <v-list-item-title>{{ smallAppliance }}</v-list-item-title>
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
                                    <v-list-item v-for="(entertainment, index) in entertainments" :key="index"
                                        @click="fetchProducts(entertainment)">
                                        <v-list-item-title>{{ entertainment }}</v-list-item-title>
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
                                    <v-list-item v-for="(officeSupply, index) in officeSupplies" :key="index"
                                        @click="fetchProducts(officeSupply)">
                                        <v-list-item-title>{{ officeSupply }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col v-for="(product, index) in products" :key="index" cols="12" sm="6" md="4" lg="3" xl="2.4">
                        <v-card>
                            <v-card-text class="d-flex flex-column align-center">
                                <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                                    class="product-image mr-2" style="width: 100px;"></v-img>
                                <v-card-title class="text-truncate">{{ product.productname }}</v-card-title>
                                <div>價格: {{ product.price }}</div>
                                <div>特價: {{ product.specialprice }}</div>


                                <v-btn color="success" @click="addProductToCart(product.id)">加入購物車</v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>


                </v-row>
                <!-- 分頁控件 -->
                <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>

                <v-row>
                    <v-col cols="300" sm="4">
                        <v-switch v-model="priceFilter" label="啟用價格範圍過濾"></v-switch>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="minPrice" label="最小價格" type="number" :disabled="!priceFilter"
                            min="0"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="maxPrice" label="最大價格" type="number" :disabled="!priceFilter"
                            min="0"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" class="d-flex align-end">
                        <v-btn color="primary" @click="applyFilters">應用篩選</v-btn>
                    </v-col>
                </v-row>



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
            computerPeripherals: ['外接擴充', '鍵鼠週邊', '線材_接頭', '列印掃描', '電腦耳機_喇叭', '影像輸入裝置', '儲存裝置', '電源周邊', '網路裝置'],
            smallAppliances: ['耳機_喇叭', '生活家電', '廚房家電', '健康家電', '季節家電', '烹調家電', '家電配備'],
            entertainments: ['音樂_錄音', '電視配件', '電視遊樂器', '喇叭音響', '液晶電視', '投影機周邊', '視聽播放', '視聽配件'],
            officeSupplies: ['墨水碳粉色帶', '光碟片', '工具', '紙材', '辦公OA設備'],

            currentPage: 1,
            totalPages: 1, // 初始化总页数为1
            showLargeAppliances: false, // 控制大型家電内容的显示状态

            minPrice: 0,
            maxPrice: 9999999,
            priceFilter: false,
        };
    },
    watch: {
        currentPage(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.fetchProducts(this.selectedCategoryName);
            }
        }
    },

    methods: {
        applyFilters() {
            this.fetchProducts(this.selectedCategoryName);
        },

        fetchProducts(categoryName) {
            if (this.selectedCategoryName !== categoryName) {
                this.currentPage = 1;
                this.selectedCategoryName = categoryName;
            }

            axios
                .get("http://localhost:8080/public/api/categoryname", {
                    params: {
                        categoryname: categoryName,
                        minPrice: this.minPrice,
                        maxPrice: this.maxPrice,
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




        addProductToCart(productid) { // 注意這裡的參數名是小寫的 productid

            console.log('123' + productid)
            const product = this.products.find(p => p.id === productid);

            console.log(product.id)

            if (!product) {
                console.error('Product not found!');
                return;
            }
            console.log(product); // 這應該包含 productId

            const url = "http://localhost:8080/customer/api/shoppingCart";
            axios.post(url, {
                productId: product.id, // 确保这里是正确的产品 ID 字段
                // 其他需要发送的字段
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    // 成功添加到購物車後的操作，比如通知用戶
                    alert('成功');
                    alert(response.data);
                })
                .catch(error => {
                    // 錯誤處理
                    console.error('Error adding product to cart:', error);
                    alert('無法添加商品到購物車。');
                });
        }



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

.product-image {
    width: 100px;
    height: auto;
}

.v-card-title {
    word-wrap: break-word;
    /* 允许在单词边界自动换行 */
    overflow-wrap: break-word;
    /* 允许在任意字符之间自动换行 */
    max-width: 100%;

}
</style>
  