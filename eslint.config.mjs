import js from '@eslint/js'
import globals from 'globals'

export default [
   js.configs.recommended,
   {
      languageOptions: {
         globals: {
         ...globals.node,
         process: 'readonly',
         __dirname: 'readonly'
         }
      },
      rules: {
         'no-console': 'off',

         'eqeqeq': 'error',
         'no-trailing-spaces': 'error',
         'object-curly-spacing': ['error', 'always'],
         'arrow-spacing': ['error', { 'before': true, 'after': true }]
      }
   },
   {
      ignores: ['dist', 'build', 'node_modules']
   }
]