<script setup lang="ts">
    const props = defineProps<{
        text: string
        func: () => void
    }>()
</script>

<template>
    <button @click="props.func()">
        {{ text }}
    </button>
</template>

<style scoped>
</style>