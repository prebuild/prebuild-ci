#!/usr/bin/env node

const spawn = require('cross-spawn')
const npmRunPath = require('npm-run-path-compat')
const log = require('npmlog')
const versionChanged = require('version-changed')
const version = require('./package').version
const runSeries = require('run-series')
const supportedTargets = require('node-abi').supportedTargets
const buildTargets = require('./build-targets')
const path = require('path')
const pkg = require(path.resolve('package.json'))

if (!process.env.CI) process.exit()

log.heading = 'prebuild-ci'
log.level = 'verbose'

const token = process.env.PREBUILD_TOKEN
if (!token) {
  log.error('PREBUILD_TOKEN required')
  process.exit(0)
}

function prebuild (runtime, target, cb) {
  log.info('build', runtime, 'abi', target)
  const ps = spawn('prebuild', [
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

versionChanged(function (err, changed) {
  if (err) throw err
  if (!changed) {
    log.info('No version bump, exiting')
    process.exit(0)
  }

  const builds = buildTargets(process.versions, supportedTargets, pkg)
    .map(function (target) {
      return function (cb) {
        prebuild(target.runtime, target.target, cb)
      }
    })

  runSeries(builds, function (err) {
    if (err) process.exit(1)
    log.info('All done!')
    process.exit(0)
  })
})
