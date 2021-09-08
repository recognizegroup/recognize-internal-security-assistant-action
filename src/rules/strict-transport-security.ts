import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const strictTransportSecurity = createGenericHeaderCheck(
  'strict-transport-security',
  'Strict-Transport-Security',
  ViolationType.ERROR,
  {
    present: true
  }
)
