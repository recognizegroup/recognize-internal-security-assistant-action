import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const xFrameOptions = createGenericHeaderCheck(
  'x-frame-options',
  'X-Frame-Options',
  ViolationType.WARNING,
  {
    allowedValues: ['sameorigin', 'deny']
  }
)
