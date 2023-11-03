import axios from 'axios';

export default (await import('vue')).defineComponent({
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
            totalPages: 1,
            showLargeAppliances: false,
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
        fetchProducts(categoryName) {
            if (this.selectedCategoryName !== categoryName) {
                this.currentPage = 1;
                this.selectedCategoryName = categoryName;
            }

            addProductToCart(productId); {
                const url = '/customer/api/shoppingCart';
                axios.post(url, null, { params: { productId: productId } })
                    .then(response => {
                        // 通知用户产品已添加到购物车
                        alert(response.data);
                    })
                    .catch(error => {
                        // 错误处理
                        console.error('Error adding product to cart:', error);
                        alert('无法添加商品到购物车。');
                    });
            }



            axios
                .get("http://localhost:8080/public/api/categoryname", {
                    params: {
                        categoryname: categoryName,
                        minPrice: 0,
                        maxPrice: 999999.99,
                        page: this.currentPage,
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
        // pageChanged(newPage) {
        //     this.fetchProducts(this.selectedCategoryName, newPage);
        // },
    },
});
