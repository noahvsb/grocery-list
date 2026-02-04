<script setup lang="ts">
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
    <div class="popup">
      <p>{{ message }}</p>
      <div class="buttons">
        <button @click="confirm">Yes</button>
        <button @click="cancel">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}

.buttons button {
  margin: 0 0.5rem;
}
</style>
