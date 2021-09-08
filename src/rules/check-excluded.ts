import {RuleResult} from '../models/rule-result'
import {ViolationType} from '../models/violation-type'

export const checkExcluded = (
  id: string,
  excluded: string[]
): RuleResult | null =>
  excluded.includes(id)
    ? {
        id,
        violation: ViolationType.EXCLUDED,
        description: `Rule ${id} excluded.`
      }
    : null
