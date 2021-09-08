import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const xXssProtection = createGenericHeaderCheck(
  'x-xss-protection',
  'X-XSS-Protection',
  ViolationType.ERROR,
  {
    allowedValues: ['1; mode=block']
  }
)
