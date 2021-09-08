import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {contentSecurityPolicy} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('content-security-policy rule', () => {
  it('should produce an error when no content-security-policy header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await contentSecurityPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should pass when a valid csp was found', async () => {
    const mock = createHttpClientMock([
      {
        'content-security-policy':
          "frame-ancestors 'none'; object-src 'none'; frame-src youtube.com www.youtube.com webforms.pipedrive.com; worker-src 'none'; manifest-src 'none'; base-uri 'none'"
      }
    ])

    const result = await contentSecurityPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should throw a warning when unsafe-inline was used', async () => {
    const mock = createHttpClientMock([
      {
        'content-security-policy':
          "script-src 'unsafe-inline'; object-src 'none'; frame-src youtube.com www.youtube.com webforms.pipedrive.com; worker-src 'none'; manifest-src 'none'; base-uri 'none'"
      }
    ])

    const result = await contentSecurityPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await contentSecurityPolicy('https://recognize.nl', mock, [
      'content-security-policy'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
