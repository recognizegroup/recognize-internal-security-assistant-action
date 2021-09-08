import {RuleResult} from '../models/rule-result'
import {ViolationType} from '../models/violation-type'

export class ReportMarkdownConverter {
  convert(result: RuleResult[]): string {
    return result
      .map(it => {
        let icon

        switch (it.violation) {
          case ViolationType.NONE:
            icon = '✅'
            break
          case ViolationType.WARNING:
            icon = '⚠️'
            break
          case ViolationType.ERROR:
            icon = '❌'
            break
          default:
            icon = '⏩'
        }

        return `* ${icon} ${it.description}`
      })
      .join('\n')
  }
}
