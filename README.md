# Recognize Internal Security Assistant

This action performs a set of basic web server setting checks, and generates a report which is attached to the current commit.
Currently, the tool checks for:

* `Cache-Control` header
* `Content-Security-Policy` header
* CORS settings
* HTTP to HTTPS redirect
* `Permissions-Policy` header
* `Referrer-Policy` header
* Secure cookies
* SSL settings (protocol versions, ciphers)
* `Strict-Transport-Security` header
* Version Information in headers
* `X-Content-Type-Options` heaader
* `X-XSS-Protection` header

## Example
```yaml
on:
  push:
    branches: [develop]
jobs:
  security-report:
    runs-on: ubuntu-latest
    steps:
      - uses: recognizegroup/recognize-internal-security-assistant-action@v1
        with:
          urls: https://recognize.nl            # URLs to test (comma separated)
          token: ${{ github.token }}            # Token for the GitHub API
          excluded: ''                          # IDs of the rules to exclude
```

## Screenshot
