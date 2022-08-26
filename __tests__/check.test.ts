import {test, jest, expect, beforeEach, describe} from '@jest/globals'
import ssllabs from 'node-ssllabs'
import {createHttpClientMock} from './utils/http-client-mock'
import {check} from '../src/check'
import {ViolationType} from '../src/models/violation-type'

jest.mock('node-ssllabs', () => {
  return {scan: jest.fn()}
})

describe('check function', () => {
  beforeEach(() => {
    ssllabs.scan = jest.fn()
  })

  test('should produce a valid report', async () => {
    const mock = createHttpClientMock(
      [
        {
          'cache-control': 'no-store',
          'x-powered-by': 'nginx 1.123.3',
          'access-control-allow-origin': '*',
          'set-cookie': 'test=a',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'no-referrer',
          'x-frame-options': 'sameorigin'
        }
      ],
      'https://recognize.nl'
    )

    ssllabs.scan.mockImplementation(async (options, resolve: any) => {
      resolve(null, {
        endpoints: [
          {
            details: {
              protocols: [
                {id: 3, name: 'TLS', version: '1.2'},
                {id: 4, name: 'TLS', version: '1.3'}
              ],
              suites: [
                {protocol: 3, list: [{name: 'TLS_RSA_WITH_AES_128_CBC_SHA256'}]}
              ]
            }
          }
        ]
      })
    })

    const result = await check('https://recognize.nl', mock, [])
    expect(result).toEqual(
      expect.arrayContaining([
        {id: 'valid-ssl-response', violation: 0, description: 'Valid SSL-url.'},
        {
          id: 'referrer-policy',
          violation: 0,
          description:
            'Header Referrer-Policy has the correct value no-referrer.'
        },
        {
          id: 'x-frame-options',
          violation: 0,
          description:
            'Header X-Frame-Options has the correct value sameorigin.'
        },
        {
          id: 'x-content-type-options',
          violation: 0,
          description:
            'Header X-Content-Type-Options has the correct value nosniff.'
        },
        {
          id: 'x-xss-protection',
          violation: 2,
          description: 'Header X-XSS-Protection not found in the response.'
        },
        {
          id: 'permissions-policy',
          violation: 1,
          description: 'Header Permissions-Policy not found in the response.'
        },
        {
          id: 'cache-control',
          violation: 0,
          description: 'Header Cache-Control has the correct value no-store.'
        },
        {
          id: 'strict-transport-security',
          violation: 2,
          description:
            'Header Strict-Transport-Security not found in the response.'
        },
        {
          id: 'http-https-redirect',
          violation: 0,
          description: 'Non-HTTPs traffic is redirected to HTTPS'
        },
        {
          id: 'content-security-policy',
          violation: 2,
          description:
            'Header Content-Security-Policy not found in the response.'
        },
        {
          id: 'ssl',
          violation: 2,
          description:
            'The following cipher suites are not allowed to be used: TLS_RSA_WITH_AES_128_CBC_SHA256.'
        },
        {
          id: 'version-information',
          violation: 1,
          description:
            'Potential version information found in header x-powered-by (1.123.3).'
        },
        {
          id: 'cors',
          violation: 1,
          description:
            'Header Access-Control-Allow-Origin has an invalid value *.'
        },
        {
          id: 'secure-cookies',
          violation: 2,
          description: 'Insecure cookies test found.'
        }
      ])
    )
  })
})
