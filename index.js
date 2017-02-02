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

function getPackageVersion (rev, cb) {
  exec('git show ' + rev + ':package.json', {
    encoding: 'utf8'
  }, function (err, diff) {
    cb(err, diff && JSON.parse(diff).version)
  })
}

function prebuild (runtime, version, cb) {
  var ps = spawn('prebuild', [
    '-b', version,
    '-u', token,
    '-r', runtime,
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

getPackageVersion('HEAD', function (err, head) {
  if (err) throw err

  getPackageVersion('HEAD~1', function (err, prev) {
    if (err) throw err
    if (head === prev) process.exit(0)

    prebuild('node', process.versions.modules, function (err, code) {
      if (err) process.exit(code)

      prebuild('electron', process.versions.modules, function (err, code) {
        process.exit(code)
      })
    })
  })
})
