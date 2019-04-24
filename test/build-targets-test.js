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
  const targets = buildTargets('48', supportedTargets)
  t.deepEqual(targets, [
    { runtime: 'node', abi: '48' },
    { runtime: 'electron', abi: '48' },
    { runtime: 'electron', abi: '49' },
    { runtime: 'electron', abi: '50' },
    { runtime: 'electron', abi: '53' },
    { runtime: 'electron', abi: '54' },
    { runtime: 'electron', abi: '69' }
  ])
})

test('build targets using Node 8 (ABI 57)', function (t) {
  t.plan(1)
  const targets = buildTargets('57', supportedTargets)
  t.deepEqual(targets, [
    { runtime: 'node', abi: '57' },
    { runtime: 'electron', abi: '57' },
    { runtime: 'electron', abi: '69' }
  ])
})

test('build targets using Node 10 (ABI 64)', function (t) {
  t.plan(1)
  const targets = buildTargets('64', supportedTargets)
  t.deepEqual(targets, [
    { runtime: 'node', abi: '64' },
    { runtime: 'electron', abi: '64' },
    { runtime: 'electron', abi: '69' }
  ])
})

test('build targets using Node 11 (ABI 67)', function (t) {
  t.plan(1)
  const targets = buildTargets('67', supportedTargets)
  t.deepEqual(targets, [
    { runtime: 'node', abi: '67' },
    { runtime: 'electron', abi: '69' }
  ])
})
