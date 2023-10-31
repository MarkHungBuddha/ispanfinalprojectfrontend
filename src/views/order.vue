<template>
    <div>
        <h1>訂單列表</h1>
        <table>
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>買家</th>
                    <th>訂單日期</th>
                    <th>訂單金額</th>
                    <th>訂單狀態</th>
                    <th>送貨地址</th>
                    <th>商品清單</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.orderid">
                    <td>{{ order.orderid }}</td>
                    <td>{{ order.buyer }}</td>
                    <td>{{ order.merchanttradedate }}</td>
                    <td>{{ order.totalamount }}</td>
                    <td>{{ order.statusname }}</td>
                    <td>{{ order.orderaddess }}</td>
                    <td>
                        <ul>
                            <li v-for="product in order.products" :key="product.imagepath">
                                <div>
                                    <img :src="product.imagepath" alt="Product Image" />
                                </div>
                                <div>
                                    <strong>{{ product.productName }}</strong>
                                </div>
                                <div>
                                    數量: {{ product.quantity }}
                                </div>
                                <div>
                                    單價: {{ product.unitprice }}
                                </div>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            orders: [],
        };
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            axios
                .get('http://localhost:8080/customer/api/findAllOrders', {
                    params: {
                        p: 1,
                    },
                })
                .then((response) => {
                    this.orders = response.data.content;
                })
                .catch((error) => {
                    console.error('無法檢索訂單：', error);
                });
        },
    },
};
</script>
  