import {RuleResult} from '../models/rule-result'
import {ViolationType} from '../models/violation-type'

export class ReportMarkdownConverter {
  convert(result: RuleResult[]): string {
    const base = ['| Status  | Description |', '| :---: | ------------- |']

    return [
      ...base,
      ...result.map(it => {
        let icon
        let iconTitle

        switch (it.violation) {
          case ViolationType.NONE:
            icon = '✅'
            iconTitle = 'Success'
            break
          case ViolationType.WARNING:
            icon = '⚠️'
            iconTitle = 'Warning'
            break
          case ViolationType.ERROR:
            icon = '❌'
            iconTitle = 'Failure'
            break
          default:
            icon = '⏩'
            iconTitle = 'Skipped'
        }

        return `| <div title="${iconTitle}">${icon}</div> | <div title="ID: ${it.id}">${it.description}</div> |`
      })
    ].join('\n')
  }
}
