<script setup lang="ts">
import { ref } from "vue";

import { createList } from "@/util/functions";

const listName = ref("");

function handleCreateList() {
    if (!listName.value) return;
    createList(listName.value);
}
</script>

<template>
    <h1>Grocery List</h1>
    <input v-model="listName" placeholder="List name" />
    <button @click=handleCreateList>Create List</button>
</template>

<style scoped>
</style>