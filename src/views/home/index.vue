<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="home page-container">
        <div>Home - {{ t('home.welcome') }} {{ t('name') }}</div>
        <div class="box"></div>
        <van-button type="primary">333</van-button>
    </div>
</template>

<style lang="scss" scoped>
.home {
    background-color: antiquewhite;
    .box {
        background-color: blue;
    }
}
</style>
