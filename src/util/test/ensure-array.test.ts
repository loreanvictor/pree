import { earr } from '../ensure-array'


describe(earr, () => {
  test('returs array regardless.', () => {
    expect(earr(1)).toEqual([1])
    expect(earr([1])).toEqual([1])
  })
})
