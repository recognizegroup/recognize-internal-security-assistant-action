import {ViolationType} from '../models/violation-type'
import {createGenericHeaderCheck} from './header-check'

export const cors = createGenericHeaderCheck(
  'cors',
  'Access-Control-Allow-Origin',
  ViolationType.WARNING,
  {
    disallowedValues: ['*']
  }
)
