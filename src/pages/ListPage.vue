<script setup lang="ts">
import { ref } from "vue";

import ListItem from "@/components/ListItem.vue";
import { fetchData, addItem, removeItem } from "@/util/functions";


const props = defineProps<{
    code: string;
}>();

// TODO: check if no error occurs
const data = ref(fetchData(props.code));

// new item inputs
const newItemName = ref("");
const newItemExtra = ref("");

// mode toggles
const addMode = ref(false);
const removeMode = ref(false);

// handlers
function handleAdd() {
    if (!newItemName.value) return;

    addItem(props.code, data.value.list, { name: newItemName.value, extra: newItemExtra.value || "" });

    newItemName.value = "";
    newItemExtra.value = "";
    toggleAddMode();
}

function handleRemove(index: number) {
    removeItem(props.code, data.value.list, index);
    toggleRemoveMode();
}

function toggleAddMode() {
    addMode.value = !addMode.value;
    if (addMode.value) removeMode.value = false; // max 1 mode at a time
}

function toggleRemoveMode() {
    removeMode.value = !removeMode.value;
    if (removeMode.value) addMode.value = false; // max 1 mode at a time
}
</script>

<template>
    <h1>{{ data.name }}</h1>

    <!-- List Controls -->
    <div style="margin-bottom: 1rem;">
        <!-- Toggles -->
        <button @click="toggleAddMode">
            {{ addMode ? "Cancel" : "Add Item" }}
        </button>
        <button @click="toggleRemoveMode">
            {{ removeMode ? "Cancel" : "Remove Item" }}
        </button>

        <!-- Add mode inputs -->
        <div v-if="addMode" style="margin-top: 0.5rem;">
            <input v-model="newItemName" placeholder="Item name" />
            <input v-model="newItemExtra" placeholder="Extra info (optional)" />
            <button @click="handleAdd">Add</button>
        </div>
    </div>

    <!-- List Items -->
    <ul>
        <li v-for="(item, index) in data.list" :key="item.name + index" >
            <ListItem :item="item" />

            <!-- X button only in remove mode -->
            <button v-if="removeMode" @click="handleRemove(index)" style="margin-left: 0.5rem; color: red;">X</button>
        </li>
    </ul>
</template>

<style scoped>
</style>