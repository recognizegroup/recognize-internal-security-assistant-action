import {expect, it, describe} from '@jest/globals'
import {
  createHttpClientErrorMock,
  createHttpClientMock
} from '../utils/http-client-mock'
import {validSslResponse} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('valid-ssl-response rule', () => {
  it('should pass when no error occurs when fetching the page', async () => {
    const mock = createHttpClientMock([{}])

    const result = await validSslResponse('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when the response throws an error', async () => {
    const mock = createHttpClientErrorMock()

    const result = await validSslResponse('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await validSslResponse('https://recognize.nl', mock, [
      'valid-ssl-response'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
