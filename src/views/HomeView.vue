<script setup lang="ts">
import { ref } from "vue";

import { createList } from "@/util/functions";

import ListView from "@/views/ListView.vue";

const props = defineProps<{
    code: string | undefined,
}>();

const listName = ref("");

function handleCreateList() {
    if (!listName.value) return;
    createList(listName.value);
}
</script>

<template>
    <span v-if="!props.code">
        <h1>Grocery List</h1>
        <input v-model="listName" placeholder="List name" />
        <button @click=handleCreateList>Create List</button>
    </span>
    <ListView v-else :code="props.code" />
</template>

<style scoped>
</style>