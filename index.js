#!/usr/bin/env node

var exec = require('child_process').exec
var spawn = require('cross-spawn')
var npmRunPath = require('npm-run-path-compat')

if (!process.env.CI) process.exit()

var token = process.env.PREBUILD_TOKEN
if (!token) {
  console.error('PREBUILD_TOKEN required')
  process.exit(0)
}

function version (rev, cb) {
  exec('git show ' + rev + ':package.json', {
    encoding: 'utf8'
  }, function (err, diff) {
    cb(err, diff && JSON.parse(diff).version)
  })
}

function prebuild (cb) {
  var ps = spawn('prebuild', [
    '-b', process.version,
    '-u', token,
    '--verbose'
  ], {
    env: npmRunPath.env()
  })
  ps.stdout.pipe(process.stdout)
  ps.stderr.pipe(process.stderr)
  ps.on('exit', function (code) {
    if (code) return cb(Error(), code)
    cb()
  })
}

version('HEAD', function (err, head) {
  if (err) throw err
  version('HEAD~1', function (err, prev) {
    if (err) throw err
    if (head === prev) process.exit(0)

    prebuild(function (err, code) {
      if (err) return process.exit(code)
    })
  })
})
