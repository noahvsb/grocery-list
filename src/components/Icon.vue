<script setup lang="ts">
defineProps<{
  name: 'plus' | 'trash' | 'pencil' | 'check' | 'x';
}>();
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'plus'" d="M10 4v12M4 10h12" />
    <path v-else-if="name === 'trash'" d="M4 6h12M8 6V4h4v2M6 6l.8 10.2a1 1 0 0 0 1 .8h4.4a1 1 0 0 0 1-.8L14 6" />
    <path v-else-if="name === 'pencil'" d="M13.4 3.6l3 3L6.8 16.2l-4 .9.9-4z" />
    <path v-else-if="name === 'check'" d="M4 10.5l4 4 8-8.5" />
    <path v-else-if="name === 'x'" d="M5 5l10 10M15 5L5 15" />
  </svg>
</template>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  display: block;
}
</style>