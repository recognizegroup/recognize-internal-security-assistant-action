import {HttpClient} from '../http/http-client'
import {Rule} from '../models/rule'
import {ViolationType} from '../models/violation-type'
import {checkExcluded} from './check-excluded'
import config from '../config'
import ssllabs from 'node-ssllabs'

export const ssl: Rule = async (
  url: string,
  client: HttpClient,
  excluded: string[] = []
) => {
  const id = 'ssl'

  let exclusionResult
  if ((exclusionResult = checkExcluded(id, excluded)) !== null) {
    return exclusionResult
  }

  try {
    const result = await scan(url)
    const endpoint = result.endpoints[0]
    const tlsProtocols = endpoint.details.protocols.filter(
      protocol => protocol.name === 'TLS'
    )

    const usedDisallowedVersions = tlsProtocols
      .map(it => it.version)
      .filter(it => config.disallowedTLSVersions.includes(it))

    if (usedDisallowedVersions.length > 0) {
      return {
        id,
        violation: ViolationType.ERROR,
        description: `TLS-version(s) ${usedDisallowedVersions
          .map(it => `v${it}`)
          .join(', ')} are not allowed and should not be supported.`
      }
    }

    const suites = endpoint.details.suites
      .flatMap(it => {
        const protocol = tlsProtocols.find(p => p.id === it.protocol)

        if (config.disallowedTLSVersions.includes(protocol.version)) {
          return []
        } else {
          return it.list
        }
      })
      .map(it => it.name)

    const disallowedCipherSuites = suites.filter(
      it =>
        !config.ciphers.good.includes(it) &&
        !config.ciphers.sufficient.includes(it)
    )
    const warningCipherSuites = suites.filter(it =>
      config.ciphers.sufficient.includes(it)
    )

    if (disallowedCipherSuites.length > 0) {
      return {
        id,
        violation: ViolationType.ERROR,
        description: `The following cipher suites are not allowed to be used: ${disallowedCipherSuites.join(
          ', '
        )}.`
      }
    }

    if (warningCipherSuites.length > 0) {
      return {
        id,
        violation: ViolationType.WARNING,
        description: `The following cipher suites should be avoided and only used for backward compatibility reasons: ${warningCipherSuites.join(
          ', '
        )}.`
      }
    }

    return {
      id,
      violation: ViolationType.NONE,
      description: `Valid SSL settings.`
    }
  } catch (error: any) {
    return {
      id,
      violation: ViolationType.ERROR,
      description: `Invalid SSL settings. reason: ${error.message}`
    }
  }
}

const scan = (url: string): any => {
  return new Promise((resolve, reject) => {
    ssllabs.scan(
      {
        host: url,
        fromCache: true,
        maxAge: 24
      },
      (err, host) => {
        if (err) {
          reject(err)
        } else {
          resolve(host)
        }
      }
    )
  })
}
