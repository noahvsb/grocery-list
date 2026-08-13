<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import type { GroceryList } from "@/util/types";
import { getList, addItem, removeItem, editItem } from "@/util/functions";

import ListItem from "@/components/ListItem.vue";
import AreYouSure from "@/components/AreYouSure.vue";
import Icon from "@/components/Icon.vue";


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
const showRemoveStruckPopup = ref(false);
const addItemMode = ref(false);
const removeItemMode = ref(false);
const editItemMode = ref(false);

const struckItemCount = computed(
    () => data.value?.list.filter((i) => i.strikethrough).length ?? 0
);

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

async function handleRemoveStruckItems() {
    if (!data.value) return;

    const struckIds = data.value.list
        .filter((i) => i.strikethrough)
        .map((i) => i.id);

    await Promise.all(struckIds.map((id) => removeItem(data.value!, id)));

    data.value.list = data.value.list.filter((i) => !i.strikethrough);
    showRemoveStruckPopup.value = false;
}

async function handleEditItem(itemIndex: number) {
    if (!data.value) return;

    const buffered = editBuffer.value[itemIndex];
    if (!buffered || !buffered.name) return;

    await editItem(data.value, itemIndex, buffered.name, buffered.amount);

    toggleEditItemMode();
}

// togglers

function toggleRemoveStruckPopup() {
    showRemoveStruckPopup.value = !showRemoveStruckPopup.value;
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

// toggle handlers 😭

function handleToggleStrikethrough(itemId: number) {
    if (!data.value) return;
    const target = data.value.list.find((i) => i.id === itemId);
    if (target) target.strikethrough = !target.strikethrough;
}
</script>

<template>
    <div v-if="!loading" class="list-view">
        <div v-if="!data" class="card not-found">
            <h1>404</h1>
            <h2>No grocery list found with code: {{ code }}</h2>
        </div>
        <div v-else class="card list-card torn-edge">
            <header class="list-header">
                <p class="eyebrow">Grocery List</p>
                <h1 class="list-title">{{ data.name }}</h1>
            </header>

            <!-- List Controls -->
            <div class="toolbar">
                <button
                    class="icon-btn"
                    :class="{ 'icon-btn--active': addItemMode }"
                    :title="addItemMode ? 'Cancel adding' : 'Add item'"
                    @click="toggleAddItemMode"
                >
                    <Icon :name="addItemMode ? 'x' : 'plus'" />
                </button>
                <button
                    class="icon-btn icon-btn--danger"
                    :class="{ 'icon-btn--active': removeItemMode }"
                    :title="removeItemMode ? 'Cancel removing' : 'Remove items'"
                    @click="toggleRemoveItemMode"
                >
                    <Icon :name="removeItemMode ? 'x' : 'trash'" />
                </button>
                <button
                    class="icon-btn"
                    :class="{ 'icon-btn--active': editItemMode }"
                    :title="editItemMode ? 'Cancel editing' : 'Edit items'"
                    @click="toggleEditItemMode"
                >
                    <Icon :name="editItemMode ? 'x' : 'pencil'" />
                </button>
                <button
                    v-if="struckItemCount > 0"
                    class="icon-btn icon-btn--danger struck-btn"
                    :title="`Remove ${struckItemCount} struck-through item${struckItemCount === 1 ? '' : 's'}`"
                    @click="toggleRemoveStruckPopup"
                >
                    <Icon name="trash" />
                    <span class="icon-btn__badge">{{ struckItemCount }}</span>
                </button>
            </div>

            <!-- Add mode -->
            <div v-if="addItemMode" class="add-form">
                <input v-model="addItemName" class="input" placeholder="Item name" @keyup.enter="handleAddItem" />
                <input
                    ref="amountInput"
                    v-model="addItemAmount"
                    class="input input--amount"
                    placeholder="Qty"
                    type="number"
                    min="1"
                    @keyup.enter="handleAddItem"
                />
                <button class="icon-btn icon-btn--confirm" title="Add item" :disabled="addItemName === ''" @click="handleAddItem">
                    <Icon name="check" />
                </button>
            </div>

            <!-- List Items -->
            <p v-if="data.list.length === 0" class="empty-state">The list is empty. Add something fresh.</p>
            <ul v-else class="item-list">
                <li v-for="(item, index) in data.list" :key="item.id" class="item-row">
                    <template v-if="editItemMode && editBuffer[index]">
                        <input
                            v-model="editBuffer[index].name"
                            class="input"
                            placeholder="Item name"
                            @keyup.enter="handleEditItem(index)"
                        />
                        <input
                            v-model="editBuffer[index].amount"
                            class="input input--amount"
                            type="number"
                            min="1"
                            @keyup.enter="handleEditItem(index)"
                        />
                        <button class="icon-btn icon-btn--confirm" title="Save changes" @click="handleEditItem(index)">
                            <Icon name="check" />
                        </button>
                    </template>
                    <template v-else>
                        <ListItem :item="item" @toggle-strikethrough="handleToggleStrikethrough" />
                        <button
                            v-if="removeItemMode"
                            class="icon-btn icon-btn--danger"
                            title="Delete item"
                            @click="handleRemoveItem(item.id)"
                        >
                            <Icon name="trash" />
                        </button>
                    </template>
                </li>
            </ul>

            <!-- Remove Struck-through Items Popup -->
            <AreYouSure
                :visible="showRemoveStruckPopup"
                :message="`Are you sure you want to remove ${struckItemCount} struck-through item${struckItemCount === 1 ? '' : 's'}?`"
                @confirm="handleRemoveStruckItems"
                @cancel="toggleRemoveStruckPopup"
            />
        </div>
    </div>
</template>

<style scoped>
.list-view {
    width: 100%;
    display: flex;
    justify-content: center;
}

.not-found {
    text-align: center;
}

.not-found h1 {
    color: var(--stamp);
    font-size: 2.5rem;
}

.not-found h2 {
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 0.92rem;
    color: var(--ink-soft);
}

.list-header {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px dashed var(--line);
}

.list-title {
    font-size: 1.6rem;
    margin-top: 0.1rem;
}

.toolbar {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.struck-btn {
    margin-left: auto;
}

.add-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.add-form .input:first-child {
    flex: 1;
    min-width: 0;
}

.input--amount {
    width: 4.5rem;
    flex-shrink: 0;
}

.empty-state {
    color: var(--ink-soft);
    font-size: 0.85rem;
    text-align: center;
    padding: 1.25rem 0;
    margin: 0;
}

.item-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.item-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0;
    border-bottom: 1px dashed var(--line);
}

.item-row:last-child {
    border-bottom: none;
}

.item-row .input {
    flex: 1;
    min-width: 0;
}
</style>