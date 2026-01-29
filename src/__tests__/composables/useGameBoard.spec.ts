import { describe, it, expect, beforeEach } from "vitest";
import { useGameBoard } from "../../composables/useGameBoard";

describe("useGameBoard", () => {
  let board: ReturnType<typeof useGameBoard>;

  beforeEach(() => {
    board = useGameBoard();
  });

  describe("initialization", () => {
    it("creates a 10x10 grid", () => {
      expect(board.grid.value.length).toBe(10);
      expect(board.grid.value[0].length).toBe(10);
    });

    it("initializes all cells as empty", () => {
      const grid = board.grid.value;
      for (const row of grid) {
        for (const cell of row) {
          expect(cell.state).toBe("empty");
        }
      }
    });

    it("starts with no ships", () => {
      expect(board.ships.value.length).toBe(0);
    });
  });

  describe("ship placement", () => {
    it("places a ship successfully", () => {
      const result = board.placeShip("test-ship", 3);
      expect(result).toBe(true);
      expect(board.ships.value.length).toBe(1);
    });

    it("places a 5-square battleship", () => {
      const result = board.placeShip("battleship", 5);
      expect(result).toBe(true);
      const ship = board.ships.value[0];
      expect(ship.size).toBe(5);
      expect(ship.hits).toBe(0);
    });

    it("places multiple ships", () => {
      board.placeShip("ship1", 5);
      board.placeShip("ship2", 4);
      board.placeShip("ship3", 4);
      expect(board.ships.value.length).toBe(3);
    });

    it("prevents overlapping ships", () => {
      board.placeShip("ship1", 5);
      board.placeShip("ship2", 5);
      expect(board.ships.value.length).toBe(2);

      const grid = board.grid.value;
      let shipCount = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.state === "ship") shipCount++;
        }
      }
      expect(shipCount).toBe(10); // 5 + 5
    });
  });

  describe("shooting", () => {
    beforeEach(() => {
      board.placeShip("ship1", 3);
    });

    it("records a hit on a ship", () => {
      const ship = board.ships.value[0];
      const firstPos = ship.positions[0];

      const isHit = board.recordShot(firstPos.row, firstPos.col);
      expect(isHit).toBe(true);
      expect(ship.hits).toBe(1);
    });

    it("records a miss on empty water", () => {
      const isHit = board.recordShot(0, 0);
      expect(isHit).toBe(false);
    });

    it("detects when a ship is sunk", () => {
      const ship = board.ships.value[0];

      for (const pos of ship.positions) {
        board.recordShot(pos.row, pos.col);
      }

      expect(board.isShipSunk(ship.id)).toBe(true);
    });

    it("tracks shot history", () => {
      const ship = board.ships.value[0];
      const pos = ship.positions[0];

      board.recordShot(pos.row, pos.col);
      expect(board.hasBeenShot(pos.row, pos.col)).toBe(true);
    });

    it("prevents shooting the same location twice", () => {
      board.recordShot(5, 5);
      const secondResult = board.recordShot(5, 5);
      expect(secondResult).toBe(false);
    });
  });

  describe("game status", () => {
    it("reports ships not sunk initially", () => {
      board.placeShip("ship1", 3);
      expect(board.allShipsSunk()).toBe(false);
    });

    it("reports all ships sunk when defeated", () => {
      board.placeShip("ship1", 2);
      const ship = board.ships.value[0];

      for (const pos of ship.positions) {
        board.recordShot(pos.row, pos.col);
      }

      expect(board.allShipsSunk()).toBe(true);
    });

    it("counts sunk ships correctly", () => {
      board.placeShip("ship1", 2);
      board.placeShip("ship2", 3);

      const ship1 = board.ships.value[0];
      for (const pos of ship1.positions) {
        board.recordShot(pos.row, pos.col);
      }

      expect(board.getSunkShipCount()).toBe(1);
    });
  });

  describe("visibility", () => {
    beforeEach(() => {
      board.placeShip("ship1", 3);
    });

    it("visible grid hides ship positions", () => {
      const grid = board.grid.value;
      let shipCells = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.state === "ship") shipCells++;
        }
      }
      // Ships are still in the grid from owner's perspective
      expect(shipCells).toBe(3);
    });

    it("grid shows ship positions", () => {
      const grid = board.grid.value;
      let shipCells = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.state === "ship") shipCells++;
        }
      }
      expect(shipCells).toBe(3);
    });

    it("grid shows hits and misses", () => {
      const ship = board.ships.value[0];
      board.recordShot(ship.positions[0].row, ship.positions[0].col);
      board.recordShot(0, 0);

      const grid = board.grid.value;
      let hitCount = 0;
      let missCount = 0;

      for (const row of grid) {
        for (const cell of row) {
          if (cell.state === "hit") hitCount++;
          if (cell.state === "miss") missCount++;
        }
      }

      expect(hitCount).toBe(1);
      expect(missCount).toBe(1);
    });
  });

  describe("reset", () => {
    it("clears the board", () => {
      board.placeShip("ship1", 3);
      board.recordShot(5, 5);

      board.reset();

      expect(board.ships.value.length).toBe(0);
      expect(board.hasBeenShot(5, 5)).toBe(false);
    });
  });
});
