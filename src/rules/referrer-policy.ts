import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const referrerPolicy = createGenericHeaderCheck(
  'referrer-policy',
  'Referrer-Policy',
  ViolationType.ERROR,
  {
    allowedValues: ['no-referrer', 'same-origin', 'strict-origin']
  }
)
