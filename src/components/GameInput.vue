<template>
  <div class="p-5 bg-white rounded-lg mx-auto shadow-md my-5 max-w-md">
    <div class="mb-4">
      <label for="coordinate-input" class="block mb-2 font-semibold text-gray-800">
        Target coordinate:
      </label>

      <div class="flex gap-2">
        <input
          id="coordinate-input"
          v-model="input"
          type="text"
          placeholder="ex: A5"
          maxlength="3"
          class="flex-1 px-3 py-2 border-2 border-gray-300 rounded text-base uppercase transition-colors focus:outline-none focus:border-blue-500"
          :disabled
          @keypress="handleKeypress"
        />
        <button
          class="px-5 py-2 bg-blue-600 text-white border-none rounded font-semibold cursor-pointer transition-colors hover:bg-blue-900 active:bg-blue-800"
          :disabled
          @click="handleSubmit"
        >
          Fire!
        </button>
      </div>
    </div>
    <p v-if="errorMessage" class="text-red-600 text-sm m-0 mb-2">{{ errorMessage }}</p>
    <p class="text-gray-600 text-xs m-0 italic">Columns: A-J | Rows: 1-10</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { parseCoordinate, isValidCoordinate } from "../utils/coordinateParser";

defineProps<{
  disabled: boolean;
}>();

interface Emits {
  shoot: [row: number, col: number];
}

const emit = defineEmits<Emits>();

const input = ref("");
const errorMessage = ref("");

function handleSubmit() {
  errorMessage.value = "";
  const trimmedInput = input.value.trim();

  if (!trimmedInput) {
    errorMessage.value = "Please enter a coordinate (e.g., A5)";
    return;
  }

  if (!isValidCoordinate(trimmedInput)) {
    errorMessage.value = "Invalid coordinate. Use format: A1-J10";
    return;
  }

  const coord = parseCoordinate(trimmedInput);
  if (coord) {
    emit("shoot", coord.row, coord.col);
    input.value = "";
  }
}

function handleKeypress(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleSubmit();
  }
}
</script>
