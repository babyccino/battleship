import { GRID_SIZE } from "@/utils/constants";

import type { Position } from "@/types/game";
import { useGameBoard } from "@/composables/useGameBoard";

function getAdjacents(position: Position) {
  return [
    { row: position.row - 1, col: position.col },
    { row: position.row + 1, col: position.col },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 },
  ];
}

export function useComputerBoard() {
  const gameBoard = useGameBoard();

  const availableTargets: Set<string> = new Set();
  let targetQueue: Position[] = [];

  function reset() {
    gameBoard.reset();

    availableTargets.clear();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        availableTargets.add(`${row},${col}`);
      }
    }
    targetQueue = [];
  }

  function getNextShot(): Position | null {
    if (targetQueue.length > 0) {
      const target = targetQueue.shift();
      if (target && !gameBoard.hasBeenShot(target.row, target.col)) {
        return target;
      }
    }

    if (availableTargets.size === 0) return null;

    const targets = Array.from(availableTargets);
    const randomIndex = Math.floor(Math.random() * targets.length);
    const target = targets[randomIndex]!;
    const parts = target.split(",");
    const row = parseInt(parts[0]!, 10);
    const col = parseInt(parts[1]!, 10);

    availableTargets.delete(target);

    return { row, col };
  }

  function recordShotResult(position: Position, isHit: boolean) {
    availableTargets.delete(`${position.row},${position.col}`);

    if (!isHit) return;

    const adjacents = getAdjacents(position);

    for (const adj of adjacents) {
      if (
        adj.row >= 0 &&
        adj.row < GRID_SIZE &&
        adj.col >= 0 &&
        adj.col < GRID_SIZE &&
        !gameBoard.hasBeenShot(adj.row, adj.col)
      ) {
        targetQueue.unshift(adj);
      }
    }
  }

  return {
    getNextShot,
    recordShotResult,
    reset,

    placeShip: gameBoard.placeShip,
    hasBeenShot: gameBoard.hasBeenShot,
    recordShot: gameBoard.recordShot,
    ships: gameBoard.ships,
    grid: gameBoard.grid,
    allShipsSunk: gameBoard.allShipsSunk,
  };
}
