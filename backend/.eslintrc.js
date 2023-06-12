module.exports = {
    extends: [
        '@sanity/eslint-config-studio',
        'airbnb-base',
    ],
    env: {
        browser: true,
        es2021: true,
    },
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'import/prefer-default-export': 'off',
        semi: ['error', 'never'],
        indent: ['error', 4],
    },
}
