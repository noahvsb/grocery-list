<script setup lang="ts">
import { ref } from "vue";

import { createList } from "@/util/functions";

import ListView from "@/views/ListView.vue";
import Icon from "@/components/Icon.vue";

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
    <div v-if="!props.code" class="card home-card">
        <p class="eyebrow">Fresh List</p>
        <h1 class="brand-title">Grocery List</h1>
        <p class="tagline">Name it, share the code, never forget the eggs.</p>
        <div class="home-form">
            <input class="input" v-model="listName" placeholder="List name" @keyup.enter="handleCreateList" />
            <button v-if="!loading" class="btn btn-primary" :disabled="listName === ''" @click="handleCreateList">
                <Icon name="plus" />
                <span>Create list</span>
            </button>
            <span v-if="loading" class="loading-text">loading &hellip;</span>
        </div>
    </div>
    <ListView v-else :code="props.code" />
</template>

<style scoped>
.home-card {
    text-align: left;
}

.brand-title {
    font-size: 2.1rem;
    margin-bottom: 0.35rem;
}

.tagline {
    color: var(--ink-soft);
    font-size: 0.85rem;
    margin: 0 0 1.5rem;
}

.home-form {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
}

.home-form .input {
    flex: 1;
    min-width: 10rem;
    width: auto;
}

.loading-text {
    color: var(--ink-soft);
    font-size: 0.85rem;
}
</style>