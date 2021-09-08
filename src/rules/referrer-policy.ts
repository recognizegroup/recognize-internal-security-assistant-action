import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const referrerPolicy = createGenericHeaderCheck(
  'referrer-policy',
  'Referrer-Policy',
  ViolationType.ERROR,
  {
    allowedValues: ['no-referrer', 'same-origin', 'strict-origin']
  }
)
