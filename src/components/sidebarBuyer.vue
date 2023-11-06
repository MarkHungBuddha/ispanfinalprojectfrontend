<template>
  <v-navigation-drawer app>
    <v-list>
      <v-list-item-group>
        <v-expansion-panels>

          <v-expansion-panel>
            <v-expansion-panel-title>
              我的帳戶
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item to="/member">
                <v-list-item-title>個人檔案</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              購買清單
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list-item to="/order">
                <v-list-item-title>購買清單</v-list-item-title>
              </v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  // 如果有需要的話，這裡可以添加script部分。
}
</script>
