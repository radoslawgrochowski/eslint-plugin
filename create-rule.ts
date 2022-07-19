import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  name => `https://www.google.com/search?q=%22%40radoslawgrochowski%2Feslint-plugin%22+${name}`
)

export default createRule
