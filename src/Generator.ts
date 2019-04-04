import Prando from 'prando';
import Voronoi, { ICell, IWCellDef, INCellDef, IPoint } from './Voronoi';

const NOOP = () => {
  // NOOP
};

enum Status {
  Init = 'Initial generation complete.',
  Additional = 'Finished secondary pass.',
  Expand = 'Finished 2N+1 expansion of grid.',
}

type ManualDef<T> = [IPoint<INCellDef<T>>, ...Array<IPoint<INCellDef<null>>>];
interface IDef<T> {
  cellType?: T | T[];
  defs?: Array<INCellDef<T>>;
  def?: ManualDef<T>;
}

const yAxisPoints = (
  num: number,
  rand: Prando,
  yMax: number,
  xMin: number,
  xMax: number,
  corners: boolean = true
): Array<{ x: number; y: number }> => {
  const min = corners ? 0 : 1;
  const max = corners ? yMax : yMax - 1;

  return Array(num)
    .fill(0)
    .map(() => ({
      x: rand.nextInt(xMin, xMax),
      y: rand.nextInt(min, max),
    }));
};

const xAxisPoints = (
  num: number,
  rand: Prando,
  xMax: number,
  yMin: number,
  yMax: number,
  corners: boolean = true
): Array<{ x: number; y: number }> => {
  const min = corners ? 0 : 1;
  const max = corners ? xMax : xMax - 1;

  return Array(num)
    .fill(0)
    .map(() => ({
      y: rand.nextInt(yMin, yMax),
      x: rand.nextInt(min, max),
    }));
};

export default class Generator {
  public static Status = Status;

  /**
   * Create a list of random points around the perimeter of the grid.
   * @param {number} width - Grid width
   * @param {number} height - Grid height
   * @param {object} [opts] - Options
   *  @param {string} [opts.seed] - Seed to use for number generation (left undefined for random)
   *  @param {Prando} [opts.prando] - Prando instance to use instead of creating one
   *  @param {boolean} [opts.autoIncludeCorners] (= false) - Automatically include grid corner positions in returned points (does not count in numberPerSide)
   *  @param {number | [number, number]} [opts.numberPerSide] (= 1) - Number of points to generate per side or range tuple containing min and max to randomly select number
   *  @param {boolean} [opts.top] (= true) - Include top side of grid
   *  @param {boolean} [opts.left] (= true) - Include left side of grid
   *  @param {boolean} [opts.bottom] (= true) - Include bottom side of grid
   *  @param {boolean} [opts.right] (= true) - Include right side of grid
   *  @param {number} [opts.maxDistanceFromEdge] (= 10% of the width-height average) - The maximum distance any point can be from the edge of its side. (Set to 0 for only outter-edge positions)
   * @returns {object[]} points
   *  @returns {number} points[].x
   *  @returns {number} points[].y
   */
  public static randomizedEdgePoints(
    width: number,
    height: number,
    {
      seed,
      prando,
      autoIncludeCorners = false,
      numberPerSide = 1,
      top = true,
      left = true,
      bottom = true,
      right = true,
      maxDistanceFromEdge = Math.round(0.05 * width + 0.05 * height),
    }: {
      seed?: string;
      prando?: Prando;
      autoIncludeCorners?: boolean;
      numberPerSide?: number | [number, number];
      top?: boolean;
      left?: boolean;
      bottom?: boolean;
      right?: boolean;
      maxDistanceFromEdge?: number;
    } = {}
  ): Array<{ x: number; y: number }> {
    const rand = prando || new Prando(seed);
    const numPerSide = (): number =>
      typeof numberPerSide === 'number'
        ? numberPerSide
        : rand.nextInt(...numberPerSide);
    const xMax = width - 1;
    const yMax = height - 1;
    const corners = autoIncludeCorners
      ? [
          { x: 0, y: 0 },
          { x: xMax, y: 0 },
          { x: 0, y: yMax },
          { x: xMax, y: yMax },
        ]
      : [];
    const tops = top
      ? xAxisPoints(
          numPerSide(),
          rand,
          xMax,
          0,
          maxDistanceFromEdge,
          !autoIncludeCorners
        )
      : [];
    const bottoms = bottom
      ? xAxisPoints(
          numPerSide(),
          rand,
          xMax,
          yMax - maxDistanceFromEdge,
          yMax,
          !autoIncludeCorners
        )
      : [];
    const lefts = left
      ? yAxisPoints(
          numPerSide(),
          rand,
          yMax,
          0,
          maxDistanceFromEdge,
          !autoIncludeCorners
        )
      : [];
    const rights = right
      ? yAxisPoints(
          numPerSide(),
          rand,
          yMax,
          xMax - maxDistanceFromEdge,
          xMax,
          !autoIncludeCorners
        )
      : [];

    return corners.concat(tops, bottoms, lefts, rights);
  }

  /**
   * Procedurally generate a grid of cells with types determined by Voronoi graph.
   * @param {number} width - Grid width
   * @param {number} height - Grid height
   * @param {object[]} terrainDef - List of terrain definitions for the original grid generation
   *  @param {any} terrainDef[].type - Representation of the terrain type to generate
   *  @param {number} [terrainDef[].weight] (= 1) - Modified the probability of generating a Voronoi point of this type
   *  @param {number} [terrainDef[].maxRadius] - If set, restricts the generation of the typed area to the specified radius
   * @param {object} [opts] - Options
   *  @param {string} [opts.seed] - Seed to use for number generation (left undefined for random)
   *  @param {Prando} [opts.prando] - Prando instance to use instead of creating one
   *  @param {number} [opts.split] (= 10) - Diameter of splitting grid for automatically determining numPoints
   *  @param {number} [opts.numPoints] - Statically set the number of points to use in the initial terrain type generation
   *  @param {number} [opts.normalizePower] (= 1) - Change the Voronoi magnitude of points used to maintain cell types during additional type generation
   *  @param {any} [opts.typeForEdgeExpansion] - If set, during a grid expansion, the edge type is allowed to expand into stem cells on the edge of the grid
   *  @param {number} [opts.expandCount] (= 0) - Number of times to trigger 2N+1 grid expansion after applying preExpandDefs
   *  @param {string} [opts.heuristic] (= 'euclid') - The distance method to use during Voronoi expansions (can be 'manhattan' or 'euclid')
   *  @param {object[]} [opts.preExpandDefs] - Type generation definitions to apply after the initial generation, but before any expansions
   *    @param {any} [opts.preExpandDefs[].cellType] - If set, the def or defs will only be applied to cells of the provided type
   *    @param {NDef[]} [opts.preExpandDefs[].defs] - If set, the list of numbered definitions to apply (def is ignored when set)
   *      @param {any} opts.preExpandDefs[].defs[].type - The type to generate
   *      @param {number} [opts.preExpandDefs[].defs[].num] (= 1) - The number of Voronoi points to create for this type
   *      @param {number} [opts.preExpandDefs[].defs[].power] (= 1) - The magnitude of the Voronoi expansion
   *      @param {number} [opts.preExpandDefs[].defs[].powerDecay] (= 0) - Decay the expansion magnitude over distance from the center
   *      @param {number} [opts.preExpandDefs[].defs[].maxRadius] - f set, restricts the generation of the voronoi expansion to the specified radius
   *    @param {object[]} [opts.preExpandDefs[].def] - Instead of defs, this may be set with a manual point definition
   *      @param {NDef} opts.preExpandDefs[].def[0] - Point to initiate Voronoi expansion for type (see above description for NDef type)
   *      @param {NullNDef} [opts.preExpandDefs[].def[1..N]] - Normalize points with NDefs of type=null (randomizeEdgePoints often used to generate these)
   * @returns {object[][]} grid - The generated grid
   *  @returns {number} grid[][].x
   *  @returns {number} grid[][].y
   *  @returns {any} grid[][].type
   */
  public static async createGrid<T = string, C extends ICell<T> = ICell<T>>(
    width: number,
    height: number,
    terrainDef: Array<IWCellDef<T>>,
    {
      seed,
      prando,
      split,
      numPoints,
      normalizePower,
      typeForEdgeExpansion,
      onUpdate = NOOP,
      preExpandDefs = [],
      postExpandDefs = [],
      expandCount = 0,
      heuristic = 'euclid',
    }: {
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
      heuristic?: keyof typeof Voronoi.heuristics;
    } = {}
  ): Promise<C[][]> {
    const rand = prando || new Prando(seed);
    let grid = (await Voronoi.generateTypedGridAsync(
      width,
      height,
      terrainDef,
      { prando: rand, heuristic, split, numPoints }
    )) as C[][];

    onUpdate(Status.Init, grid);

    for (const { cellType, defs, def } of preExpandDefs) {
      grid = (defs
        ? await Voronoi.applyNumberedDefAsync(grid, defs, {
            onlyOnType: cellType,
            prando: rand,
            normalizePower,
          })
        : def && def.length
        ? await Voronoi.applyManualPlotAsync(
            grid,
            def[0],
            def.slice(1) as ManualDef<null>,
            {
              onlyOnType: cellType,
              heuristic,
            }
          )
        : grid) as C[][];

      onUpdate(Status.Additional, grid);
    }

    for (const _ of Array(expandCount)) {
      grid = (await Voronoi.expandGridAsync(grid, {
        prando: rand,
        edgeType: typeForEdgeExpansion || null,
      })) as C[][];
      onUpdate(Status.Expand, grid);
    }

    for (const { cellType, defs, def } of postExpandDefs) {
      grid = (defs
        ? await Voronoi.applyNumberedDefAsync(grid, defs, {
            onlyOnType: cellType,
            prando: rand,
            normalizePower,
          })
        : def && def.length
        ? await Voronoi.applyManualPlotAsync(
            grid,
            def[0],
            def.slice(1) as ManualDef<null>,
            {
              onlyOnType: cellType,
              heuristic,
            }
          )
        : grid) as C[][];

      onUpdate(Status.Additional, grid);
    }

    return grid;
  }
}
