import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const xXssProtection = createGenericHeaderCheck(
  'x-xss-protection',
  'X-XSS-Protection',
  ViolationType.ERROR,
  {
    allowedValues: ['1; mode=block']
  }
)
