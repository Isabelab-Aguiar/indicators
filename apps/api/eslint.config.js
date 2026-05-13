const nestConfig = require('@repo/eslint-config/nest')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [{ ignores: ['dist/**', 'node_modules/**'] }, ...nestConfig]
