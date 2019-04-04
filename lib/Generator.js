var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Prando from 'prando';
import Voronoi from './Voronoi';
var NOOP = function () {
    // NOOP
};
var Status;
(function (Status) {
    Status["Init"] = "Initial generation complete.";
    Status["Additional"] = "Finished secondary pass.";
    Status["Expand"] = "Finished 2N+1 expansion of grid.";
})(Status || (Status = {}));
var yAxisPoints = function (num, rand, yMax, xMin, xMax, corners) {
    if (corners === void 0) { corners = true; }
    var min = corners ? 0 : 1;
    var max = corners ? yMax : yMax - 1;
    return Array(num)
        .fill(0)
        .map(function () { return ({
        x: rand.nextInt(xMin, xMax),
        y: rand.nextInt(min, max),
    }); });
};
var xAxisPoints = function (num, rand, xMax, yMin, yMax, corners) {
    if (corners === void 0) { corners = true; }
    var min = corners ? 0 : 1;
    var max = corners ? xMax : xMax - 1;
    return Array(num)
        .fill(0)
        .map(function () { return ({
        y: rand.nextInt(yMin, yMax),
        x: rand.nextInt(min, max),
    }); });
};
var Generator = /** @class */ (function () {
    function Generator() {
    }
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
    Generator.randomizedEdgePoints = function (width, height, _a) {
        var _b = _a === void 0 ? {} : _a, seed = _b.seed, prando = _b.prando, _c = _b.autoIncludeCorners, autoIncludeCorners = _c === void 0 ? false : _c, _d = _b.numberPerSide, numberPerSide = _d === void 0 ? 1 : _d, _e = _b.top, top = _e === void 0 ? true : _e, _f = _b.left, left = _f === void 0 ? true : _f, _g = _b.bottom, bottom = _g === void 0 ? true : _g, _h = _b.right, right = _h === void 0 ? true : _h, _j = _b.maxDistanceFromEdge, maxDistanceFromEdge = _j === void 0 ? Math.round(0.05 * width + 0.05 * height) : _j;
        var rand = prando || new Prando(seed);
        var numPerSide = function () {
            return typeof numberPerSide === 'number'
                ? numberPerSide
                : rand.nextInt.apply(rand, numberPerSide);
        };
        var xMax = width - 1;
        var yMax = height - 1;
        var corners = autoIncludeCorners
            ? [
                { x: 0, y: 0 },
                { x: xMax, y: 0 },
                { x: 0, y: yMax },
                { x: xMax, y: yMax },
            ]
            : [];
        var tops = top
            ? xAxisPoints(numPerSide(), rand, xMax, 0, maxDistanceFromEdge, !autoIncludeCorners)
            : [];
        var bottoms = bottom
            ? xAxisPoints(numPerSide(), rand, xMax, yMax - maxDistanceFromEdge, yMax, !autoIncludeCorners)
            : [];
        var lefts = left
            ? yAxisPoints(numPerSide(), rand, yMax, 0, maxDistanceFromEdge, !autoIncludeCorners)
            : [];
        var rights = right
            ? yAxisPoints(numPerSide(), rand, yMax, xMax - maxDistanceFromEdge, xMax, !autoIncludeCorners)
            : [];
        return corners.concat(tops, bottoms, lefts, rights);
    };
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
    Generator.createGrid = function (width, height, terrainDef, _a) {
        var _b = _a === void 0 ? {} : _a, seed = _b.seed, prando = _b.prando, split = _b.split, numPoints = _b.numPoints, normalizePower = _b.normalizePower, typeForEdgeExpansion = _b.typeForEdgeExpansion, _c = _b.onUpdate, onUpdate = _c === void 0 ? NOOP : _c, _d = _b.preExpandDefs, preExpandDefs = _d === void 0 ? [] : _d, _e = _b.postExpandDefs, postExpandDefs = _e === void 0 ? [] : _e, _f = _b.expandCount, expandCount = _f === void 0 ? 0 : _f, _g = _b.heuristic, heuristic = _g === void 0 ? 'euclid' : _g;
        return __awaiter(this, void 0, void 0, function () {
            var rand, grid, _i, preExpandDefs_1, _h, cellType, defs, def, _j, _k, _l, _m, _, _o, postExpandDefs_1, _p, cellType, defs, def, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        rand = prando || new Prando(seed);
                        return [4 /*yield*/, Voronoi.generateTypedGridAsync(width, height, terrainDef, { prando: rand, heuristic: heuristic, split: split, numPoints: numPoints })];
                    case 1:
                        grid = (_s.sent());
                        onUpdate(Status.Init, grid);
                        _i = 0, preExpandDefs_1 = preExpandDefs;
                        _s.label = 2;
                    case 2:
                        if (!(_i < preExpandDefs_1.length)) return [3 /*break*/, 10];
                        _h = preExpandDefs_1[_i], cellType = _h.cellType, defs = _h.defs, def = _h.def;
                        if (!defs) return [3 /*break*/, 4];
                        return [4 /*yield*/, Voronoi.applyNumberedDefAsync(grid, defs, {
                                onlyOnType: cellType,
                                prando: rand,
                                normalizePower: normalizePower,
                            })];
                    case 3:
                        _j = _s.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(def && def.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Voronoi.applyManualPlotAsync(grid, def[0], def.slice(1), {
                                onlyOnType: cellType,
                                heuristic: heuristic,
                            })];
                    case 5:
                        _k = _s.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _k = grid;
                        _s.label = 7;
                    case 7:
                        _j = _k;
                        _s.label = 8;
                    case 8:
                        grid = (_j);
                        onUpdate(Status.Additional, grid);
                        _s.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        _l = 0, _m = Array(expandCount);
                        _s.label = 11;
                    case 11:
                        if (!(_l < _m.length)) return [3 /*break*/, 14];
                        _ = _m[_l];
                        return [4 /*yield*/, Voronoi.expandGridAsync(grid, {
                                prando: rand,
                                edgeType: typeForEdgeExpansion || null,
                            })];
                    case 12:
                        grid = (_s.sent());
                        onUpdate(Status.Expand, grid);
                        _s.label = 13;
                    case 13:
                        _l++;
                        return [3 /*break*/, 11];
                    case 14:
                        _o = 0, postExpandDefs_1 = postExpandDefs;
                        _s.label = 15;
                    case 15:
                        if (!(_o < postExpandDefs_1.length)) return [3 /*break*/, 23];
                        _p = postExpandDefs_1[_o], cellType = _p.cellType, defs = _p.defs, def = _p.def;
                        if (!defs) return [3 /*break*/, 17];
                        return [4 /*yield*/, Voronoi.applyNumberedDefAsync(grid, defs, {
                                onlyOnType: cellType,
                                prando: rand,
                                normalizePower: normalizePower,
                            })];
                    case 16:
                        _q = _s.sent();
                        return [3 /*break*/, 21];
                    case 17:
                        if (!(def && def.length)) return [3 /*break*/, 19];
                        return [4 /*yield*/, Voronoi.applyManualPlotAsync(grid, def[0], def.slice(1), {
                                onlyOnType: cellType,
                                heuristic: heuristic,
                            })];
                    case 18:
                        _r = _s.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        _r = grid;
                        _s.label = 20;
                    case 20:
                        _q = _r;
                        _s.label = 21;
                    case 21:
                        grid = (_q);
                        onUpdate(Status.Additional, grid);
                        _s.label = 22;
                    case 22:
                        _o++;
                        return [3 /*break*/, 15];
                    case 23: return [2 /*return*/, grid];
                }
            });
        });
    };
    Generator.Status = Status;
    return Generator;
}());
export default Generator;
