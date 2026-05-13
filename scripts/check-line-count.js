#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')

const MAX_LINES = 200

const staged = execSync('git diff --cached --name-only --diff-filter=ACM')
  .toString()
  .trim()
  .split('\n')
  .filter((f) => /\.(ts|tsx|js|jsx)$/.test(f))

let failed = false

for (const file of staged) {
  if (!fs.existsSync(file)) continue
  const lines = fs.readFileSync(file, 'utf8').split('\n').length
  if (lines > MAX_LINES) {
    console.error(`  ✗ ${file} — ${lines} lines (max ${MAX_LINES})`)
    failed = true
  }
}

if (failed) {
  console.error('\nCommit blocked: split files above into smaller modules.\n')
  process.exit(1)
}
