import find from 'find-package-json'


export function myVersion() {
  const packageJson = find(__dirname).next().value

  // istanbul ignore next
  return packageJson?.version ?? '?.?.?'
}
