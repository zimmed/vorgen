# zimmed/vorgen

A 2D grid generator using Voronoi method for procedurally typing tiles.

### Dependencies

- [prando](https://github.com/zeh/prando) For deterministic pseudo-random number generation.

### Installation

`$ npm i --save zimmed/vorgen`

### Usage

```javascript
// TS/ES6+ Imports
import Vorgen from '@zimmed/vorgen';

// Node
const Vorgen = require('@zimmed/vorgen').default;
```

```javascript

import Prando from 'prando';
import Generator from './Generator';

type Cell = { type: string | null; x: number; y: number };

const WIDTH = 42;
const HEIGHT = 20;
const SEED = 'Voronoi';

const prando = new Prando(SEED);

const baseTerrain = [
  { type: ' ', weight: 2 },
  { type: '/', weight: 1 },
  { type: '#', weight: 2 },
];

const LakeDef = {
  def: [
    {
      x: Math.floor(WIDTH / 2),
      y: Math.floor(HEIGHT / 2),
      def: { type: '≈', power: 2, powerDecay: 0.1 },
    },
    ...Generator.randomizedEdgePoints(WIDTH, HEIGHT, {
      prando,
      autoIncludeCorners: false,
      numberPerSide: [1, 3],
    }).map(({ x, y }) => ({ x, y, def: { type: null } })),
  ],
};

const OreDef = {
  cellType: '#',
  defs: [
    { type: '÷', num: 4, maxRadius: 5 },
    { type: '∆', num: 3, maxRadius: 2 },
  ],
};

const CaveDef = {
  cellType: '#',
  defs: [{ type: '/', num: 8, power: 2, powerDecay: 0.33 }],
};

const TreeDef = {
  cellType: ' ',
  defs: [{ type: '¥', num: 66, maxRadius: 1 }],
};

const gridToString = (grid: Cell[][], space: string = ' ') =>
  [
    Array(grid[0].length + 2)
      .fill('0')
      .join(space),
    ...grid.map(
      (row) => `0${space}${row.map((c) => c.type).join(space)}${space}0`
    ),
    Array(grid[0].length + 2)
      .fill('0')
      .join(space),
  ].join('\n');

describe('typeGrid()', () => {
  it('should generate a grid', async () => {
    let out = '';
    const onUpdate = (s: string, g: Cell[][]): void => {
      out += `\n${s}\n${gridToString(g, '')}\n`;
    };
    const grid = await Generator.createGrid<string>(
      WIDTH,
      HEIGHT,
      baseTerrain,
      {
        onUpdate,
        prando,
        split: 8,
        preExpandDefs: [LakeDef, CaveDef, OreDef],
        expandCount: 1,
        postExpandDefs: [TreeDef],
      }
    );

    console.log('');
    console.log(out);
    console.log('');
    expect(grid).toBeTruthy();
  });
});

```

### Include source to use your own transpilation rules

```javascript
import Vorgen from '@zimmed/vorgen/src';
// const Vorgen = require('@zimmed/vorgen/src').default;

...
```

### License

Whatever man, it's math. No one owns math. Use it as you see fit.
