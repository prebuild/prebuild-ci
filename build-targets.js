function buildTargets (currentNodeAbi, supportedTargets) {
  const nodeAbis = supportedTargets
    .filter(target => target.runtime === 'node')
    .map(target => target.abi)

  const electronAbis = supportedTargets
    .filter(target => target.runtime === 'electron')
    .map(target => target.abi)

  const oddballElectronAbis = electronAbis.filter(
    electronAbi =>
      electronAbi >= currentNodeAbi && !nodeAbis.includes(electronAbi)
  )

  // Current Node ABI
  const targets = [
    {
      runtime: 'node',
      abi: currentNodeAbi
    }
  ]
  // Electron with same ABI as current Node
  if (electronAbis.includes(currentNodeAbi)) {
    targets.push({
      runtime: 'electron',
      abi: currentNodeAbi
    })
  }
  // Oddball Electron ABIs
  oddballElectronAbis.forEach(oddballAbi => {
    targets.push({
      runtime: 'electron',
      abi: oddballAbi
    })
  })
  return targets
}

module.exports = buildTargets
