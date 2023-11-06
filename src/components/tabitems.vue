<template>
    <v-app>
        <v-main>
            <v-container>

                <!-- 商品目录标题 -->
                <v-row>
                    <v-col>
                        <div class="raised-box">
                            <h1 class="display-1">每日新發現</h1>
                        </div>
                    </v-col>
                </v-row>

                <!-- 分类列表和商品卡片的工作区 -->
                <v-row no-gutters>
                    <!-- 分类列表的工作区 -->
                    <v-col cols="5" md="2">
                        <div class="category-section">
                            <v-list>
                                <v-list-item v-for="category in categories" :key="category"
                                    @mouseover="selectCategory(category)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ category }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-col>

                    <!-- 商品卡片的工作区 -->
                    <v-col cols="12" md="10">
                        <v-row no-gutters>
                            <v-col v-for="(product, index) in displayedProducts" :key="index" cols="500" sm="6" md="4"
                                lg="3">
                                <v-card class="product-card">
                                    <v-img :src="`https://i.imgur.com/${product.imagepath}.png`" alt="Product Image"
                                        class="product-image" @click="navigateToProduct(product.productid)"></v-img>
                                    <div class="product-name">{{ product.productname }}</div>
                                    <div class="price-text">
                                        <div class="original-price">原價: {{ product.price }}</div>
                                        <div v-if="product.specialprice > 0" class="special-price">特價: {{
                                            product.specialprice }}</div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div class="raised-box">
                            <h1 class="display-1">猜你喜歡</h1>
                        </div>
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
            displayedProducts: [], // 存放API取得的產品資料
            categories: [ // 添加大分類的數據
                '筆記型電腦', '光碟機', '顯示卡', '硬碟_SSD',
                '桌上型電腦', '電供_線材', '軟體'
            ],

            currentPage: 1,
            totalPages: 1, // 初始化总页数为1
            showLargeAppliances: false, // 控制大型家電内容的显示状态
            minPrice: 0,
            maxPrice: 9999999,
            priceFilter: false,

            // 願望清單彈跳
            snackbar: false, // 控制Snackbar顯示的變量
            snackbarText: '', // 顯示在Snackbar中的消息
            snackbarColor: '', // Snackbar的顏色
            // 購物車彈跳
            wishlistSnackbar: false,
            wishlistSnackbarText: '',
            wishlistSnackbarColor: '',

            selectedProductDetails: null, // 用於存儲從後端獲取的產品詳情

        };
    },
    watch: {
        currentPage(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.fetchProducts(this.selectedCategoryName);
            }
        }
    },
    //願望清單 生命茅點
    created() {
        if (Array.isArray(this.displayedProducts)) {
            this.displayedProducts.forEach(product => {
                product.inWishlist = localStorage.getItem(product.productid) === 'true';
            });
        }
    },
    methods: {
        selectCategory(category) {
            // 在這裡實現選擇商品類別後的邏輯
            console.log(`Selected category: ${category}`);
            // 根據選擇的類別拉取產品資料
            this.fetchCategoryProducts(category);
        },

        fetchCategoryProducts(categoryName) {
            // 使用axios調用API
            axios.get("http://localhost:8080/public/api/categoryname", {
                params: {
                    categoryname: categoryName,
                    minPrice: 0, // 起始價格
                    maxPrice: 999999.99, // 最高價格
                    page: 1, // 頁碼
                    pageSize: 4, // 每頁4筆資料
                }
            }).then(response => {
                console.log('API response:', response.data); // 檢查數據結構
                if (response.data && response.data.content && response.data.content.length) {
                    // 取前4条数据赋值给displayedProducts
                    this.displayedProducts = response.data.content.slice(0, 4);
                }
            }).catch(error => {
                console.error("Error fetching category products:", error);
                this.displayedProducts = []; // 出错时清空数组});
            });
        },

        //添加跳轉頁面到productPage
        navigateToProduct(productid) {
            this.$router.push({ name: 'ProductPage', params: { productId: productid } });
        },

        selectProduct(product) {
            // 在这里实现选择商品后的逻辑
            console.log('选择的商品:', product.productname);
            // 例如，添加商品到购物车的代码
        },


    },
    // 当组件创建完成后立即获取数据
    mounted() {

        this.fetchCategoryProducts('筆記型電腦'); // 也可以在这里调用方法获取默认类别的数据
    },
    // ... 其他方法 ...
};
</script>
  
<style scoped>
.product-image {
    height: 140px;
    /* 固定圖片的高度 */
    width: 100%;
    /* 圖片寬度與卡片相同 */
    object-fit: cover;
    /* 圖片覆蓋整個可用空間，可能會被裁剪 */
}

/* 其他元素如標題和副標題可能需要調整來適應固定大小的卡片 */
.v-card-title {
    white-space: normal;
    /* 允許換行 */
    line-height: 1.2;
    /* 行高可以根據需要調整 */
    margin: 0;
    /* 移除可能的外邊距 */
    padding: 0;
    /* 移除可能的內邊距 */
}

.v-card-subtitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.v-card {
    overflow: hidden;
    /* 隱藏超出邊界的內容 */
}

.first-row {
    margin-top: 20px;
    /* 或者您想要的距離 */
}

.product-name {
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
    /* 限制最大寬度 */
}

.product-card {
    width: 100%;
    /* 卡片寬度與包含它的容器寬度相同 */
    max-width: 250px;
    /* 最大寬度，確保卡片不會太大 */
    margin-bottom: 16px;
    /* 添加適當的底部外邊距 */
    display: flex;
    /* 使用flex布局 */
    flex-direction: column;
    /* 子項目垂直堆疊 */
    justify-content: space-between;
    /* 子項目之間的空間均勻分佈 */
    height: 350px;
    /* 固定卡片高度 */

}

/* 添加样式 */
.mb-5 {
    margin-bottom: 5rem;
    /* 添加适当的下边距 */
}

/* 购物车图标样式 */
.v-btn--icon {
    margin-right: 1rem;
    /* 图标间隔 */
}

.original-price {
    font-size: 16px;
    /* 設定原價的字體大小 */
}

.special-price {
    font-size: 20px;
    /* 設定特價的字體大小 */
    color: red;
    /* 特價顯示為紅色 */
}

.price-text {
    text-align: center;
    /* 将文本居中对齐 */
}

.price-text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* 使子元素垂直堆叠 */
}

.raised-box {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影创建浮起效果 */
    padding: 1rem;
    /* 添加一些内边距 */
    border-radius: 8px;
    /* 如果需要可以加圆角 */
    background-color: white;
    /* 设置背景颜色 */
    margin: 1rem 0;
    /* 添加一些外边距 */

    /* 添加置中样式 */
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    text-align: center;
    /* 文本对齐方式为居中 */
}

.product-workspace {
    /* 确保工作区内的卡片有合适的间隔和布局 */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    /* 或者flex-start等，取决于您的具体需要 */
    align-items: stretch;
    /* 确保卡片在垂直方向上拉伸以填满可用空间 */
    padding: 16px;
    /* 根据需要添加适当的内边距 */
}

.category-section {
    border: 1px solid #ddd;
    /* 为整个分类列表添加边框 */
    /* 其他样式 */
}
</style>