import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'

export const httpHttpsRedirect: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'http-https-redirect'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  try {
    const nonHttps = url.replace('https://', 'http://')
    const response = await client.get(nonHttps)
    const finalUrl: string = response.request.res.responseUrl

    if (!finalUrl.startsWith('https://')) {
      return {
        id,
        violation: ViolationType.ERROR,
        description: `Non-HTTPs traffic is not redirected to HTTPS`
      }
    }
  } catch (error) {
    return {
      id,
      violation: ViolationType.ERROR,
      description: `Non-HTTPs traffic is not redirected to HTTPS but resulted in an error`
    }
  }

  return {
    id,
    violation: ViolationType.NONE,
    description: `Non-HTTPs traffic is redirected to HTTPS`
  }
}
