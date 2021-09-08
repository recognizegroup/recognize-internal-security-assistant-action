import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'

export const versionInformation: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'version-information'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  const response = await client.get(url)
  const headers = response.headers

  const keys: string[] = Object.keys(headers)
  const versionTest = /(\d+)\.(\d+)(\.\d+)?/i

  for (const header of keys) {
    const headerValue = headers[header]

    if (!headerValue) {
      continue
    }

    const values = typeof headerValue === 'string' ? [headerValue] : headerValue

    for (const value of values) {
      const match = value.match(versionTest)

      if (match) {
        return {
          id,
          violation: ViolationType.WARNING,
          description: `Potential version information found in header ${header} (${match[0]}).`
        }
      }
    }
  }

  return {
    id,
    violation: ViolationType.NONE,
    description: `No version information found in headers.`
  }
}
