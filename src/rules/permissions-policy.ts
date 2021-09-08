import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const permissionsPolicy = createGenericHeaderCheck(
  'permissions-policy',
  'Permissions-Policy',
  ViolationType.WARNING,
  {
    present: true
  }
)
