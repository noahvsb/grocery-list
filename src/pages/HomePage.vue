<script setup lang="ts">
import { createList } from "@/functions/list.ts";
</script>

<template>
    <h1>grocery list</h1>
    <button @click=createList>create list</button>
</template>

<style scoped>
</style>