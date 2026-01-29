export interface Coordinate {
  row: number;
  col: number;
}

export function parseCoordinate(input: string): Coordinate | null {
  const input_upper = input.toUpperCase().trim();

  const match = input_upper.match(/^([A-J])(\d{1,2})$/);
  if (!match) return null;

  const col = input_upper.charCodeAt(0) - "A".charCodeAt(0);
  const row = parseInt(match[2]!, 10) - 1;

  if (row < 0 || row > 9 || col < 0 || col > 9) return null;

  return { row, col };
}

export function formatCoordinate(row: number, col: number): string {
  const colLetter = String.fromCharCode("A".charCodeAt(0) + col);
  return `${colLetter}${row + 1}`;
}

export function isValidCoordinate(input: string): boolean {
  return parseCoordinate(input) !== null;
}
