import {expect, it, describe} from '@jest/globals'
import {createHttpClientMock} from '../utils/http-client-mock'
import {permissionsPolicy} from '../../src/rules'
import {ViolationType} from '../../src/models/violation-type'

describe('permissions-policy rule', () => {
  it('should produce a warning when no permissions-policy header is present', async () => {
    const mock = createHttpClientMock([{}])

    const result = await permissionsPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.WARNING)
  })

  it('should pass when the permissions-policy header is present', async () => {
    const mock = createHttpClientMock([
      {
        'permissions-policy':
          'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-script=(), sync-xhr=(), usb=(), vertical-scroll=(), web-share=(), xr-spatial-tracking=()'
      }
    ])

    const result = await permissionsPolicy('https://recognize.nl', mock)
    expect(result.violation).toBe(ViolationType.NONE)
  })

  it('should be excluded when exclusion provided', async () => {
    const mock = createHttpClientMock([{}])

    const result = await permissionsPolicy('https://recognize.nl', mock, [
      'permissions-policy'
    ])
    expect(result.violation).toBe(ViolationType.EXCLUDED)
  })
})
