<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { langsConfig } from './plugins'

const { locale } = useI18n()
</script>

<template>
    <RouterView></RouterView>
</template>

<style scoped></style>
