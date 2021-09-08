import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {versionInformation} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('version-information rule', () => {
  it('should produce a warning when a header contains version information', async () => {
    const mock = createHttpClientMock([{'X-Powered-By': 'PHP-8.0'}])

    const result = await versionInformation('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should produce a warning when a header contains version information (3 digits0', async () => {
    const mock = createHttpClientMock([{'X-Powered-By': 'PHP-8.0.1'}])

    const result = await versionInformation('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when no version was detected', async () => {
    const mock = createHttpClientMock([{'X-Powered-By': 'PHP'}])

    const result = await versionInformation('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await versionInformation('https://recognize.nl', mock, [
      'version-information'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
