import Prando from 'prando';

export interface INCellDef<CellType = any> {
  type: CellType | null;
  num?: number;
  power?: number;
  powerDecay?: number;
  maxRadius?: number;
}
export interface IWCellDef<CellType = any> {
  type: CellType | null;
  weight?: number;
  maxRadius?: number;
}
export interface IPoint<Def extends { type: any } = IWCellDef> {
  def: Def;
  x: number;
  y: number;
}
export interface ICell<CellType = any> {
  type: CellType | null;
  x: number;
  y: number;

  [x: string]: any;
}

type Async<F extends (...args: any) => any> = F extends (
  ...args: infer Args
) => infer Ret
  ? (...args: Args) => Promise<Ret>
  : never;

const sortWByH = (h: (p: { x: number; y: number }) => number) => (
  { def: { weight: aW = 0, maxRadius: aM = 0 }, ...a }: IPoint<IWCellDef>,
  { def: { weight: bW = 0, maxRadius: bM = 0 }, ...b }: IPoint<IWCellDef>
) => {
  const dx = h(a);
  const dy = h(b);
  const x = aM && dx > aM - 1 ? Infinity : dx;
  const y = bM && dy > bM - 1 ? Infinity : dy;

  return x > y ? 1 : x < y ? -1 : aW < bW ? 1 : aW > bW ? -1 : 0;
};

const sortNByH = (h: (p: { x: number; y: number }) => number) => (
  {
    def: { maxRadius: aM = 0, powerDecay: aPD = 0, power: aP = 1 },
    ...a
  }: IPoint<INCellDef>,
  {
    def: { maxRadius: bM = 0, powerDecay: bPD = 0, power: bP = 1 },
    ...b
  }: IPoint<INCellDef>
) => {
  const dx = h(a);
  const dy = h(b);
  const pdx = dx * (1 / aP + aPD * dx);
  const pdy = dy * (1 / bP + bPD * dy);
  const x = aM && pdx > aM - 1 ? Infinity : pdx;
  const y = bM && pdy > bM - 1 ? Infinity : pdy;

  return x > y ? 1 : x < y ? -1 : 0;
};

const heuristics = {
  manhattan: (i: number, j: number) => ({ x, y }: { x: number; y: number }) =>
    Math.abs(x - j) + Math.abs(y - i),
  euclid: (i: number, j: number) => ({ x, y }: { x: number; y: number }) =>
    Math.sqrt(Math.pow(x - j, 2) + Math.pow(y - i, 2)),
};

export default class Voronoi {
  public static heuristics = heuristics;

  public static createCell<T = string>(
    x: number,
    y: number,
    type: T | null = null
  ): ICell<T> {
    return { x, y, type };
  }

  public static generateTypedGridAsync: Async<
    typeof Voronoi.generateTypedGrid
  > = async (...args) => Voronoi.generateTypedGrid(...args);

  public static applyWeightedDefAsync: Async<
    typeof Voronoi.applyWeightedDef
  > = async (...args) => Voronoi.applyWeightedDef(...args);

  public static applyNumberedDefAsync: Async<
    typeof Voronoi.applyNumberedDef
  > = async (...args) => Voronoi.applyNumberedDef(...args);

  public static expandGridAsync: Async<typeof Voronoi.expandGrid> = async (
    ...args
  ) => Voronoi.expandGrid(...args);

  public static applyManualPlotAsync: Async<
    typeof Voronoi.applyManualPlot
  > = async (...args) => Voronoi.applyManualPlot(...args);

  public static expandGrid<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    {
      prando,
      seed,
      edgeType = null,
    }: { prando?: Prando; seed?: string; edgeType?: T | null }
  ): C[][] {
    const rand = prando || new Prando(seed);
    let nextGrid = grid.reduce(
      (rows, row) => [
        ...rows,
        this.expandRow(row, rows.length),
        this.expandRow(row, rows.length + 1, true),
      ],
      [this.expandRow(grid[0], 0, true)] as C[][]
    );

    nextGrid = nextGrid.map((row, y) =>
      y % 2 === 1
        ? row.map((cell) =>
            cell.type === null
              ? {
                  ...cell,
                  type: this.determineTypeFromNeighbors(
                    nextGrid,
                    rand,
                    cell,
                    edgeType
                  ),
                }
              : cell
          )
        : row
    );
    nextGrid = nextGrid.map((row, y) =>
      y % 2 === 0
        ? row.map((cell, x) =>
            x % 2 === 1 && cell.type === null
              ? {
                  ...cell,
                  type: this.determineTypeFromNeighbors(
                    nextGrid,
                    rand,
                    cell,
                    edgeType
                  ),
                }
              : cell
          )
        : row
    );
    return nextGrid.map((row, y) =>
      y % 2 === 0
        ? row.map((cell) =>
            cell.type === null
              ? {
                  ...cell,
                  type: this.determineTypeFromNeighbors(
                    nextGrid,
                    rand,
                    cell,
                    edgeType
                  ),
                }
              : cell
          )
        : row
    );
  }

  public static generateTypedGrid<T = string, C extends ICell<T> = ICell<T>>(
    width: number,
    height: number,
    types: Array<IWCellDef<T>>,
    opts?: {
      seed?: string;
      split?: number;
      prando?: Prando;
      heuristic?: keyof typeof heuristics;
      numPoints?: number;
    }
  ): C[][] {
    const grid = Array(height)
      .fill(0)
      .map((_, y) =>
        Array(width)
          .fill(0)
          .map((_, x) => this.createCell<T>(x, y))
      );

    return this.applyWeightedDef<T>(grid, types, opts) as C[][];
  }

  public static applyWeightedDef<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    types: Array<IWCellDef<T>>,
    {
      seed,
      split,
      numPoints,
      prando,
      heuristic = 'euclid',
    }: {
      seed?: string;
      split?: number;
      prando?: Prando;
      heuristic?: keyof typeof heuristics;
      numPoints?: number;
    } = {}
  ): C[][] {
    const distance = heuristics[heuristic];
    const rand = prando || new Prando(seed);
    const points = this.generateWeightedPoints<T>(
      grid,
      rand,
      types,
      numPoints,
      split
    );

    return grid.map((row, i) =>
      row.map((cell, j) => {
        const s = sortWByH(distance(i, j));
        const p = [...points].sort(s);

        return { ...cell, type: p[0].def.type };
      })
    );
  }

  public static applyManualPlot<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    point: IPoint<INCellDef<T>>,
    normalizePoints: Array<IPoint<INCellDef<null>>> = [],
    {
      onlyOnType,
      heuristic = 'euclid',
    }: {
      heuristic?: keyof typeof heuristics;
      onlyOnType?: T | T[];
    } = {}
  ): C[][] {
    const distance = heuristics[heuristic];
    const includes = this.hasCellType<T>(onlyOnType);
    const points: Array<IPoint<INCellDef<T | null>>> = [
      point,
      ...normalizePoints,
    ];

    return grid.map((row, i) =>
      row.map((cell, j) => {
        const { def } = [...points].sort(sortNByH(distance(i, j)))[0];

        return def.type !== null && includes(cell.type)
          ? { ...cell, type: def.type }
          : cell;
      })
    );
  }

  public static applyNumberedDef<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    types: Array<INCellDef<T>>,
    {
      seed,
      onlyOnType,
      prando,
      heuristic = 'euclid',
      normalizeSplit,
      normalizePower = 1,
      normalizeCount,
    }: {
      seed?: string;
      prando?: Prando;
      heuristic?: keyof typeof heuristics;
      onlyOnType?: T | T[];
      normalizeSplit?: number;
      normalizePower?: number;
      normalizeCount?: number;
    } = {}
  ): C[][] {
    const includes = this.hasCellType<T>(onlyOnType);
    const distance = heuristics[heuristic];
    const rand = prando || new Prando(seed);
    // Pick arbitrary normalizer points that maintain the current types
    const normalPoints =
      normalizeCount !== 0
        ? this.generateWeightedPoints<T>(
            grid,
            rand,
            [{ type: null }],
            normalizeSplit,
            normalizeCount
          ).map(({ x, y }) => ({
            x,
            y,
            def: { type: null, num: 0, power: normalizePower },
          }))
        : [];
    const points = this.generateNumberedPoints<T>(
      grid,
      rand,
      types,
      onlyOnType
    ).concat(normalPoints);

    return grid.map((row, i) =>
      row.map((cell, j) => {
        const { def } = [...points].sort(sortNByH(distance(i, j)))[0];

        return def.type !== null && includes(cell.type)
          ? { ...cell, type: def.type }
          : cell;
      })
    );
  }

  public static getType<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    x: number,
    y: number,
    defaultType: T | null = null
  ): T | null {
    const type = grid[y] && grid[y][x] && grid[y][x].type;

    return typeof type === 'undefined' ? defaultType : type;
  }

  public static generateNumberedPoints<
    T = string,
    C extends ICell<T> = ICell<T>,
    D extends INCellDef<T> = INCellDef<T>
  >(
    grid: C[][],
    rand: Prando,
    types: D[],
    onlyOnCellType?: T | T[]
  ): Array<IPoint<D>> {
    const points: Array<IPoint<D>> = [];
    const max = types.reduce((accum, { num = 1 }) => accum + num, 0);
    const includes = this.hasCellType<T>(onlyOnCellType);
    const posPool: Array<{ x: number; y: number }> = grid.reduce(
      (pool, row, y) =>
        pool.concat(
          row.reduce(
            (p, { type }, x) => (includes(type) ? p.concat({ x, y }) : p),
            [] as Array<{ x: number; y: number }>
          )
        ),
      [] as Array<{ x: number; y: number }>
    );
    const counts: { [x: string]: number } = types.reduce(
      (obj, def) => ({ ...obj, [`${def.type}`]: 0 }),
      {}
    );
    let c = 0;

    while (posPool.length && c < max) {
      for (const def of types) {
        if (counts[`${def.type}`] < (def.num || 1)) {
          counts[`${def.type}`] += 1;
          c++;
          points.push({
            ...posPool.splice(rand.nextInt(0, posPool.length - 1), 1)[0],
            def,
          });
        }

        if (!posPool.length || c >= max) {
          break;
        }
      }
    }

    return points;
  }

  public static generateWeightedPoints<
    T = string,
    C extends ICell<T> = ICell<T>,
    D extends IWCellDef<T> = IWCellDef<T>
  >(
    grid: C[][],
    rand: Prando,
    types: D[],
    split: number = 10,
    n?: number
  ): Array<IPoint<D>> {
    const height = grid.length;
    const width = grid[0].length;
    const num =
      n ||
      Math.ceil((width * height) / (split * split * types.length)) *
        types.length;
    const xs = Array(width)
      .fill(0)
      .map((_, i) => i);
    const ys = Array(height)
      .fill(0)
      .map((_, i) => i);
    const [calcedTypes, max] = types
      .sort(({ weight: a = 0 }, { weight: b = 0 }) =>
        a < b ? 1 : a > b ? -1 : 0
      )
      .reduce(
        ([accum, m]: [D[], number], def: D): [D[], number] => [
          [...accum, { ...def, weight: m + (def.weight || 1) }],
          m + (def.weight || 1),
        ],
        [[], 0] as [D[], number]
      );

    return calcedTypes
      .map((def) => ({
        def,
        x: xs.splice(rand.nextInt(0, xs.length - 1), 1)[0],
        y: ys.splice(rand.nextInt(0, ys.length - 1), 1)[0],
      }))
      .concat(
        Array(Math.max(0, num - calcedTypes.length))
          .fill(0)
          .map(() => {
            const roll = rand.next() * max;
            let i = 0;

            while (calcedTypes[i] && (calcedTypes[i].weight as number) < roll) {
              i++;
            }

            return {
              def: calcedTypes[i],
              x: xs.splice(rand.nextInt(0, xs.length - 1), 1)[0],
              y: ys.splice(rand.nextInt(0, ys.length - 1), 1)[0],
            };
          })
      ) as Array<IPoint<D>>;
  }

  private static determineTypeFromNeighbors<
    T = string,
    C extends ICell<T> = ICell<T>
  >(grid: C[][], rand: Prando, cell: C, edgeType?: T | null): T | null {
    const neighbors = this.getNeighborTypes(grid, cell, edgeType);
    const roll = rand.nextInt(0, neighbors.length - 1);

    return neighbors[roll];
  }

  private static getNeighborTypes<T = string, C extends ICell<T> = ICell<T>>(
    grid: C[][],
    cell: C,
    edgeType?: T | null
  ): T[] {
    return [
      this.getType(grid, cell.x, cell.y - 1, edgeType),
      this.getType(grid, cell.x, cell.y + 1, edgeType),
      this.getType(grid, cell.x - 1, cell.y, edgeType),
      this.getType(grid, cell.x + 1, cell.y, edgeType),
    ].filter((e) => e !== null) as T[];
  }

  private static hasCellType<T>(c?: T | T[]): (t: T | null) => boolean {
    if (typeof c === 'undefined') {
      return () => true;
    } else if (Array.isArray(c)) {
      return (t: T | null) => t !== null && c.includes(t);
    } else {
      return (t: T | null) => t === c;
    }
  }

  private static expandRow<T extends ICell = ICell>(
    row: T[],
    y: number,
    useBlank = false
  ): T[] {
    return row.reduce(
      (cells, cell) => [
        ...cells,
        {
          ...cell,
          y,
          x: cells.length,
          type: useBlank ? null : cell.type,
        },
        {
          ...cell,
          y,
          x: cells.length + 1,
          type: null,
        },
      ],
      [
        {
          ...row[0],
          y,
          x: 0,
          type: null,
        },
      ] as T[]
    );
  }
}
