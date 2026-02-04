<script setup lang="ts">
import type { ListItem } from "@/util/types";

const props = defineProps<{
    item: ListItem;
}>();
</script>

<template>
    {{ item.name }}
    <span v-if="props.item.extra">
        ({{ item.extra }})
    </span>
</template>

<style scoped>
</style>