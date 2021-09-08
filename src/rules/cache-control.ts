import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const cacheControl = createGenericHeaderCheck(
  'cache-control',
  'Cache-Control',
  ViolationType.WARNING,
  {
    allowedValues: ['no-store']
  }
)
