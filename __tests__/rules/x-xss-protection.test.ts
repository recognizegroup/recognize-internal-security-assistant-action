import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {xXssProtection} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('x-xss-protection rule', () => {
  it('should produce an error when no x-xss-protection header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xXssProtection('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should pass when the x-xss-protection header is present and allowed', async () => {
    const mock = createHttpClientMock([{'x-xss-protection': '1; mode=block'}])

    const result = await xXssProtection('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when the x-xss-protection header is present but not allowed', async () => {
    const mock = createHttpClientMock([{'x-xss-protection': 'illegal-value'}])

    const result = await xXssProtection('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xXssProtection('https://recognize.nl', mock, [
      'x-xss-protection'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
