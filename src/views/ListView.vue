<script setup lang="ts">
import { ref, onMounted } from "vue";

import type { GroceryList } from "@/util/types";
import { deleteList, getList, addItem, removeItem } from "@/util/functions";

import ListItem from "@/components/ListItem.vue";
import AreYouSure from "@/components/AreYouSure.vue";


const props = defineProps<{
    code: string;
}>();

const data = ref<GroceryList | null>(null);
const loading = ref(true);

// inputs
const addItemName = ref("");
const addItemExtra = ref("");

// toggles
const showDeletePopup = ref(false);
const addItemMode = ref(false);
const removeItemMode = ref(false);

// fetch data on mount
onMounted(async () => {
    loading.value = true;
    try {
        data.value = await getList(props.code);
    } finally {
        loading.value = false;
    }
});

// handlers
async function handleDelete() {
  if (!data.value) return;

  await deleteList(data.value.code);
  data.value = null; // remove local state
  showDeletePopup.value = false;
}

function handleAddItem() {
    if (!addItemName.value || !data.value) return;

    addItem(data.value, addItemName.value, addItemExtra.value);

    addItemName.value = "";
    addItemExtra.value = "";
    toggleAddItemMode();
}

function handleRemoveItem(itemId: number) {
    if (!data.value) return;

    removeItem(data.value, itemId);

    toggleRemoveItemMode();
}

// togglers
function toggleDeletePopup() {
    showDeletePopup.value = !showDeletePopup.value;
}

function toggleAddItemMode() {
    addItemMode.value = !addItemMode.value;
    if (addItemMode.value) removeItemMode.value = false; // max 1 mode at a time
}

function toggleRemoveItemMode() {
    removeItemMode.value = !removeItemMode.value;
    if (removeItemMode.value) addItemMode.value = false; // max 1 mode at a time
}
</script>

<template>
    <span v-if="!loading">
        <span v-if="!data">
            <h1>404</h1>
            <h2>No grocery list found with code: {{ code }}</h2>
        </span>
        <span v-else><h1>{{ data.name }}</h1>

            <!-- List Controls -->
            <div style="margin-bottom: 1rem;">
                <button @click="toggleAddItemMode">{{ addItemMode ? "Cancel" : "Add Item" }}</button>
                <button @click="toggleRemoveItemMode">{{ removeItemMode ? "Cancel" : "Remove Item" }}</button>
                <button @click="toggleDeletePopup" style="color:red;">Delete List</button>
            </div>

            <!-- Add mode -->
            <div v-if="addItemMode" style="margin-top: 0.5rem;">
                <input v-model="addItemName" placeholder="Item name" />
                <input v-model="addItemExtra" placeholder="Extra info (optional)" />
                <button @click="handleAddItem">Add</button>
            </div>

            <!-- List Items -->
            <ul>
                <li v-for="item in data.list" :key="item.id" >
                    <ListItem :item="item" />

                    <!-- X button only in remove mode -->
                    <button v-if="removeItemMode" @click="handleRemoveItem(item.id)" style="margin-left: 0.5rem; color: red;">X</button>
                </li>
            </ul>

            <!-- Delete Popup -->
            <AreYouSure
                :visible="showDeletePopup"
                message="Are you sure you want to delete this list?"
                @confirm="handleDelete"
                @cancel="toggleDeletePopup"
            />
        </span>
    </span>
</template>

<style scoped>
</style>