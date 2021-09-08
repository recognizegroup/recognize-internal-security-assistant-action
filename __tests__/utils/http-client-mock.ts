import {HttpClient} from '../../src/http/http-client'
import {AxiosResponse} from 'axios'

export function createHttpClientMock(
  headerSets: object[],
  finalUrl?: string
): HttpClient & {counter: number} {
  return {
    counter: 0,
    cache: {},

    async get(url: string, headers?: object) {
      return {
        headers: headerSets[this.counter++ % headerSets.length],
        data: null,
        request: {
          res: {
            responseUrl: finalUrl ?? url
          }
        }
      } as AxiosResponse
    }
  }
}

export function createHttpClientErrorMock(): HttpClient {
  return {
    cache: {},

    async get(url: string, headers?: object) {
      throw new Error()
    }
  }
}
