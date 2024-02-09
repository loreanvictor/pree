import {
  serve, ServeOptions, Loader,
  build, BuildOptions,
  view, ViewOptions,
} from '../index'


test('everything is exported.', () => {
  expect(serve).toBeDefined()
  expect(<ServeOptions>{}).toBeDefined()
  expect(<Loader>{}).toBeDefined()
  expect(build).toBeDefined()
  expect(<BuildOptions>{}).toBeDefined()
  expect(view).toBeDefined()
  expect(<ViewOptions>{}).toBeDefined()
})
