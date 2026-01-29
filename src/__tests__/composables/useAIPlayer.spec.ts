import { describe, it, expect, beforeEach } from "vitest";
import { useAIPlayer } from "../../composables/useAIPlayer";

describe("useAIPlayer", () => {
  let ai: ReturnType<typeof useAIPlayer>;
  const shotHistory = new Set<string>();

  const hasBeenShotCallback = (row: number, col: number): boolean => {
    return shotHistory.has(`${row},${col}`);
  };

  beforeEach(() => {
    ai = useAIPlayer(hasBeenShotCallback);
    shotHistory.clear();
  });

  describe("initialization", () => {
    it("initializes with available targets", () => {
      const shot = ai.getNextShot();
      expect(shot).not.toBeNull();
    });
  });

  describe("shot generation", () => {
    it("returns valid shot coordinates", () => {
      const shot = ai.getNextShot();
      expect(shot).not.toBeNull();
      if (shot) {
        expect(shot.row).toBeGreaterThanOrEqual(0);
        expect(shot.row).toBeLessThan(10);
        expect(shot.col).toBeGreaterThanOrEqual(0);
        expect(shot.col).toBeLessThan(10);
      }
    });

    it("generates unique shots within a session", () => {
      const shots: string[] = [];

      for (let i = 0; i < 20; i++) {
        const shot = ai.getNextShot();
        if (shot) {
          shots.push(`${shot.row},${shot.col}`);
          shotHistory.add(`${shot.row},${shot.col}`);
        }
      }

      // Check that all shots are unique
      const uniqueShots = new Set(shots);
      expect(uniqueShots.size).toBe(shots.length);
      expect(shots.length).toBe(20);
    });
  });

  describe("hit response", () => {
    it("adds adjacent targets when a hit is recorded", () => {
      const firstShot = ai.getNextShot();
      expect(firstShot).not.toBeNull();

      if (firstShot) {
        shotHistory.add(`${firstShot.row},${firstShot.col}`);
        ai.recordShotResult(firstShot, true);

        const nextShot = ai.getNextShot();
        expect(nextShot).not.toBeNull();

        if (nextShot) {
          const isAdjacent =
            (Math.abs(nextShot.row - firstShot.row) === 1 && nextShot.col === firstShot.col) ||
            (nextShot.row === firstShot.row && Math.abs(nextShot.col - firstShot.col) === 1);

          expect(isAdjacent).toBe(true);
        }
      }
    });

    it("continues random hunt after miss", () => {
      const firstShot = ai.getNextShot();
      expect(firstShot).not.toBeNull();

      if (firstShot) {
        shotHistory.add(`${firstShot.row},${firstShot.col}`);
        ai.recordShotResult(firstShot, false);

        const nextShot = ai.getNextShot();
        expect(nextShot).not.toBeNull();
      }
    });
  });

  describe("reset", () => {
    it("clears the shot history", () => {
      ai.getNextShot();
      ai.reset();

      const shot = ai.getNextShot();
      expect(shot).not.toBeNull();
    });
  });
});
