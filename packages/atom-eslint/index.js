module.exports = {
  extends: [
    "eslint:recommend",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier"
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2019,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },

  plugins: ["@typescript-eslint"],

  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },

  rules: {
    "prefer-destructuring": ['error', { object: true, array: false }],

    // eslint-plugin-vue
    'vue/no-v-html': 'off',
    'vue/require-v-for-key': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/return-in-computed-property': 'off',

     // typescript-eslint
     '@typescript-eslint/naming-convention': 'off',
     '@typescript-eslint/ban-ts-comment': 'off',
     '@typescript-eslint/no-unused-vars': 'error',
     '@typescript-eslint/no-var-requires': 'off',
     '@typescript-eslint/no-explicit-any': 'off',
     '@typescript-eslint/no-empty-function': 'off',
     '@typescript-eslint/no-non-null-assertion': 'off',
     '@typescript-eslint/explicit-function-return-type': 'off',
     '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: require.resolve('vue-eslint-parser'),
    },
    {
      files: ['**/*.md/*.js', '**/*.md/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}