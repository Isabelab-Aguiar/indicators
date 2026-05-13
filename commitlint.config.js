/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'subject-ascii-only': ({ subject }) => {
          const ok = /^[\x00-\x7F]*$/.test(subject ?? '')
          return [ok, 'commit subject must be written in English (no accented characters)']
        },
      },
    },
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'revert'],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 5],
    'subject-case': [2, 'never', ['upper-case', 'start-case', 'pascal-case']],
    'subject-ascii-only': [2, 'always'],
  },
}
