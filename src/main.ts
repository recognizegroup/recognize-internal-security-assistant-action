import * as core from '@actions/core'
import * as github from '@actions/github'
import {HttpClient} from './http/http-client'
import {ReportMarkdownConverter} from './report/report-markdown-converter'
import {ViolationType} from './models/violation-type'
import {check} from './check'
import * as applicationLibrary from 'applicationinsights'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})
    const octokit = github.getOctokit(token)

    const applicationInsightsConnectionString = core.getInput(
      'reporting-application-insights-connection-string',
      {required: false}
    )

    const applicationInsights = applicationInsightsConnectionString
      ? applicationLibrary
      : undefined

    applicationInsights
      ?.setup(applicationInsightsConnectionString)
      .setAutoDependencyCorrelation(false)
      .setAutoCollectRequests(false)
      .setAutoCollectPerformance(false, false)
      .setAutoCollectExceptions(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectConsole(false)
      .setUseDiskRetryCaching(false)
      .setSendLiveMetrics(false)
      .start()

    const appInsightsClient = applicationInsights?.defaultClient

    if (applicationInsights) {
      core.info('Application Insights is enabled')
      appInsightsClient!.config.maxBatchSize = 1
    } else {
      core.info('Application Insights is disabled')
    }

    const urls: string = core.getInput('urls')
    const excluded: string[] = core
      .getInput('excluded')
      .split(',')
      .map(it => it.trim())

    for (const url of urls.split(',')) {
      const processed = url.trim()
      const name = `Recognize Internal Security Assistant (${processed})`

      core.info(`Creating check run ${name}`)

      const createdCheck = await octokit.rest.checks.create({
        head_sha: github.context.sha,
        name,
        status: 'in_progress',
        output: {
          title: name,
          summary: ''
        },
        ...github.context.repo
      })

      const client = new HttpClient()
      let result

      try {
        result = await check(processed, client, excluded)
      } catch (error: any) {
        core.setFailed(error.message)

        await octokit.rest.checks.update({
          check_run_id: createdCheck.data.id,
          conclusion: 'failure',
          status: 'completed',
          output: {
            title: `${name}`,
            summary: 'The scan resulted in an error.',
            text: error.message
          },
          ...github.context.repo
        })
        continue
      }

      core.info(`Finished check ${name}`)

      const failures = result.filter(it => it.violation === ViolationType.ERROR)
      const warnings = result.filter(
        it => it.violation === ViolationType.WARNING
      )
      const executed = result.filter(
        it => it.violation !== ViolationType.EXCLUDED
      )
      const passed = result.filter(it => it.violation === ViolationType.NONE)
      const skipped = result.filter(
        it => it.violation === ViolationType.EXCLUDED
      )

      const isFailed = failures.length > 0
      const conclusion = isFailed ? 'failure' : 'success'

      const reporter = new ReportMarkdownConverter()
      const summary = `The scan resulted in ${failures.length} failures, ${warnings.length} warnings. A total of ${executed.length} checks were executed.`

      await octokit.rest.checks.update({
        check_run_id: createdCheck.data.id,
        conclusion,
        status: 'completed',
        output: {
          title: `${name}`,
          summary,
          text: reporter.convert(result)
        },
        ...github.context.repo
      })

      const convertKey = (str: string): string => {
        str = str.replace(/-/g, ' ')
        str = str.replace(/\w\S*/g, txt => {
          return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        })

        return str
      }

      const convertValue = (violation: ViolationType): string => {
        switch (violation) {
          case ViolationType.NONE:
            return 'Passed'
          case ViolationType.WARNING:
            return 'Warning'
          case ViolationType.ERROR:
            return 'Failed'
          case ViolationType.EXCLUDED:
            return 'Skipped'
          default:
            return 'Unknown'
        }
      }

      appInsightsClient?.trackEvent({
        name: 'security-report-value-item',
        properties: {
          url,
          failures: failures.length,
          warnings: warnings.length,
          executed: executed.length,
          passed: passed.length,
          skipped: skipped.length,
          report: Object.fromEntries(
            result.map(it => [convertKey(it.id), convertValue(it.violation)])
          )
        }
      })

      appInsightsClient?.flush()
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
