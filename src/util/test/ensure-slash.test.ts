import { els, ets, trimslash } from '../ensure-slash'


describe(els, () => {
  test('adds leading slash', () => {
    expect(els('path')).toEqual('/path')
    expect(els('/path')).toEqual('/path')
  })
})

describe(ets, () => {
  test('adds trailing slash', () => {
    expect(ets('path')).toEqual('path/')
    expect(ets('path/')).toEqual('path/')
  })
})

describe(trimslash, () => {
  test('trims slashes', () => {
    expect(trimslash('/path/')).toEqual('path')
    expect(trimslash('/path')).toEqual('path')
    expect(trimslash('path/')).toEqual('path')
    expect(trimslash('path')).toEqual('path')
  })
})


