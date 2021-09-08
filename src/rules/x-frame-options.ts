import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const xFrameOptions = createGenericHeaderCheck(
  'x-frame-options',
  'X-Frame-Options',
  ViolationType.WARNING,
  {
    allowedValues: ['sameorigin', 'deny']
  }
)
