function cleanTarget ({ runtime, abi, target }) {
  return { runtime, abi, target }
}

function buildTargets (currentNode, supportedTargets, pkg) {
  const nodeTarget = {
    runtime: 'node',
    abi: currentNode.modules,
    target: currentNode.node
  }

  // Electron versions with the same ABI as current Node ABI
  const electronTargets = supportedTargets
    .filter(target => target.runtime === 'electron' && target.abi === currentNode.modules)
    .map(cleanTarget)

  // Oddball Electron versions, where no version of Node has the same ABI
  const nodeAbis = supportedTargets
    .filter(target => target.runtime === 'node')
    .map(target => target.abi)
  const oddballElectronTargets = supportedTargets
    .filter(target => target.runtime === 'electron' && target.abi >= currentNode.modules)
    .filter(target => !nodeAbis.includes(target.abi))
    .map(cleanTarget)

  // N-API versions, requires napi_versions to be set
  const napiTargets = []
  if (pkg.binary && pkg.binary.napi_versions) {
    pkg.binary.napi_versions.forEach(napiVersion => {
      napiTargets.push({
        runtime: 'napi',
        target: String(napiVersion)
      })
    })
  }

  return [
    nodeTarget,
    ...electronTargets,
    ...oddballElectronTargets,
    ...napiTargets
  ]
}

module.exports = buildTargets
