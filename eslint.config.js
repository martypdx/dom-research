import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        linterOptions: {
            reportUnusedDisableDirectives: 'warn'
        },
        languageOptions: {
            globals: {
                ...globals.browser
            },
        },
        rules: {
            eqeqeq: [
                'error',
                'always'
            ],
            'no-console': 'off',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    ignoreComments: true
                }
            ],
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            'no-multi-spaces': [
                'error',
                {
                    ignoreEOLComments: true
                }
            ],
            'new-cap': [
                'error',
                {
                    capIsNew: false
                }
            ],
            'no-redeclare': [
                'error',
                {
                    builtinGlobals: true
                }
            ],
            semi: [
                'error',
                'always'
            ],
            'space-in-parens': [
                'error'
            ],
            'space-infix-ops': 'error',
            'object-curly-spacing': [
                'error',
                'always'
            ],
            'comma-spacing': 'error',
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                    overrides: {
                        if: {
                            after: false
                        },
                        for: {
                            after: false
                        },
                        while: {
                            after: false
                        },
                        switch: {
                            after: false
                        }
                    }
                }
            ],
            'array-bracket-spacing': 'error',
            'no-unused-vars': 'off'
        }
    }
];

