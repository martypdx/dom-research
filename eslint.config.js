import globals from 'globals';
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import typeScriptPlugin from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    resolvePluginsRelativeTo: __dirname
});

const [config, rulesJs, rulesTs] = compat.extends('plugin:@typescript-eslint/strict-type-checked');
export default [
    // config,
    rulesJs,
    rulesTs,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: config.languageOptions.parser,
            parserOptions: {
                project: true,
                extraFileExtensions: ['.jsz'],
            },
        },
        plugins: {
            typeScriptPlugin
        },
    },
    {
        files: ['**/*.js'],
        ...js.configs.recommended
    },

    {
        linterOptions: {
            reportUnusedDisableDirectives: 'warn'
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
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
    }];
