import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {cacheControl} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('cache-control rule', () => {
  it('should produce a warning when no cache-control header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await cacheControl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should produce a warning when an invalid value is used', async () => {
    const mock = createHttpClientMock([{'cache-control': 'invalid'}])

    const result = await cacheControl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass on no-store', async () => {
    const mock = createHttpClientMock([{'cache-control': 'no-store'}])

    const result = await cacheControl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await cacheControl('https://recognize.nl', mock, [
      'cache-control'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
