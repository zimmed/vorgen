var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
import Prando from 'prando';
var sortWByH = function (h) { return function (_a, _b) {
    var _c = _a.def, _d = _c.weight, aW = _d === void 0 ? 0 : _d, _e = _c.maxRadius, aM = _e === void 0 ? 0 : _e, a = __rest(_a, ["def"]);
    var _f = _b.def, _g = _f.weight, bW = _g === void 0 ? 0 : _g, _h = _f.maxRadius, bM = _h === void 0 ? 0 : _h, b = __rest(_b, ["def"]);
    var dx = h(a);
    var dy = h(b);
    var x = aM && dx > aM - 1 ? Infinity : dx;
    var y = bM && dy > bM - 1 ? Infinity : dy;
    return x > y ? 1 : x < y ? -1 : aW < bW ? 1 : aW > bW ? -1 : 0;
}; };
var sortNByH = function (h) { return function (_a, _b) {
    var _c = _a.def, _d = _c.maxRadius, aM = _d === void 0 ? 0 : _d, _e = _c.powerDecay, aPD = _e === void 0 ? 0 : _e, _f = _c.power, aP = _f === void 0 ? 1 : _f, a = __rest(_a, ["def"]);
    var _g = _b.def, _h = _g.maxRadius, bM = _h === void 0 ? 0 : _h, _j = _g.powerDecay, bPD = _j === void 0 ? 0 : _j, _k = _g.power, bP = _k === void 0 ? 1 : _k, b = __rest(_b, ["def"]);
    var dx = h(a);
    var dy = h(b);
    var pdx = dx * (1 / aP + aPD * dx);
    var pdy = dy * (1 / bP + bPD * dy);
    var x = aM && pdx > aM - 1 ? Infinity : pdx;
    var y = bM && pdy > bM - 1 ? Infinity : pdy;
    return x > y ? 1 : x < y ? -1 : 0;
}; };
var heuristics = {
    manhattan: function (i, j) { return function (_a) {
        var x = _a.x, y = _a.y;
        return Math.abs(x - j) + Math.abs(y - i);
    }; },
    euclid: function (i, j) { return function (_a) {
        var x = _a.x, y = _a.y;
        return Math.sqrt(Math.pow(x - j, 2) + Math.pow(y - i, 2));
    }; },
};
var Voronoi = /** @class */ (function () {
    function Voronoi() {
    }
    Voronoi.createCell = function (x, y, type) {
        if (type === void 0) { type = null; }
        return { x: x, y: y, type: type };
    };
    Voronoi.expandGrid = function (grid, _a) {
        var _this = this;
        var prando = _a.prando, seed = _a.seed, _b = _a.edgeType, edgeType = _b === void 0 ? null : _b;
        var rand = prando || new Prando(seed);
        var nextGrid = grid.reduce(function (rows, row) { return rows.concat([
            _this.expandRow(row, rows.length),
            _this.expandRow(row, rows.length + 1, true),
        ]); }, [this.expandRow(grid[0], 0, true)]);
        nextGrid = nextGrid.map(function (row, y) {
            return y % 2 === 1
                ? row.map(function (cell) {
                    return cell.type === null
                        ? __assign({}, cell, { type: _this.determineTypeFromNeighbors(nextGrid, rand, cell, edgeType) }) : cell;
                })
                : row;
        });
        nextGrid = nextGrid.map(function (row, y) {
            return y % 2 === 0
                ? row.map(function (cell, x) {
                    return x % 2 === 1 && cell.type === null
                        ? __assign({}, cell, { type: _this.determineTypeFromNeighbors(nextGrid, rand, cell, edgeType) }) : cell;
                })
                : row;
        });
        return nextGrid.map(function (row, y) {
            return y % 2 === 0
                ? row.map(function (cell) {
                    return cell.type === null
                        ? __assign({}, cell, { type: _this.determineTypeFromNeighbors(nextGrid, rand, cell, edgeType) }) : cell;
                })
                : row;
        });
    };
    Voronoi.generateTypedGrid = function (width, height, types, opts) {
        var _this = this;
        var grid = Array(height)
            .fill(0)
            .map(function (_, y) {
            return Array(width)
                .fill(0)
                .map(function (_, x) { return _this.createCell(x, y); });
        });
        return this.applyWeightedDef(grid, types, opts);
    };
    Voronoi.applyWeightedDef = function (grid, types, _a) {
        var _b = _a === void 0 ? {} : _a, seed = _b.seed, split = _b.split, numPoints = _b.numPoints, prando = _b.prando, _c = _b.heuristic, heuristic = _c === void 0 ? 'euclid' : _c;
        var distance = heuristics[heuristic];
        var rand = prando || new Prando(seed);
        var points = this.generateWeightedPoints(grid, rand, types, numPoints, split);
        return grid.map(function (row, i) {
            return row.map(function (cell, j) {
                var s = sortWByH(distance(i, j));
                var p = points.slice().sort(s);
                return __assign({}, cell, { type: p[0].def.type });
            });
        });
    };
    Voronoi.applyManualPlot = function (grid, point, normalizePoints, _a) {
        if (normalizePoints === void 0) { normalizePoints = []; }
        var _b = _a === void 0 ? {} : _a, onlyOnType = _b.onlyOnType, _c = _b.heuristic, heuristic = _c === void 0 ? 'euclid' : _c;
        var distance = heuristics[heuristic];
        var includes = this.hasCellType(onlyOnType);
        var points = [
            point
        ].concat(normalizePoints);
        return grid.map(function (row, i) {
            return row.map(function (cell, j) {
                var def = points.slice().sort(sortNByH(distance(i, j)))[0].def;
                return def.type !== null && includes(cell.type)
                    ? __assign({}, cell, { type: def.type }) : cell;
            });
        });
    };
    Voronoi.applyNumberedDef = function (grid, types, _a) {
        var _b = _a === void 0 ? {} : _a, seed = _b.seed, onlyOnType = _b.onlyOnType, prando = _b.prando, _c = _b.heuristic, heuristic = _c === void 0 ? 'euclid' : _c, normalizeSplit = _b.normalizeSplit, _d = _b.normalizePower, normalizePower = _d === void 0 ? 1 : _d, normalizeCount = _b.normalizeCount;
        var includes = this.hasCellType(onlyOnType);
        var distance = heuristics[heuristic];
        var rand = prando || new Prando(seed);
        // Pick arbitrary normalizer points that maintain the current types
        var normalPoints = normalizeCount !== 0
            ? this.generateWeightedPoints(grid, rand, [{ type: null }], normalizeSplit, normalizeCount).map(function (_a) {
                var x = _a.x, y = _a.y;
                return ({
                    x: x,
                    y: y,
                    def: { type: null, num: 0, power: normalizePower },
                });
            })
            : [];
        var points = this.generateNumberedPoints(grid, rand, types, onlyOnType).concat(normalPoints);
        return grid.map(function (row, i) {
            return row.map(function (cell, j) {
                var def = points.slice().sort(sortNByH(distance(i, j)))[0].def;
                return def.type !== null && includes(cell.type)
                    ? __assign({}, cell, { type: def.type }) : cell;
            });
        });
    };
    Voronoi.getType = function (grid, x, y, defaultType) {
        if (defaultType === void 0) { defaultType = null; }
        var type = grid[y] && grid[y][x] && grid[y][x].type;
        return typeof type === 'undefined' ? defaultType : type;
    };
    Voronoi.generateNumberedPoints = function (grid, rand, types, onlyOnCellType) {
        var points = [];
        var max = types.reduce(function (accum, _a) {
            var _b = _a.num, num = _b === void 0 ? 1 : _b;
            return accum + num;
        }, 0);
        var includes = this.hasCellType(onlyOnCellType);
        var posPool = grid.reduce(function (pool, row, y) {
            return pool.concat(row.reduce(function (p, _a, x) {
                var type = _a.type;
                return (includes(type) ? p.concat({ x: x, y: y }) : p);
            }, []));
        }, []);
        var counts = types.reduce(function (obj, def) {
            var _a;
            return (__assign({}, obj, (_a = {}, _a["" + def.type] = 0, _a)));
        }, {});
        var c = 0;
        while (posPool.length && c < max) {
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var def = types_1[_i];
                if (counts["" + def.type] < (def.num || 1)) {
                    counts["" + def.type] += 1;
                    c++;
                    points.push(__assign({}, posPool.splice(rand.nextInt(0, posPool.length - 1), 1)[0], { def: def }));
                }
                if (!posPool.length || c >= max) {
                    break;
                }
            }
        }
        return points;
    };
    Voronoi.generateWeightedPoints = function (grid, rand, types, split, n) {
        if (split === void 0) { split = 10; }
        var height = grid.length;
        var width = grid[0].length;
        var num = n ||
            Math.ceil((width * height) / (split * split * types.length)) *
                types.length;
        var xs = Array(width)
            .fill(0)
            .map(function (_, i) { return i; });
        var ys = Array(height)
            .fill(0)
            .map(function (_, i) { return i; });
        var _a = types
            .sort(function (_a, _b) {
            var _c = _a.weight, a = _c === void 0 ? 0 : _c;
            var _d = _b.weight, b = _d === void 0 ? 0 : _d;
            return a < b ? 1 : a > b ? -1 : 0;
        })
            .reduce(function (_a, def) {
            var accum = _a[0], m = _a[1];
            return [
                accum.concat([__assign({}, def, { weight: m + (def.weight || 1) })]),
                m + (def.weight || 1),
            ];
        }, [[], 0]), calcedTypes = _a[0], max = _a[1];
        return calcedTypes
            .map(function (def) { return ({
            def: def,
            x: xs.splice(rand.nextInt(0, xs.length - 1), 1)[0],
            y: ys.splice(rand.nextInt(0, ys.length - 1), 1)[0],
        }); })
            .concat(Array(Math.max(0, num - calcedTypes.length))
            .fill(0)
            .map(function () {
            var roll = rand.next() * max;
            var i = 0;
            while (calcedTypes[i] && calcedTypes[i].weight < roll) {
                i++;
            }
            return {
                def: calcedTypes[i],
                x: xs.splice(rand.nextInt(0, xs.length - 1), 1)[0],
                y: ys.splice(rand.nextInt(0, ys.length - 1), 1)[0],
            };
        }));
    };
    Voronoi.determineTypeFromNeighbors = function (grid, rand, cell, edgeType) {
        var neighbors = this.getNeighborTypes(grid, cell, edgeType);
        var roll = rand.nextInt(0, neighbors.length - 1);
        return neighbors[roll];
    };
    Voronoi.getNeighborTypes = function (grid, cell, edgeType) {
        return [
            this.getType(grid, cell.x, cell.y - 1, edgeType),
            this.getType(grid, cell.x, cell.y + 1, edgeType),
            this.getType(grid, cell.x - 1, cell.y, edgeType),
            this.getType(grid, cell.x + 1, cell.y, edgeType),
        ].filter(function (e) { return e !== null; });
    };
    Voronoi.hasCellType = function (c) {
        if (typeof c === 'undefined') {
            return function () { return true; };
        }
        else if (Array.isArray(c)) {
            return function (t) { return t !== null && c.includes(t); };
        }
        else {
            return function (t) { return t === c; };
        }
    };
    Voronoi.expandRow = function (row, y, useBlank) {
        if (useBlank === void 0) { useBlank = false; }
        return row.reduce(function (cells, cell) { return cells.concat([
            __assign({}, cell, { y: y, x: cells.length, type: useBlank ? null : cell.type }),
            __assign({}, cell, { y: y, x: cells.length + 1, type: null }),
        ]); }, [
            __assign({}, row[0], { y: y, x: 0, type: null }),
        ]);
    };
    Voronoi.heuristics = heuristics;
    Voronoi.generateTypedGridAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Voronoi.generateTypedGrid.apply(Voronoi, args)];
        }); });
    };
    Voronoi.applyWeightedDefAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Voronoi.applyWeightedDef.apply(Voronoi, args)];
        }); });
    };
    Voronoi.applyNumberedDefAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Voronoi.applyNumberedDef.apply(Voronoi, args)];
        }); });
    };
    Voronoi.expandGridAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Voronoi.expandGrid.apply(Voronoi, args)];
        }); });
    };
    Voronoi.applyManualPlotAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Voronoi.applyManualPlot.apply(Voronoi, args)];
        }); });
    };
    return Voronoi;
}());
export default Voronoi;
