import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const strictTransportSecurity = createGenericHeaderCheck(
  'strict-transport-security',
  'Strict-Transport-Security',
  ViolationType.ERROR,
  {
    present: true
  }
)
