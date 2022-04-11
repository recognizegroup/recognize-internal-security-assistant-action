import * as core from '@actions/core'
import * as github from '@actions/github'
import {HttpClient} from './http/http-client'
import {Octokit} from '@octokit/rest'
import {ReportMarkdownConverter} from './report/report-markdown-converter'
import {ViolationType} from './models/violation-type'
import {check} from './check'
import {createAppAuth} from '@octokit/auth-app'

async function run(): Promise<void> {
  try {
    const githubAppId = core.getInput('github-app-id', {required: true})
    const githubAppInstallationId = core.getInput(
      'github-app-installation-id',
      {required: true}
    )
    const githubAppPrivateKey = core.getInput('github-app-private-key', {
      required: true
    })

    const authData = {
      appId: githubAppId,
      privateKey: githubAppPrivateKey,
      installationId: githubAppInstallationId
    }

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: authData
    })

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
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
