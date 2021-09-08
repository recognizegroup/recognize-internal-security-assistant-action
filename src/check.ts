import {HttpClient} from './http/http-client'
import * as rules from './rules'
import {RuleResult} from './models/rule-result'

export async function check(
  url: string,
  client: HttpClient,
  excluded: string[]
): Promise<RuleResult[]> {
  if (!url.startsWith('https://')) {
    throw new Error('An URL should start with https://')
  }

  const checkRules = Object.values(rules)

  return await Promise.all(
    checkRules.map(async rule => rule(url, client, excluded))
  )
}
