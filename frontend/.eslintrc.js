module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir : __dirname,
        sourceType: 'module',
    },
    plugins: [],
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        node: false,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'no-restricted-globals': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
