import {expect, it, describe} from '@jest/globals'
import {Rule} from '../../src/models/rule'
import {RuleResult} from '../../src/models/rule-result'
import {ViolationType} from '../../src/models/violation-type'
import {ReportMarkdownConverter} from '../../src/report/report-markdown-converter'

describe('report-markdown-converter', () => {
  it('should create a valid markdown string from a set of rules', async () => {
    const rules: RuleResult[] = [
      {id: 'one', violation: ViolationType.NONE, description: 'Test 1'},
      {id: 'two', violation: ViolationType.ERROR, description: 'Test 2'},
      {id: 'three', violation: ViolationType.WARNING, description: 'Test 3'},
      {id: 'four', violation: ViolationType.EXCLUDED, description: 'Test 4'}
    ]

    const converter = new ReportMarkdownConverter()
    const md = converter.convert(rules)

    expect(md).toBe(
      `
| Status  | Description |
| :---: | ------------- |
| ✅ | Test 1 |
| ❌ | Test 2 |
| ⚠️ | Test 3 |
| ⏩ | Test 4 |
`.trim()
    )
  })
})
