const nextConfig = require('@repo/eslint-config/next')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  { ignores: ['.next/**', 'node_modules/**'] },
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
]
