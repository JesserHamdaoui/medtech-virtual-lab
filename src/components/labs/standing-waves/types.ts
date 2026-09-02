export enum EndType {
  FIXED_END = "FIXED_END",
  LOOSE_END = "LOOSE_END",
  NO_END = "NO_END",
}

export enum TimeSpeed {
  NORMAL = "NORMAL",
  SLOW = "SLOW",
}

export interface ReferenceLine {
  x?: number;
  y?: number;
  isDragging?: boolean;
  id?: string;
}
