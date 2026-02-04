<script setup lang="ts">
import type { ListItem } from "@/util/types";


const props = defineProps({
  code: String,
});

// TODO: fetch list data from supabase
// for now just hardcoded data
const data: ListItem[] = [
  { name: "apple", amount: 8 },
  { name: "banana", amount: 5 },
  { name: "bread", amount: 1 },
];
</script>

<template>
    <h1>CODE: {{ code }}</h1>
    <ul>
        <li
            v-for="item in data.filter(i => i.amount >= 1)"
            :key="item.name"
        >
            {{ item.name }}
            <span v-if="item.amount > 1">
                (x {{ item.amount }})
            </span>
        </li>
    </ul>
</template>

<style scoped>
</style>