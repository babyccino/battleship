import { computed, shallowRef, readonly } from "vue";
import { useGameBoard } from "@/composables/useGameBoard";
import { useAIPlayer } from "@/composables/useAIPlayer";

const STARTING_MESSAGE = "Game started! Shoot your shot!";
export const COMPUTER_WAIT_MS = 500;

export enum GameState {
  PLAYER_TURN,
  COMPUTER_TURN,
  PLAYER_WON,
  COMPUTER_WON,
}

export function useGame() {
  const playerBoard = useGameBoard();
  const computerBoard = useGameBoard();
  const aiPlayer = useAIPlayer((row, col) => computerBoard.hasBeenShot(row, col));

  const lastMessage = shallowRef(STARTING_MESSAGE);
  const gameState = shallowRef(GameState.PLAYER_TURN);

  function setupPlayerShips() {
    playerBoard.placeShip("player-battleship", 5);
    playerBoard.placeShip("player-destroyer-1", 4);
    playerBoard.placeShip("player-destroyer-2", 4);
  }

  function setupComputerShips() {
    computerBoard.placeShip("computer-battleship", 5);
    computerBoard.placeShip("computer-destroyer-1", 4);
    computerBoard.placeShip("computer-destroyer-2", 4);
  }

  function reset() {
    playerBoard.reset();
    computerBoard.reset();
    aiPlayer.reset();
    gameState.value = GameState.PLAYER_TURN;
    lastMessage.value = STARTING_MESSAGE;
    setupPlayerShips();
    setupComputerShips();
  }

  function checkForSunkShips(board: ReturnType<typeof useGameBoard>, owner: string) {
    if (lastMessage.value.includes("Sunk")) return;

    const ships = board.ships.value;

    for (const ship of ships) {
      if (ship.hits === ship.size && ship.hits > 0) {
        const shipType = ship.size === 5 ? "Battleship" : "Destroyer";
        lastMessage.value += ` ${owner} ${shipType} sunk!`;
      }
    }
  }

  function computerShoot() {
    const shot = aiPlayer.getNextShot();
    if (!shot) return;

    const isHit = playerBoard.recordShot(shot.row, shot.col);
    aiPlayer.recordShotResult(shot, isHit);

    if (isHit) {
      lastMessage.value += " Computer hit!";
    } else {
      lastMessage.value += " Computer missed!";
    }

    checkForSunkShips(playerBoard, "Your");

    if (playerBoard.allShipsSunk()) {
      gameState.value = GameState.COMPUTER_WON;
      lastMessage.value += " 💥 Game Over! Computer sunk all your ships!";
    }

    gameState.value = GameState.PLAYER_TURN;
  }

  function playerShoot(row: number, col: number): boolean {
    console.log("Player shoot");
    if (gameState.value !== GameState.PLAYER_TURN) throw new Error("Not player's turn");

    console.log({ row, col });
    if (computerBoard.hasBeenShot(row, col)) {
      console.log("Already shot");
      lastMessage.value = "You already shot at this location!";
      return false;
    }

    const isHit = computerBoard.recordShot(row, col);
    lastMessage.value = isHit ? "Hit!" : "Miss!";

    checkForSunkShips(computerBoard, "Computer");

    if (computerBoard.allShipsSunk()) {
      gameState.value = GameState.PLAYER_WON;
      lastMessage.value = "🎉 You won! All enemy ships are sunk!";
      return true;
    }

    setTimeout(() => {
      computerShoot();
    }, COMPUTER_WAIT_MS);

    gameState.value = GameState.COMPUTER_TURN;

    return true;
  }

  const playerWon = computed(() => gameState.value === GameState.PLAYER_WON);
  const gameOver = computed(
    () => gameState.value === GameState.PLAYER_WON || gameState.value === GameState.COMPUTER_WON,
  );

  const computerBoardView = computed(() => computerBoard.grid.value);
  const playerBoardView = computed(() => playerBoard.grid.value);

  const playerShips = computed(() =>
    playerBoard.ships.value.map((ship) => ({
      ...ship,
      sunk: ship.hits === ship.size,
    })),
  );

  const computerShips = computed(() =>
    computerBoard.ships.value.map((ship) => ({
      ...ship,
      sunk: ship.hits === ship.size,
    })),
  );

  setupPlayerShips();
  setupComputerShips();

  return {
    playerShoot,
    computerBoardView,
    playerBoardView,
    computerShips,
    playerShips,
    lastMessage,
    reset,
    gameState: readonly(gameState),
    playerWon,
    gameOver,
  };
}
