import {HttpClient} from '../http/http-client'
import {RuleResult} from './rule-result'

export type Rule = (
  url: string,
  client: HttpClient,
  excluded?: string[]
) => Promise<RuleResult>
