import { Linter } from '@typescript-eslint/utils/dist/ts-eslint'
import rules from './rules'

const plugin: Linter.Plugin = { rules }

export = { ...plugin }
