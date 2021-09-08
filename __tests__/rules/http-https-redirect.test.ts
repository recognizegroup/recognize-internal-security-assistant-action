import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {httpHttpsRedirect} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('http-https rule', () => {
  it('should produce an error when no redirect takes place', async () => {
    const mock = createHttpClientMock([{}], 'http://recognize.nl')

    const result = await httpHttpsRedirect('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.ERROR)
  })

  it('should pass when the final url is secure', async () => {
    const mock = createHttpClientMock([{}], 'https://recognize.nl')

    const result = await httpHttpsRedirect('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await httpHttpsRedirect('https://recognize.nl', mock, [
      'http-https-redirect'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
