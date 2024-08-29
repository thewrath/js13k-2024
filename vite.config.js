import { compression } from 'vite-plugin-compression2'

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    compression()
  ],
  base: '/js13k-2024/',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        ecma: 2020,
        inline: 3,
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        pure_funcs: ['console.log'],
        reduce_vars: true,
        collapse_vars: true,
        dead_code: true,
        conditionals: true,
        evaluate: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
        toplevel: true,
      },
      output: {
        comments: false,
      }
    },
    rollupOptions: {
      treeshake: {
        preset: "smallest",
        moduleSideEffects: true
      }
    },
  },
}