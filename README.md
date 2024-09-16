# cluster-worker
The `cluster-worker` is a Node.js module designed to help you perform parallel processing using the built-in `cluster` module. This module allows you to run multiple worker processes simultaneously, enabling efficient use of CPU resources based on the node:cluster, node:os, node:process

## Features

- Distributes tasks across multiple worker processes.
- Automatically restarts workers if they crash.
- Provides status updates on worker activity.


## Installation

You can add the `cluster-worker` to your project by installing it via npm:

```bash
pnpm add cluster-worker

yarn install cluster-worker

npm install cluster-worker
```

### Usage

```typescript
import { parallelism } from 'cluster-worker';

const task = async (index: number, total: number) => {
    console.log(`Worker ${index} of ${total} is running.`);
    
    // Implement your task logic here
};

parallelism(task);
```

## tsup
Bundle your TypeScript library with no config, powered by esbuild.

https://tsup.egoist.dev/

## How to use this
1. install dependencies
```
# pnpm
$ pnpm install

# yarn
$ yarn install

# npm
$ npm install
```
2. Add your code to `src`
3. Add export statement to `src/index.ts`
4. Test build command to build `src`.
Once the command works properly, you will see `dist` folder.

```zsh
# pnpm
$ pnpm run build

# yarn
$ yarn run build

# npm
$ npm run build
```
5. Publish your package

```zsh
$ npm publish
```


## test package
https://www.npmjs.com/package/cluster-worker
