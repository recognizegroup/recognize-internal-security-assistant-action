import {ViolationType} from './violation-type'

export interface RuleResult {
  id: string
  violation: ViolationType
  description: string
}
