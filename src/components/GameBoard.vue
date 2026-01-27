<template>
  <div class="p-5 bg-gray-100 rounded-lg mx-auto shadow-md">
    <h3 class="m-0 mb-4 text-center text-gray-800 text-lg">{{ boardTitle }}</h3>
    <div class="inline-block border-2 border-gray-800 bg-white shadow-md">
      <div class="flex">
        <div
          class="w-10 h-10 flex items-center justify-center font-bold bg-gray-300 border border-gray-600"
        />
        <div
          v-for="col in gridSize"
          :key="`header-${col}`"
          class="w-10 h-10 flex items-center justify-center font-bold bg-gray-300 border border-gray-600 text-sm"
        >
          {{ String.fromCharCode(64 + col) }}
        </div>
      </div>

      <div v-for="(row, rowIdx) in grid" :key="`row-${rowIdx}`" class="flex">
        <div
          class="w-10 h-10 flex items-center justify-center font-bold bg-gray-300 border border-gray-600 text-sm"
        >
          {{ rowIdx + 1 }}
        </div>

        <button
          v-for="(cell, colIdx) in row"
          :key="`cell-${rowIdx}-${colIdx}`"
          class="w-10 h-10 border border-gray-400 p-0 flex items-center justify-center cursor-pointer text-xl bg-blue-100 hover:bg-blue-300 hover:scale-110 active:bg-blue-400 transition-all duration-200"
          :data-state="showShips ? cell.state : cell.state === 'ship' ? 'empty' : cell.state"
          :class="getCellClass(cell)"
          :disabled="cell.state === 'miss' || cell.state === 'hit' || undefined"
          @click="handleCellClick(rowIdx, colIdx)"
        >
          {{ getCellSymbol(cell) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GameBoardGrid, CellState } from "@/types/game";

interface Props {
  grid: GameBoardGrid;
  showShips?: boolean;
  boardTitle: string;
}

const props = withDefaults(defineProps<Props>(), {
  showShips: false,
});

const emit = defineEmits<{
  cellClick: [row: number, col: number];
}>();

const gridSize = computed(() => props.grid.length);

function getCellClass(cell: CellState): string {
  if (cell.state === "hit") return "bg-red-500 text-white font-bold";
  if (cell.state === "miss") return "bg-gray-400 text-gray-600";
  if (cell.state === "ship" && props.showShips) return "bg-blue-300 border border-blue-700";
  return "bg-blue-100";
}

function getCellSymbol(cell: CellState): string {
  if (cell.state === "hit") return "💥";
  if (cell.state === "miss") return "·";
  if (cell.state === "ship" && props.showShips) return "🚢";
  return "";
}

function handleCellClick(row: number, col: number) {
  console.log("Cell click", { row, col });
  emit("cellClick", row, col);
}
</script>
