// import resolve from '@rollup/plugin-node-resolve';
// import sourceMaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

export default {
  input: `src/index.ts`,
  watch: 'src/**',
  output: [
    {
      file: pkg.module,
      format: 'es',
      // name: 'mithril-markdown',
      // sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'umd',
      name: 'markdown-editor',
      // name: 'MarkdownEditor',
      // sourcemap: true,
      globals: {
        mithril: 'm',
      },
    },
  ],
  // Indicate here external modules you don't want to include in your bundle
  external: ['mithril'],
  // external: [...Object.keys(pkg.dependencies || {})],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    postcss(),
    // Compile TypeScript files
    typescript({
      exclude: ['*.d.ts', '**/*.d.ts', '**/*.test.ts', '**/*.test.d.ts'],
      rollupCommonJSResolveHack: true,
      typescript: require('typescript'),
      // objectHashIgnoreUnknownHack: true,
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    // commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    // resolve({
    //   customResolveOptions: {
    //     moduleDirectory: 'node_modules',
    //   },
    // }),
    // Resolve source maps to the original source
    // sourceMaps(),
    // minifies generated bundles
    production && terser(),
  ],
};
