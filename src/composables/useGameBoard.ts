import { ref } from "vue";
import { GRID_SIZE } from "@/utils/constants";

import type { Position, Ship, GameBoardGrid } from "@/types/game";

export function useGameBoard() {
  const grid = ref<GameBoardGrid>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill({ state: "empty" })),
  );
  const ships = ref<Ship[]>([]);

  function isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
  }

  function canPlaceShip(row: number, col: number, size: number, isHorizontal: boolean): boolean {
    if (isHorizontal) {
      if (col + size > GRID_SIZE) return false;
    } else {
      if (row + size > GRID_SIZE) return false;
    }

    const rMin = row - 1;
    const rMax = isHorizontal ? row + 2 : row + size + 1;
    const cMin = col - 1;
    const cMax = isHorizontal ? col + size + 1 : col + 2;

    for (let r = rMin; r < rMax; r++) {
      for (let c = cMin; c < cMax; c++) {
        if (grid.value[r]?.[c]?.state === "ship") return false;
      }
    }

    return true;
  }

  function addShip(shipId: string, size: number, row: number, col: number, isHorizontal: boolean) {
    const positions: Position[] = [];
    const ship: Ship = { id: shipId, size, positions, hits: 0 };

    if (isHorizontal) {
      for (let c = col; c < col + size; c++) {
        grid.value[row]![c] = { state: "ship", ship };
        positions.push({ row, col: c });
      }
    } else {
      for (let r = row; r < row + size; r++) {
        grid.value[r]![col] = { state: "ship", ship };
        positions.push({ row: r, col });
      }
    }

    ships.value.push(ship);
  }

  function placeShip(shipId: string, size: number): boolean {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const isHorizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceShip(row, col, size, isHorizontal)) {
        addShip(shipId, size, row, col, isHorizontal);
        return true;
      }

      attempts++;
    }

    return false;
  }

  function recordShot(row: number, col: number): boolean {
    if (!isValidPosition(row, col)) {
      return false;
    }

    const cell = grid.value[row]?.[col];
    if (!cell) return false;

    if (cell.state === "ship") {
      cell.state = "hit";
      cell.ship.hits++;
      return true;
    } else if (cell.state === "empty") {
      grid.value[row]![col] = { state: "miss" };
    }

    return false;
  }

  function hasBeenShot(row: number, col: number): boolean {
    return grid.value[row]?.[col]?.state === "hit" || grid.value[row]?.[col]?.state === "miss";
  }

  function isShipSunk(shipId: string): boolean {
    const ship = ships.value.find((ship) => ship.id === shipId);
    return ship ? ship.hits === ship.size : false;
  }

  function getSunkShipCount(): number {
    let count = 0;
    for (const ship of ships.value) {
      if (ship.hits === ship.size) {
        count++;
      }
    }
    return count;
  }

  function allShipsSunk(): boolean {
    if (ships.value.length === 0) return false;
    return getSunkShipCount() === ships.value.length;
  }

  function reset() {
    grid.value = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill({ state: "empty" }));
    ships.value = [];
  }

  return {
    grid,
    placeShip,
    recordShot,
    hasBeenShot,
    ships,
    isShipSunk,
    getSunkShipCount,
    allShipsSunk,
    reset,
    isValidPosition,
  };
}
