import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {cors} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('cross origin resource sharing rule', () => {
  it('should throw a warning when all origins are allowed', async () => {
    const mock = createHttpClientMock([{'access-control-allow-origin': '*'}])

    const result = await cors('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when no header was found', async () => {
    const mock = createHttpClientMock([{}])

    const result = await cors('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should pass when the header contains an origin', async () => {
    const mock = createHttpClientMock([
      {'access-control-allow-origin': 'https://recognize.nl'}
    ])

    const result = await cors('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await cors('https://recognize.nl', mock, ['cors'])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
