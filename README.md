# zimmed/vorgen

A 2D grid generator using Voronoi method for procedurally typing tiles.

### Dependencies

- [prando](https://github.com/zeh/prando) For deterministic pseudo-random number generation.

### Installation

`$ npm i --save zimmed/vorgen`

### Import

#### TS/ES6+
```javascript
import Vorgen from '@zimmed/vorgen';
```

#### Node
```javascript
const Vorgen = require('@zimmed/vorgen').default;
```

#### Others
`Just don't do it. It's 2019, stop using javascript without a proper development environment.`

### Usage

#### Simple Example
```javascript
const printGrid = (g) => console.log(
  [
    Array(g[0].length + 2).fill('0').join(''),
    ...g.map(r => `0${r.map(c => c.type).join('')}0`),
    Array(g[0].length + 2).fill('0').join(''),
  ].join('\n')
);

Vorgen.createGrid(80, 20, [
  { type: ' ', weight: 2 },
  { type: '#', weight: 2 },
  { type: '/' },
], { seed: 'zimmed' })
  .then(printGrid);
```

**OUTPUT**
```
0000000000000000000000000000000000000000000000000000000000000000000000000000000000
0                               ////#############################################0
0                              ////####################/#########################0
0                             #////####################////######################0
0                           ##/////###################////////###################0
0                         ####////####################///////////################0
0                  ##   #####/////###################///////////////#############0
0                 ###########/////############////////////////////////###########0
0               ############/////########/////////////////////////////     ######0
0              #############/////#######/////////////////////////////            0
0             #############//////#######/////////////////////////////            0
0            ##############/////#######/////////////////////////////             0
0          ###############//////#######/////////////////////////////             0
0         #################/////######/////////////////////////////              0
0         ##################///#######/////////////////////////////              0
0         ###################//#######/////////////////////////////              0
0        ####################//######//////////////////////////////              0
0        ###########################/////////////////////////////                0
0        #########################/////////////////////////////                  0
0        ########################////////////////////////////                    0
0       #######################////////////////////////////                      0
0000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

#### Advanced Example

See [demo.ts](example/demo.ts) and [demo.output](example/demo.output).

### Include source to use your own transpilation rules

```javascript
import Vorgen from '@zimmed/vorgen/src';
// const Vorgen = require('@zimmed/vorgen/src').default;

...
```

### License

Whatever man, it's math. No one owns math. Use it as you see fit.
