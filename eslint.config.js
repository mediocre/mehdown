const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    {
        ignores: [
            'node_modules/*',
            'lib/index-1.0.js'
        ]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.es2020,
                ...globals.mocha,
                ...globals.node,
                //added for 'fetch()' access
                ...globals.serviceworker
            }
        },
        rules: {
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'comma-dangle': ['error', 'never'],
            'dot-notation': 'error',
            'no-array-constructor': 'error',
            'no-console': 'error',
            'no-fallthrough': 'off',
            'no-inline-comments': 'warn',
            'no-trailing-spaces': 'error',
            'no-unused-vars': ['error', { caughtErrors: 'none' }],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-function-paren': ['error', {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            }]
        }
    }
];
