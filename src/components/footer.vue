<template>
    <div class="footer-container">
        <div class="footer-section-wrapper">

            <!-- 關於順發部分 -->
            <section class="footer-section">
                <h2>關於我們</h2>
                <ul>
                    <li><router-link to="#">關於寶鐘海賊購物網站</router-link> </li>
                    <li><router-link to="#">服務據點</router-link></li>
                    <li><router-link to="#">聯繫我們</router-link></li>
                </ul>
            </section>
        </div>

        <!-- 購物須知部分 -->
        <div class="footer-section-wrapper">
            <section class="footer-section">
                <h2>購物須知</h2>
                <ul>
                    <li><router-link to="#">加入會員</router-link> </li>
                    <li><router-link to="#">購物流程</router-link> </li>
                    <li><router-link to="#">會員服務條款</router-link> </li>
                    <li><router-link to="/PrivacyPolicy">隱私權政策</router-link></li>
                    <li><router-link to="#">防詐騙宣導</router-link></li>
                </ul>
            </section>
        </div>

        <!-- 我的帳戶部分 -->
        <div class="footer-section-wrapper">
            <section class="footer-section">
                <h2>我的帳戶</h2>
                <ul>
                    <li><router-link to="#">訂單/出貨進度</router-link></li>
                    <li><router-link to="#">取消訂單</router-link></li>
                    <li><router-link to="#">退貨/換貨</router-link></li>
                    <li><router-link to="#">會員中心</router-link></li>
                </ul>
            </section>
        </div>

        <!-- 客戶服務部分 -->
        <div class="footer-section-wrapper">
            <section class="footer-section">
                <h2>客戶服務</h2>
                <ul>
                    <li><router-link to="#">常見問題 Q&A</router-link></li>
                    <li><router-link to="#">訂單相關問題</router-link></li>
                    <li><router-link to="#">退換貨/維修</router-link></li>
                    <li><router-link to="#">付款方式說明</router-link></li>
                </ul>
            </section>
        </div>
    </div>
</template>
  
<script>
// Vue 實例化或者組件邏輯
</script>
  
<style>
.footer-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0;
    flex-wrap: wrap;
    background-color: rgb(160, 160, 247);
    /* 设置背景颜色为浅蓝色 */
    font-size: 1.1em;
    /* 增加字体大小 */
}


.footer-section h2 {
    margin: 0 0 10px 0;
    font-size: 1.3rm;
    color: white;
    /* 可以为标题设置更大的字体大小 */

    /* 設置標題的下邊距 */
}

.footer-section-wrapper {
    flex: 1;
    /* 確保所有的 wrapper 都能彈性地填滿空間 */
    max-width: 150px;
    /* 或者您需要的任何最大寬度 */
    padding: 0 10px;
    /* 留出一些內邊距 */
}

.router-link-active,
.router-link-exact-active,
.footer-section a {
    color: white;
    text-decoration: none;
}

.footer-container {
    background-color: rgb(46, 46, 228);
    /* 设置背景颜色为蓝色 */

}
</style>
  