import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {strictTransportSecurity} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('strict-transport-security rule', () => {
  it('should produce an error when no strict-transport-security header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await strictTransportSecurity('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should pass when the strict-transport-security header is present', async () => {
    const mock = createHttpClientMock([
      {'strict-transport-security': ' max-age=2592000'}
    ])

    const result = await strictTransportSecurity('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await strictTransportSecurity('https://recognize.nl', mock, [
      'strict-transport-security'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
