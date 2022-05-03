import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'

export const createGenericHeaderCheck = (
  id: string,
  headerName: string,
  violation: ViolationType,
  {
    allowedValues,
    present,
    disallowedValues
  }: {allowedValues?: string[]; present?: boolean; disallowedValues?: string[]}
): Rule => {
  return async (url: string, client: HttpClient, excluded: string[] = []) => {
    let exclusionResult
    if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
      return exclusionResult
    }

    const response = await client.get(url)
    const headers = response.headers
    const value = headers[headerName.toLowerCase()]

    if (allowedValues) {
      const lowerCased = allowedValues.map(it => it.toLowerCase())

      if (!value) {
        return {
          id,
          violation,
          description: `Header ${headerName} not found in the response.`
        }
      } else if (!lowerCased.includes(value.toLowerCase())) {
        return {
          id,
          violation,
          description: `Header ${headerName} has an invalid value ${value}. Allowed values are: ${allowedValues.join(
            ', '
          )}.`
        }
      } else {
        return {
          id,
          violation: ViolationType.NONE,
          description: `Header ${headerName} has the correct value ${value}.`
        }
      }
    } else if (disallowedValues) {
      const lowerCased = disallowedValues.map(it => it.toLowerCase())

      if (value && lowerCased.includes(value.toLowerCase())) {
        return {
          id,
          violation,
          description: `Header ${headerName} has an invalid value ${value}.`
        }
      } else {
        return {
          id,
          violation: ViolationType.NONE,
          description: `Header ${headerName} has the correct value or is not available.`
        }
      }
    } else if (present) {
      if (!value) {
        return {
          id,
          violation,
          description: `Header ${headerName} not found in the response.`
        }
      } else {
        return {
          id,
          violation: ViolationType.NONE,
          description: `Header ${headerName} is present.`
        }
      }
    }

    return {
      id,
      violation,
      description: `Unknown`
    }
  }
}
