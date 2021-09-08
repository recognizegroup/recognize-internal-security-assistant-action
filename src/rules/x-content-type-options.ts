import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const xContentTypeOptions = createGenericHeaderCheck(
  'x-content-type-options',
  'X-Content-Type-Options',
  ViolationType.WARNING,
  {
    allowedValues: ['nosniff']
  }
)
