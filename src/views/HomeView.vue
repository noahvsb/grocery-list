<script setup lang="ts">
import { ref } from "vue";

import { createList } from "@/util/functions";

import ListView from "@/views/ListView.vue";

const props = defineProps<{
    code: string | undefined,
}>();

const listName = ref("");
const loading = ref(false);

async function handleCreateList() {
    if (!listName.value) return;
    loading.value = true;

    await createList(listName.value);

    listName.value = "";
    loading.value = false;
}
</script>

<template>
    <span v-if="!props.code">
        <h1>Grocery List</h1>
        <input v-model="listName" placeholder="List name" @keyup.enter="handleCreateList" />
        <button v-if="!loading" :disabled="listName === ''" @click=handleCreateList>Create List</button>
        <span v-if="loading"> loading ...</span>
    </span>
    <ListView v-else :code="props.code" />
</template>
 
<style scoped>
</style>