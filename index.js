#!/usr/bin/env node

var exec = require('child_process').exec
var spawn = require('cross-spawn')
var npmRunPath = require('npm-run-path-compat')
var os = require('os')
var log = require('npmlog')
var version = require('./package').version
var getTarget = require('node-abi').getTarget

if (!process.env.CI) process.exit()

log.heading = 'prebuild-ci'
log.level = 'verbose'

var token = process.env.PREBUILD_TOKEN
if (!token) {
  log.error('PREBUILD_TOKEN required')
  process.exit(0)
}

function getPackageVersion (rev, cb) {
  exec('git show ' + rev + ':package.json', {
    encoding: 'utf8'
  }, function (err, diff) {
    cb(err, diff && JSON.parse(diff).version)
  })
}

function prebuild (runtime, target, cb) {
  log.info('build', runtime, 'abi', target)
  var ps = spawn('prebuild', [
    '-r', runtime,
    '-t', target,
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

log.info('begin', 'Prebuild-CI version', version)

getPackageVersion('HEAD', function (err, head) {
  if (err) throw err

  getPackageVersion('HEAD~1', function (err, prev) {
    if (err) throw err
    if (head === prev) {
      log.info('No version bump, exiting')
      process.exit(0)
    }

    prebuild('node', process.versions.modules, function (err, code) {
      if (err) process.exit(code)
      if (os.platform() !== 'linux') {
        log.info('OS not linux, skipping electron')
        process.exit(0)
      }

      try {
        getTarget(process.versions.modules, 'electron')
      } catch (err) {
        log.info('No matching electron version, exiting')
        process.exit(0)
      }

      prebuild('electron', process.versions.modules, function (err, code) {
        if (err) process.exit(code)
        log.info('All done!')
        process.exit(code)
      })
    })
  })
})
