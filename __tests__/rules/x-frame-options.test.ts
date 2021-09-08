import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {xFrameOptions} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('x-frame-options rule', () => {
  it('should produce an error when no x-frame-options header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xFrameOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when the x-frame-options header is present and allowed', async () => {
    const mock = createHttpClientMock([{'x-frame-options': 'sameorigin'}])

    const result = await xFrameOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when the x-frame-options header is present but not allowed', async () => {
    const mock = createHttpClientMock([{'x-frame-options': 'illegal-value'}])

    const result = await xFrameOptions('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await xFrameOptions('https://recognize.nl', mock, [
      'x-frame-options'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
