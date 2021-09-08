import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {secureCookies} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('secure-cookies rule', () => {
  it('should pass when no cookies are sent', async () => {
    const mock = createHttpClientMock([{}])

    const result = await secureCookies('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should pass when a secure cookie was sent', async () => {
    const mock = createHttpClientMock([
      {'set-cookie': 'id=a3fWa; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure'}
    ])

    const result = await secureCookies('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should pass when multiple secure cookie were sent', async () => {
    const mock = createHttpClientMock([
      {
        'set-cookie': [
          'id=a3fWa; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure',
          'second=a3fWa; Secure'
        ]
      }
    ])

    const result = await secureCookies('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should produce an error when an unsecure cookie was sent', async () => {
    const mock = createHttpClientMock([
      {
        'set-cookie': [
          'id=a3fWa; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure',
          'second=a3fWa'
        ]
      }
    ])

    const result = await secureCookies('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await secureCookies('https://recognize.nl', mock, [
      'secure-cookies'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
