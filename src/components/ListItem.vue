<script setup lang="ts">
import type { ListItem } from "@/util/types";

const props = defineProps<{
    item: ListItem;
}>();

const emit = defineEmits<{
    toggleStrikethrough: [itemId: number];
}>();

function handleClick() {
    emit("toggleStrikethrough", props.item.id);
}
</script>

<template>
    <span
        @click="handleClick"
        :style="{ textDecoration: props.item.strikethrough ? 'line-through' : 'none', cursor: 'pointer' }"
    >
        {{ item.name }}
        <span v-if="props.item.amount > 1">
            (x{{ item.amount }})
        </span>
    </span>
</template>

<style scoped>
</style>