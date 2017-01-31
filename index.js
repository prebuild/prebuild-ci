#!/usr/bin/env node

var exec = require('child_process').exec
var spawn = require('cross-spawn')
var npmRunPath = require('npm-run-path-compat')
var minimist = require('minimist')
var os = require('os')

if (!process.env.CI) process.exit()

var token = process.env.PREBUILD_TOKEN
if (!token) {
  console.error('PREBUILD_TOKEN required')
  process.exit(0)
}

var argv = minimist(process.argv.slice(2), {
  alias: {
    electronFilter: 'electron-filter',
    electronVersions: 'electron-versions'
  }
})

function getPackageVersion (rev, cb) {
  exec('git show ' + rev + ':package.json', {
    encoding: 'utf8'
  }, function (err, diff) {
    cb(err, diff && JSON.parse(diff).version)
  })
}

function prebuild (runtime, version, cb) {
  var ps = spawn('prebuild', [
    '-b', process.version,
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

    prebuild('node', process.version, function (err, code) {
      if (err) process.exit(code)
      if (!argv.electronFilter || !argv.electronVersions) process.exit(0)
      if (typeof argv.electronFilter === 'string') {
        var args = argv.electronFilter.split(':')

        var version = args.shift()
        if (version && process.version.slice(1, 1 + version.length) !== version) {
          process.exit(0)
        }

        var platform = args.shift()
        if (platform && os.platform() !== platform) process.exit(0)

        var arch = args.shift()
        if (arch && os.arch() !== arch) process.exit(0)
      }

      var versions = argv.electronVersions.split(',')
      function next () {
        var version = versions.shift()
        if (!version) return process.exit(0)
        prebuild('electron', version, function (err, code) {
          if (err) process.exit(code)
          next()
        })
      }
      next()
    })
  })
})
