import axios, {AxiosResponse} from 'axios'

export class HttpClient {
  cache: {[key: string]: AxiosResponse} = {}

  async get<T>(url: string, headers: object = {}): Promise<AxiosResponse<T>> {
    const key = JSON.stringify({url, headers})

    if (this.cache[key]) {
      return this.cache[key]
    }

    const response = await axios.get(url, {
      headers
    })

    this.cache[key] = response

    return response
  }
}
