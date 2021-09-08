import {createGenericHeaderCheck} from './header-check'
import {ViolationType} from '../models/violation-type'

export const cors = createGenericHeaderCheck(
  'cors',
  'Access-Control-Allow-Origin',
  ViolationType.WARNING,
  {
    disallowedValues: ['*']
  }
)
