import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const xContentTypeOptions = createGenericHeaderCheck(
  'x-content-type-options',
  'X-Content-Type-Options',
  ViolationType.WARNING,
  {
    allowedValues: ['nosniff']
  }
)
