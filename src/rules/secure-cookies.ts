import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'

export const secureCookies: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'secure-cookies'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  const response = await client.get(url)
  const headers = response.headers

  const cookieHeader = headers['set-cookie']
  const setCookies = cookieHeader
    ? typeof cookieHeader === 'string'
      ? [cookieHeader]
      : cookieHeader
    : []

  for (const cookieString of setCookies) {
    const cookieParts = cookieString
      .split(';')
      .map(it => it.trim().toLowerCase())

    if (!cookieParts.includes('secure')) {
      const cookie = cookieParts[0] ?? ''
      const name = cookie.split('=')[0]

      return {
        id,
        violation: ViolationType.ERROR,
        description: `Insecure cookie ${name} found.`
      }
    }
  }

  return {
    id,
    violation: ViolationType.NONE,
    description: `No insecure cookies found.`
  }
}
