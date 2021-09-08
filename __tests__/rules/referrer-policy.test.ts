import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {referrerPolicy} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('referrer-policy rule', () => {
  it('should produce an error when no referrer-policy header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await referrerPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should pass when the referrer-policy header is present and allowed', async () => {
    const mock = createHttpClientMock([{'referrer-policy': 'same-origin'}])

    const result = await referrerPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when the referrer-policy header is present but not allowed', async () => {
    const mock = createHttpClientMock([{'referrer-policy': 'illegal-value'}])

    const result = await referrerPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await referrerPolicy('https://recognize.nl', mock, [
      'referrer-policy'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
