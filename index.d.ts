import Prando from 'prando';
export { default } from './lib';

interface ICell<CellType = any> {
  type: CellType | null;
  x: number;
  y: number;

  [x: string]: any;
}

interface INCellDef<CellType = any> {
  type: CellType | null;
  num?: number;
  power?: number;
  powerDecay?: number;
  maxRadius?: number;
}

interface IWCellDef<CellType = any> {
  type: CellType | null;
  weight?: number;
  maxRadius?: number;
}

interface IPoint<Def extends { type: any } = IWCellDef> {
  def: Def;
  x: number;
  y: number;
}

declare enum Status {
  Init = 'Initial generation complete.',
  Additional = 'Finished secondary pass.',
  Expand = 'Finished 2N+1 expansion of grid.',
}

interface IDef<T> {
  cellType?: T | T[];
  defs?: Array<INCellDef<T>>;
  def?: Array<IPoint<INCellDef<T>>>;
}

declare module '@zimmed/vorgen' {

  export default class Vorgen {
  public static Status: typeof Status;

  public static randomizedEdgePoints(
    width: number,
    height: number,
    opts?: {
      seed?: string;
      prando?: Prando;
      autoIncludeCorners?: boolean;
      numberPerSide?: number | [number, number];
      top?: boolean;
      left?: boolean;
      bottom?: boolean;
      right?: boolean;
      maxDistanceFromEdge?: number;
    }
  ): Array<{ x: number; y: number }>;

  public static createGrid<T = string, C extends ICell<T> = ICell<T>>(
    width: number,
    height: number,
    terrainDef: Array<IWCellDef<T>>,
    opts?: {
      seed?: string;
      prando?: Prando;
      split?: number;
      numPoints?: number;
      preExpandDefs?: Array<IDef<T>>;
      postExpandDefs?: Array<IDef<T>>;
      expandCount?: number;
      onUpdate?: (status: string, grid: C[][]) => void;
      typeForEdgeExpansion?: T;
      normalizePower?: number;
      heuristic?: 'manhattan' | 'euclid';
    }
  ): Promise<C[][]>;
}
}
