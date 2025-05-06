module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended', 'prettier'],
  rules: {
    'lines-around-comment': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {},
    'import/resolver': {
      node: {},
      typescript: {
        project: './jsconfig.json'
      }
    }
  },
  overrides: []
}
