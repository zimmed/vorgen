import Prando from 'prando';
import Vorgen from '../src';

const WIDTH = 48;
const HEIGHT = 12;
const SEED = 'zimmed';

enum Type {
  Grass = ' ',
  Rock = '#',
  Dirt = '/',
  Water = '≈',
  IronOre = '*',
  SilverOre = '∆',
  Tree = '¥',
};

const TERRAIN = [
  { type: Type.Grass, weight: 2 },
  { type: Type.Rock, weight: 2 },
  { type: Type.Dirt },
];
const ORE = {
  cellType: Type.Rock,
  defs: [
    { type: Type.IronOre, num: 4, maxRadius: 4 },
    { type: Type.SilverOre, num: 2, maxRadius: 2 },
  ],
};
const CAVE = {
  cellType: [Type.Rock, Type.IronOre, Type.SilverOre],
  defs: [{ type: Type.Dirt, num: 2, power: 2, powerDecay: 0.33 }],
};
const TREE = {
  cellType: Type.Grass,
  defs: [{ type: Type.Tree, num: 66, maxRadius: 1 }],
};

const LAKE_POINT = {
  x: Math.floor(WIDTH / 2),
  y: Math.floor(HEIGHT / 2),
  def: { type: Type.Water, power: 2, powerDecay: 0.1 },
};

async function main() {
  const prando = new Prando(SEED);
  const lake = {
    def: [
      LAKE_POINT,
      ...Vorgen.randomizedEdgePoints(WIDTH, HEIGHT, { prando, numberPerSide: [1, 3] })
        .map(p => ({ ...p, def: { type: null } }))
    ]
  };
  const grid = await Vorgen.createGrid<Type>(WIDTH, HEIGHT, TERRAIN, {
    prando,
    preExpandDefs: [lake, ORE, CAVE],
    expandCount: 1,
    postExpandDefs: [TREE],
    onUpdate: (status, g) => {
      console.log(status);
      console.log([
        Array(g[0].length + 2).fill('0').join(''),
        ...g.map(r => `0${r.map(c => c.type).join('')}0`),
        Array(g[0].length + 2).fill('0').join(''),
      ].join('\n'))
    }
  });

  console.log(`Completed grid size: (${grid[0].length} x ${grid.length})`);
}

main();
