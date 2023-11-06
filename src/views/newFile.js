import axios from 'axios';

export default (await import('vue')).defineComponent({
    data() {
        return {
            options: {
                productname: '',
                products: [],
                searchText: '',
                search: '',
                selectedProductName: "",
                selectedCategoryImagepath: "",
                selectedCategoryPrice: 0,
                selectedCategorySpecialPrice: 0,
                showPriceAndSpecialPrice: false,
            },

            headers: [
                { text: '商品編號', value: 'productid' },
                { text: '名稱', value: 'productname' },
                { text: '價格', value: 'price' },
                { text: '特價', value: 'specialprice' },
                { text: '類別', value: 'categoryname' },
                { text: '數量', value: 'quantity' },
                { text: '描述', value: 'description' },
                { text: '圖片', value: 'imagepath' },
            ],
            products: [],
            totalProducts: 0,
            loading: false,



            currentPage: 1,
            totalPages: 1,
            showLargeAppliances: false,

            minPrice: 0,
            maxPrice: 9999999,
            priceFilter: false,

            // 願望清單彈跳
            snackbar: false,
            snackbarText: '',
            snackbarColor: '',

            // 購物車彈跳
            wishlistSnackbar: false,
            wishlistSnackbarText: '',
            wishlistSnackbarColor: '',
        };
    },

    //頁碼處理
    watch: {
        '$route.query.search': function (newVal) {
            this.searchText = newVal || '';
            this.currentPage = 1; // 重置为第一页
            this.fetchProducts();
        },
        currentPage: function (newVal) {
            if (newVal !== this.oldValue) {
                this.fetchProducts();
            }
        }
    },

    // 當前組件創建時的生命周期鉤子
    created() {
        // 當組件被創建時，檢查 URL 查詢參數並執行搜索
        this.searchText = this.$route.query.search || '';
        if (this.searchText) {
            this.fetchProducts();
        }
    },


    mounted() {
        this.fetchProducts();
    },
    methods: {
        applyFilters() {
            this.fetchProducts(this.selectedProductname);
        },

        showSnackbar(message, color) {
            this.snackbarText = message;
            this.snackbarColor = color;
            this.snackbar = true;
        },
        showWishlistSnackbar(message, color) {
            this.wishlistSnackbarText = message;
            this.wishlistSnackbarColor = color;
            this.wishlistSnackbar = true;
        },

        fetchProductsWithSearch() {
            this.currentPage = 1;
            // 如果從navbar獲得了搜尋詞，則使用它來發起產品搜尋
            if (this.searchText) {
                this.fetchProducts();
            } else {
                // 否則，使用組件內的搜尋詞來發起產品搜尋
                this.searchText = this.search;
                this.fetchProducts();
            }
        },
        // 從後端獲取產品數據
        fetchProducts() {
            console.log('开始 fetchProducts 方法');

            this.loading = true;
            // 根據當前的 options 更新查詢參數
            const params = {
                productname: this.searchText.trim(),
                minPrice: this.minPrice || 0,
                maxPrice: this.maxPrice || 999999.99,
                page: this.currentPage,
                itemsPerPage: 5, // 或者其他你希望每页显示的数量
            };

            axios.get('http://localhost:8080/public/api/products', { params })

                .then(response => {
                    this.loading = false;
                    this.products = response.data.content;
                    this.totalPages = response.data.totalPages;
                    console.log(this.products); // 檢查數據是否被正確設置

                })
                .catch(error => {
                    // 处理错误...
                    this.loading = false;

                    console.error('请求失败，错误信息:', error);
                    this.showSnackbar('檢索產品時發生錯誤。', 'error');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 加入購物車方法
        addProductToCart(productid) {

            axios
                .post('http://localhost:8080/customer/api/shoppingCart', null, {
                    withCredentials: true,

                    params: {
                        productId: productid,
                    }
                }, {
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => {
                    console.log(response);
                    if (response.data && Array.isArray(response.data.content)) {
                        this.products = response.data.content;
                        this.totalPages = response.data.totalPages;
                    } else {
                        // 如果没有产品，清空产品数组
                        this.products = [];
                        this.totalPages = 0;
                        this.showSnackbar('没有找到产品', 'info');
                    }
                })
                .catch(error => {
                    // 錯誤處理
                    console.error('Error adding product to cart:', error);
                    this.snackbarText = '無法添加商品到購物車';
                    this.snackbarColor = 'error'; // 錯誤消息使用紅色
                    this.snackbar = true; // 顯示Snackbar

                    // 如果API響應了請求但出現錯誤
                    if (error.response) {
                        console.error('Error response data:', error.response.data);
                        this.snackbarText = `Error: ${error.response.data.message}`;
                    } else {
                        // 服务器没有响应
                        this.snackbarText = 'Error: Server did not respond';
                    }
                });

        },
        //添加跳轉頁面到productPage
        navigateToProduct(productid) {
            this.$router.push({ name: 'ProductPage', params: { productId: productid } });
        },



        //願望清單
        addProductToWishlist(productId) {
            // 首先，找到相应的产品
            const product = this.products.find(p => p.productId === productId);
            if (!product) {
                console.error('找不到產品：', productId);
                return;
            }
            const newStatus = !product.inWishlist;

            // 发送 POST 请求到后端 API
            axios
                .post(`http://localhost:8080/customer/api/wishlist/${productId}`)
                .then(response => {
                    product.inWishlist = newStatus;
                    this.snackbarText = newStatus ? '商品已加入愿望清单' : '商品已移除愿望清单';
                    this.snackbarColor = 'success';
                    this.snackbar = true;
                })
                .catch(error => {
                    console.error('切换愿望清单状态时发生错误', error);
                    // ... 错误处理
                });

        },

        // 更新愿望清单状态
        updateWishlistStatus(productId, status) {
            const productIndex = this.products.findIndex(p => p.productId === productId);
            if (productIndex !== -1) {
                this.$set(this.products[productIndex], 'inWishlist', status);
                // ... 更新 Snackbar 和 localStorage
            }
        },

        // 切换愿望清单状态
        toggleWishlist(product) {
            // 此函数应该只负责切换状态，并调用 addProductToWishlist
            this.addProductToWishlist(product.productId);
        }
    },
});
