import {expect, it, describe, jest, beforeEach} from '@jest/globals'
import {ssl} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'
import {createHttpClientMock} from '../utils/http-client-mock'
import ssllabs from 'node-ssllabs'

jest.mock('node-ssllabs', () => {
  return {scan: jest.fn()}
})

describe('ssl rule', () => {
  beforeEach(() => {
    ssllabs.scan = jest.fn()
  })

  it('should produce an error when a disallowed TLS-version was used', async () => {
    const mock = createHttpClientMock([{}])

    ssllabs.scan.mockImplementation(async (options, resolve: any) => {
      resolve(null, {
        endpoints: [
          {
            details: {
              protocols: [
                {name: 'TLS', version: '1.0'},
                {name: 'TLS', version: '1.1'},
                {name: 'TLS', version: '1.2'},
                {name: 'TLS', version: '1.3'}
              ],
              suites: []
            }
          }
        ]
      })
    })

    const result = await ssl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should produce an error when a disallowed cipher was used', async () => {
    const mock = createHttpClientMock([{}])

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

    const result = await ssl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should produce a warning when a sufficient cipher was used', async () => {
    const mock = createHttpClientMock([{}])

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
                {
                  protocol: 3,
                  list: [{name: 'TLS_DHE_RSA_WITH_AES_256_GCM_SHA384'}]
                }
              ]
            }
          }
        ]
      })
    })

    const result = await ssl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when valid TLS-versions and ciphers', async () => {
    const mock = createHttpClientMock([{}])

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
                {protocol: 4, list: [{name: 'TLS_CHACHA20_POLY1305_SHA256'}]}
              ]
            }
          }
        ]
      })
    })

    const result = await ssl('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await ssl('https://recognize.nl', mock, ['ssl'])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
