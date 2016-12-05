#!/usr/bin/env node

var execSync = require('child_process').execSync
var spawn = require('cross-spawn')
var npmRunPath = require('npm-run-path-compat')

if (!process.env.CI) process.exit()

var token = process.env.PREBUILD_TOKEN
if (!token) {
  console.error('PREBUILD_TOKEN required')
  process.exit(1)
}

function version (rev) {
  var diff = execSync('git show ' + rev + ':package.json', {
    encoding: 'utf8'
  })
  if (!diff) return
  return JSON.parse(diff).version
}

if (version('HEAD') === version('HEAD~1')) process.exit(0)

var ps = spawn('prebuild', [
  '-b', process.version,
  '-u', token
], {
  env: npmRunPath.env()
})
ps.stdout.pipe(process.stdout)
ps.stderr.pipe(process.stderr)
ps.on('exit', function (code) {
  process.exit(code)
})
