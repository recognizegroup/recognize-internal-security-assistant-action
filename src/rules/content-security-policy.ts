import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'
import parse from 'content-security-policy-parser'

export const contentSecurityPolicy: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'content-security-policy'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  const response = await client.get(url)
  const headers = response.headers
  const headerName = 'Content-Security-Policy'
  const headerValue = headers[headerName.toLowerCase()]

  if (!headerValue) {
    return {
      id,
      violation: ViolationType.ERROR,
      description: `Header ${headerName} not found in the response.`
    }
  }

  const cspResult = parse(headerValue)

  const keys = Object.keys(cspResult)
  for (const key of keys) {
    const value = cspResult[key]

    if (value.includes("'unsafe-inline'")) {
      return {
        id,
        violation: ViolationType.WARNING,
        description: `${headerName} should not contain 'unsafe-inline', unless explicitly required.`
      }
    } else if (value.includes("'unsafe-eval'")) {
      return {
        id,
        violation: ViolationType.WARNING,
        description: `${headerName} should not contain 'unsafe-eval', unless explicitly required.`
      }
    }
  }

  return {
    id,
    violation: ViolationType.NONE,
    description: `Valid ${headerName} found.`
  }
}
