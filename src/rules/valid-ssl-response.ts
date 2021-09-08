import {ViolationType} from '../models/violation-type'
import {Rule} from '../models/rule'
import {HttpClient} from '../http/http-client'
import {checkExcluded} from './check-excluded'

export const validSslResponse: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'valid-ssl-response'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  try {
    await client.get(url)
  } catch (error) {
    return {
      id,
      violation: ViolationType.ERROR,
      description: `Unable to receive a (secure) response.`
    }
  }

  return {
    id,
    violation: ViolationType.NONE,
    description: `Valid SSL-url.`
  }
}
