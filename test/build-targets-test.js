'use strict'

const test = require('tape')
const buildTargets = require('../build-targets')

const supportedTargets = [
  { runtime: 'node', target: '5.0.0', abi: '47', lts: false },
  { runtime: 'node', target: '6.0.0', abi: '48', lts: false },
  { runtime: 'node', target: '7.0.0', abi: '51', lts: false },
  { runtime: 'node', target: '8.0.0', abi: '57', lts: true },
  { runtime: 'node', target: '9.0.0', abi: '59', lts: false },
  { runtime: 'node', target: '10.0.0', abi: '64', lts: true },
  { runtime: 'node', target: '11.0.0', abi: '67', lts: false },
  { runtime: 'electron', target: '0.36.0', abi: '47', lts: false },
  { runtime: 'electron', target: '1.1.0', abi: '48', lts: false },
  { runtime: 'electron', target: '1.3.0', abi: '49', lts: false },
  { runtime: 'electron', target: '1.4.0', abi: '50', lts: false },
  { runtime: 'electron', target: '1.5.0', abi: '51', lts: false },
  { runtime: 'electron', target: '1.6.0', abi: '53', lts: false },
  { runtime: 'electron', target: '1.7.0', abi: '54', lts: false },
  { runtime: 'electron', target: '1.8.0', abi: '57', lts: false },
  { runtime: 'electron', target: '2.0.0', abi: '57', lts: false },
  { runtime: 'electron', target: '3.0.0', abi: '64', lts: false },
  { runtime: 'electron', target: '4.0.0', abi: '64', lts: false },
  { runtime: 'electron', target: '4.0.4', abi: '69', lts: false }
]

test('build targets using Node 6 (ABI 48)', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '6.0.0', modules: '48' }, supportedTargets, {})
  t.deepEqual(targets, [
    { runtime: 'node', abi: '48', target: '6.0.0' },
    { runtime: 'electron', abi: '48', target: '1.1.0' },
    { runtime: 'electron', abi: '49', target: '1.3.0' },
    { runtime: 'electron', abi: '50', target: '1.4.0' },
    { runtime: 'electron', abi: '53', target: '1.6.0' },
    { runtime: 'electron', abi: '54', target: '1.7.0' },
    { runtime: 'electron', abi: '69', target: '4.0.4' }
  ])
})

test('build targets using Node 8 (ABI 57)', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '8.0.0', modules: '57' }, supportedTargets, {})
  t.deepEqual(targets, [
    { runtime: 'node', abi: '57', target: '8.0.0' },
    { runtime: 'electron', abi: '57', target: '1.8.0' },
    { runtime: 'electron', abi: '57', target: '2.0.0' },
    { runtime: 'electron', abi: '69', target: '4.0.4' }
  ])
})

test('build targets using Node 10 (ABI 64)', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '10.0.0', modules: '64' }, supportedTargets, {})
  t.deepEqual(targets, [
    { runtime: 'node', abi: '64', target: '10.0.0' },
    { runtime: 'electron', abi: '64', target: '3.0.0' },
    { runtime: 'electron', abi: '64', target: '4.0.0' },
    { runtime: 'electron', abi: '69', target: '4.0.4' }
  ])
})

test('build targets using Node 11 (ABI 67)', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '11.0.0', modules: '67' }, supportedTargets, {})
  t.deepEqual(targets, [
    { runtime: 'node', abi: '67', target: '11.0.0' },
    { runtime: 'electron', abi: '69', target: '4.0.4' }
  ])
})

test('build targets using Node 12 (ABI 72)', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '12.0.0', modules: '72' }, supportedTargets, {})
  t.deepEqual(targets, [
    { runtime: 'node', abi: '72', target: '12.0.0' }
  ])
})

test('build napi targets when napi_versions found', function (t) {
  t.plan(1)
  const targets = buildTargets({ node: '10.0.0', modules: '64' }, supportedTargets, {
    binary: {
      napi_versions: [3, 4]
    }
  })
  t.deepEqual(targets, [
    { runtime: 'node', abi: '64', target: '10.0.0' },
    { runtime: 'electron', abi: '64', target: '3.0.0' },
    { runtime: 'electron', abi: '64', target: '4.0.0' },
    { runtime: 'electron', abi: '69', target: '4.0.4' },
    { runtime: 'napi', target: '3' },
    { runtime: 'napi', target: '4' }
  ])
})
