import { pree, Message } from '../index'


test('everything is exported.', () => {
  expect(pree).toBeDefined()
  expect(<Message>{}).toBeDefined()
})
