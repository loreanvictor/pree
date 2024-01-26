import { type } from 'ts-inference-check'

import { pree } from '..'
import { Message } from '../types'


describe(pree, () => {
  test('does stuff.', () => {
    expect(pree().msg).toBe('Hellow, this is pree!')
  })

  test('returns the proper type.', () => {
    expect(type(pree()).is<Message>(true)).toBe(true)
  })
})
