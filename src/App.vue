<template>
  <div class="min-h-screen mx-auto p-5 bg-black font-sans">
    <header class="text-center text-white mb-8">
      <h1 class="text-5xl m-0 drop-shadow-md">⚓ Battleship</h1>
      <p class="text-lg mt-3 opacity-90">Sink the enemy fleet!</p>
    </header>

    <div
      class="bg-white p-4 rounded-lg text-center mx-auto mb-5 max-w-xl text-base font-semibold text-gray-800 shadow-md duration-300 h-20"
      :class="{ 'bg-green-200 text-green-800': lastMessage.includes('Hit') }"
    >
      {{ lastMessage }}
    </div>

    <div class="grid grid-cols-2 gap-8 my-8 max-w-5xl mx-auto">
      <div class="flex flex-col">
        <GameBoard :grid="playerBoardView" board-title="Your Fleet" :show-ships="true" />
      </div>

      <div class="flex flex-col">
        <GameBoard
          board-title="Enemy Fleet"
          :grid="computerBoardView"
          :show-ships="false"
          @cell-click="handlePlayerShoot"
        />
      </div>
    </div>

    <GameInput :disabled="!gameOver" @shoot="handlePlayerShoot" />

    <div
      v-if="gameOver"
      class="bg-white p-8 rounded-lg text-center mx-auto my-5 max-w-xl shadow-lg"
    >
      <h2 class="text-4xl m-0 mb-2 text-gray-800">
        {{ playerWon ? "🎉 Victory!" : "💥 Defeat!" }}
      </h2>
      <p class="text-lg text-gray-600 mb-5">
        {{ playerWon ? "You defeated the computer!" : "The computer defeated you!" }}
      </p>
      <button
        @click="reset"
        class="px-8 py-3 bg-indigo-500 text-white border-none rounded font-semibold cursor-pointer transition-colors hover:bg-purple-600"
      >
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame, GameState } from "./composables/useGame";
import GameBoard from "./components/GameBoard.vue";
import GameInput from "./components/GameInput.vue";

const {
  playerBoardView,
  computerBoardView,
  playerWon,
  reset,
  gameOver,
  lastMessage,
  playerShoot,
  gameState,
} = useGame();

function handlePlayerShoot(row: number, col: number) {
  if (gameState.value === GameState.PLAYER_TURN) {
    playerShoot(row, col);
  }
}
</script>
