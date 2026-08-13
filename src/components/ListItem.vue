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
        class="list-item"
        :class="{ 'list-item--struck': props.item.strikethrough }"
        @click="handleClick"
    >
        <span class="list-item__name">{{ item.name }}</span>
        <span v-if="props.item.amount > 1" class="list-item__amount">&times;{{ item.amount }}</span>
    </span>
</template>

<style scoped>
.list-item {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    cursor: pointer;
}

.list-item__name {
    word-break: break-word;
}

.list-item--struck .list-item__name {
    text-decoration: line-through;
    color: var(--ink-soft);
}

.list-item__amount {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--ink-soft);
    background: var(--paper-alt);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.05rem 0.45rem;
}
</style>