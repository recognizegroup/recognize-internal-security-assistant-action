import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const cacheControl = createGenericHeaderCheck(
  'cache-control',
  'Cache-Control',
  ViolationType.WARNING,
  {
    allowedValues: ['no-store']
  }
)
