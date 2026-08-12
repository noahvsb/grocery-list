<script setup lang="ts">
import { ref, onMounted } from "vue";

import type { GroceryList } from "@/util/types";
import { deleteList, getList, addItem, removeItem, editItem } from "@/util/functions";

import ListItem from "@/components/ListItem.vue";
import AreYouSure from "@/components/AreYouSure.vue";


const props = defineProps<{
    code: string;
}>();

const data = ref<GroceryList | null>(null);
const loading = ref(true);

// inputs
const addItemName = ref("");
const addItemAmount = ref<number | null>(null);

// edit mode buffers (one per list item, mirrors data.list order)
const editBuffer = ref<{ name: string; amount: number }[]>([]);

// toggles
const showDeletePopup = ref(false);
const addItemMode = ref(false);
const removeItemMode = ref(false);
const editItemMode = ref(false);

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

    addItem(data.value, addItemName.value, addItemAmount.value);

    addItemName.value = "";
    addItemAmount.value = null;
    toggleAddItemMode();
}

function handleRemoveItem(itemId: number) {
    if (!data.value) return;

    removeItem(data.value, itemId);
}

async function handleEditItem(itemIndex: number) {
    if (!data.value) return;

    const buffered = editBuffer.value[itemIndex];
    if (!buffered || !buffered.name) return;

    await editItem(data.value, itemIndex, buffered.name, buffered.amount);

    toggleEditItemMode();
}

// togglers
function toggleDeletePopup() {
    showDeletePopup.value = !showDeletePopup.value;
}

function toggleAddItemMode() {
    addItemMode.value = !addItemMode.value;
    if (addItemMode.value) {
        removeItemMode.value = false;
        editItemMode.value = false;
    }
}

function toggleRemoveItemMode() {
    removeItemMode.value = !removeItemMode.value;
    if (removeItemMode.value) {
        addItemMode.value = false;
        editItemMode.value = false;
    }
}

function toggleEditItemMode() {
    editItemMode.value = !editItemMode.value;
    if (editItemMode.value) {
        addItemMode.value = false;
        removeItemMode.value = false;

        // seed the edit buffer from current data
        editBuffer.value = data.value
            ? data.value.list.map((item) => ({ name: item.name, amount: item.amount }))
            : [];
    }
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
                <button @click="toggleRemoveItemMode">{{ removeItemMode ? "Cancel" : "Remove Items" }}</button>
                <button @click="toggleEditItemMode">{{ editItemMode ? "Cancel" : "Edit Items" }}</button>
                <!-- <button @click="toggleDeletePopup" style="color:red;">Delete List</button> -->
            </div>

            <!-- Add mode -->
            <div v-if="addItemMode" style="margin-top: 0.5rem;">
                <input v-model="addItemName" placeholder="Item name" @keyup.enter="handleAddItem" />
                <input
                    v-model="addItemAmount"
                    placeholder="Amount (optional)"
                    type="number"
                    min="1"
                    @keyup.enter="handleAddItem"
                />
                <button :disabled="addItemName === ''" @click="handleAddItem">Add</button>
            </div>

            <!-- List Items -->
            <ul>
                <li v-for="(item, index) in data.list" :key="item.id">
                    <template v-if="editItemMode && editBuffer[index]">
                        <input
                            v-model="editBuffer[index].name"
                            placeholder="Item name"
                            @keyup.enter="handleEditItem(index)"
                        />
                        <input
                            v-model="editBuffer[index].amount"
                            type="number"
                            min="1"
                            @keyup.enter="handleEditItem(index)"
                        />
                        <button @click="handleEditItem(index)">Save</button>
                    </template>
                    <template v-else>
                        <ListItem :item="item" />
                        <!-- X button only in remove mode -->
                        <button v-if="removeItemMode" @click="handleRemoveItem(item.id)" style="margin-left: 0.5rem; color: red;">X</button>
                    </template>
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
