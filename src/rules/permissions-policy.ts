import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const permissionsPolicy = createGenericHeaderCheck(
  'permissions-policy',
  'Permissions-Policy',
  ViolationType.WARNING,
  {
    present: true
  }
)
