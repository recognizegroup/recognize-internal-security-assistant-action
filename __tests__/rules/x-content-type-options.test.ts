import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {xContentTypeOptions} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('x-content-type-options rule', () => {
  it('should produce an error when no x-content-type-options header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xContentTypeOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when the x-content-type-options header is present and allowed', async () => {
    const mock = createHttpClientMock([{'x-content-type-options': 'nosniff'}])

    const result = await xContentTypeOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when the x-content-type-options header is present but not allowed', async () => {
    const mock = createHttpClientMock([
      {'x-content-type-options': 'illegal-value'}
    ])

    const result = await xContentTypeOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xContentTypeOptions('https://recognize.nl', mock, [
      'x-content-type-options'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
