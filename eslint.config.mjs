import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import tseslint from '@electron-toolkit/eslint-config-ts'
import js from '@eslint/js'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  { ...tseslint.configs.recommended, files: ['**/*.{ts,tsx}'] },
  { files: ['**/*.{js,jsx}'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.{js,jsx}'], plugins: { js }, extends: ['js/recommended'] },
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
      ...{
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ]
      },
      ...{
        '@typescript-eslint/no-explicit-any': ['off']
      }
    }
  },
  eslintConfigPrettier,
  eslintPluginJsxA11y.flatConfigs.recommended
)
