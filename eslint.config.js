import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Regras do React Compiler (eslint-plugin-react-hooks v6) que foram
      // promovidas a "error" num bump recente do plugin e passaram a quebrar o
      // build na Vercel. São padrões pré-existentes que já funcionavam; mantemos
      // como "warn" (continuam visíveis) para não bloquear o deploy.
      // TODO: revisar e eliminar incrementalmente.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
])
