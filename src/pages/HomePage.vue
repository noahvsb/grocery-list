<script setup lang="ts">
import { CustomButton } from "@/components/components.ts";
import { createList } from "@/functions/list.ts";
</script>

<template>
    <h1>grocery list</h1>
    <CustomButton :text="'create list'" :func=createList />
</template>

<style scoped>
</style>