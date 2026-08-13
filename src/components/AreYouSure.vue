<script setup lang="ts">
import Icon from "@/components/Icon.vue";

const props = defineProps<{
  visible: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<template>
  <div v-if="visible" class="overlay">
    <div class="popup card">
      <p class="popup-message">{{ message }}</p>
      <div class="popup-buttons">
        <button class="icon-btn icon-btn--danger" title="Yes, remove" @click="confirm">
          <Icon name="check" />
        </button>
        <button class="icon-btn" title="No, cancel" @click="cancel">
          <Icon name="x" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  max-width: 20rem;
  text-align: center;
}

.popup-message {
  margin: 0 0 1.1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.popup-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}
</style>