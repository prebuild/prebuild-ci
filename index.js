#!/usr/bin/env node
'use strict'

const spawn = require('cross-spawn')
const npmRunPath = require('npm-run-path-compat')
const versionChanged = require('version-changed')
const runSeries = require('run-series')
const supportedTargets = require('node-abi').supportedTargets
const buildTargets = require('./build-targets')
const path = require('path')
const pkg = require(path.resolve('package.json'))

if (!process.env.CI) process.exit()

const token = process.env.PREBUILD_TOKEN
if (!token) {
  console.error('[prebuild-ci] Skipping: PREBUILD_TOKEN required.')
  process.exit(0)
}

function prebuild (runtime, target, cb) {
  console.log('[prebuild-ci] Build %s abi %s', runtime, target)
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

versionChanged(function (err, changed) {
  if (err) throw err
  if (!changed) {
    console.error('[prebuild-ci] Skipping: no version bump.')
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
    process.exit(0)
  })
})
