<template setup>
    <div class="privacy-policy">
        <div class="privacy-policy">
            <h1>隱私政策</h1>
            <br>
            <hr>
            <br>
            <br>
            <!-- 以下是隱私政策的內容 -->
            <p class="intro-text">歡迎您來到寶鐘海賊購物網站。我們尊重您的隱私權，並致力於保護您的個人資料。本隱私政策解釋了我們如何收集、使用和（在某些條件下）分享您的個人信息，以及您如何可以訪問和更新您的信息。
            </p>

        </div>
        <p class="text-right">最後更新日期：{{ lastUpdatedDate }}</p>

        <br>
        <h2>1. 資訊收集</h2>
        <p>我們可能會收集包括您的姓名、聯絡資料、電子郵件地址、送貨地址、購物偏好及瀏覽歷史等信息。</p>
        <br>
        <h2>2. 資訊使用</h2>
        <p>我們使用您的資訊來處理您的訂單、提供客戶服務、改善我們的商品和服務、進行市場分析，以及（經您同意）向您發送市場推廣資訊。</p>
        <br>
        <h2>3. 資訊分享與披露</h2>
        <p>除非獲得您的同意，我們不會與第三方分享您的個人資訊，除非法律要求或是為了提供您請求的服務所必須。</p>
        <br>
        <h2>4. 用戶的權利</h2>
        <p>您有權查看、更正、更新或刪除您的個人資訊。如果您希望行使這些權利，請聯絡我們。</p>
        <br>
        <h2>5. 數據保安</h2>
        <p>我們採取合理的預防措施來保護您的個人資訊免受丟失、濫用和未經授權的訪問、披露、更改和破壞。</p>
        <br>
        <h2>6. 隱私政策變更</h2>
        <p>我們可能會不時更新本隱私政策。我們會在我們的網站上公布新的政策，並更新“最後更新日期”。</p>
        <br>
        <h2>7. 聯繫我們</h2>
        <p>如果您對我們的隱私政策有任何疑問，請通過[您的聯絡方式]與我們聯繫。</p>
    </div>
</template>
      
<script setup>
import { ref } from 'vue'

const lastUpdatedDate = ref('修訂 1.0 版 ，修訂日期2023年11月10日')
</script>
      
<style scoped>
.privacy-policy {
    max-width: 800px;
    margin: auto;
    padding: 20px;
}

.privacy-policy h1 {
    color: black;
    text-align: center;
}

/* 新增的类样式 */
.intro-text {
    font-size: 1.25rem;
    /* 这会使字体变大 */
    color: black;
    /* 保持原有颜色 */
    line-height: 1.6;
    /* 保持原有行高 */
}

.text-right {
    text-align: right;
}
</style>
  