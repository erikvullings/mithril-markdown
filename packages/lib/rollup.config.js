import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    external: ['mithril'],
    output: {
      name: 'mithril-markdown',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'mithril': 'm'
      }
    },
    plugins: [
      resolve({ browser: true }), // so Rollup can find `marked`
      commonjs(), // so Rollup can convert `marked` to an ES module, if needed
      postcss(
        // { plugins: [] }
      ),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external: ['mithril'],
    plugins: [
      resolve({ browser: true }), // so Rollup can find `marked`
      commonjs(), // so Rollup can convert `marked` to an ES module, if needed
      postcss(),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      // { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
