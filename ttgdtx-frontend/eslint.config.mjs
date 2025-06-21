import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': 'off',
      'import/first': 'off',
    },
  },
)
