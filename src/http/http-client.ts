// eslint-disable-next-line import/named
import axios, {AxiosResponse} from 'axios'

export class HttpClient {
  cache: {[key: string]: AxiosResponse} = {}

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    const key = JSON.stringify({url})

    if (this.cache[key]) {
      return this.cache[key]
    }

    const response = await axios.get(url)

    this.cache[key] = response

    return response
  }
}
