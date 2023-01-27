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

    console.log('Application insights: ', applicationInsights)

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

    if (applicationInsights) {
      core.info('Application Insights is enabled')
    } else {
      core.info('Application Insights is disabled')
    }

    const appInsightsClient = applicationInsights?.defaultClient

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
      const result = await check(processed, client, excluded)

      core.info(`Finished check ${name}`)

      const failures = result.filter(it => it.violation === ViolationType.ERROR)
      const warnings = result.filter(
        it => it.violation === ViolationType.WARNING
      )
      const executed = result.filter(
        it => it.violation !== ViolationType.EXCLUDED
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

      appInsightsClient?.trackEvent({
        name: 'security-report',
        properties: {
          url,
          failures: failures.length,
          warnings: warnings.length,
          executed: executed.length,
          result
        }
      })

      appInsightsClient?.flush()
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
