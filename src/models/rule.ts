import {RuleResult} from './rule-result'
import {HttpClient} from '../http/http-client'

export type Rule = (
  url: string,
  client: HttpClient,
  excluded?: string[]
) => Promise<RuleResult>
