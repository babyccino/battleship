export type CellState = { state: "empty" | "miss" } | { state: "hit" | "ship"; ship: Ship };

export interface Position {
  row: number;
  col: number;
}

export interface Ship {
  id: string;
  size: number;
  hits: number;
}

export type GameBoardGrid = CellState[][];
