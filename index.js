#!/usr/bin/env node

var spawn = require('cross-spawn')
var fs = require('fs')
var npmRunPath = require('npm-run-path-compat')
var log = require('npmlog')
var versionChanged = require('version-changed')
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
var isCMake = fs.existsSync('./CMakeLists.txt')
function prebuild (runtime, target, cb) {
  log.info('build', runtime, 'abi', target)
  var ps = spawn('prebuild', [
    '-r', runtime,
    '-t', target,
    '-u', token,
    '--backend', isCMake ? 'cmake-js' : 'node-gyp',
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

versionChanged(function (err, changed) {
  if (err) throw err
  if (!changed) {
    log.info('No version bump, exiting')
    process.exit(0)
  }

  prebuild('node', process.versions.modules, function (err, code) {
    if (err) process.exit(code)

    log.info('build', 'Trying oddball electron versions')
    prebuild('electron', '50', function () {
      prebuild('electron', '53', function () {
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
})
