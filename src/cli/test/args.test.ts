import { LOG_LEVEL } from '../../util/logger'
import { args } from '../args'


describe(args, () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('parses command line arguments.', () => {
    jest.replaceProperty(process, 'argv', ['', '', 'build', 'stuff', 'things'])
    const parsed = args()

    expect(parsed.command).toBe('build')
    expect(parsed.src).toBe('stuff')
    expect(parsed.dest).toBe('things')
  })

  test('parses verbosity level.', () => {
    jest.replaceProperty(process, 'argv', ['', '', 'build', '-V'])
    expect(args().logLevel).toBe(LOG_LEVEL.DEBUG)

    jest.replaceProperty(process, 'argv', ['', '', 'build', '-V', '-V'])
    expect(args().logLevel).toBe(LOG_LEVEL.DEBUG)

    jest.replaceProperty(process, 'argv', ['', '', 'build'])
    expect(args().logLevel).toBe(LOG_LEVEL.INFO)

    jest.replaceProperty(process, 'argv', ['', '', 'build', '-S'])
    expect(args().logLevel).toBe(LOG_LEVEL.WARN)

    jest.replaceProperty(process, 'argv', ['', '', 'build', '-S', '-S'])
    expect(args().logLevel).toBe(LOG_LEVEL.ERROR)

    jest.replaceProperty(process, 'argv', ['', '', 'build', '-SSS'])
    expect(args().logLevel).toBe(LOG_LEVEL.SILENT)
  })

  test('turns include and exclude into arrays.', () => {
    jest.replaceProperty(process, 'argv', ['', '', 'build', '-i', 'stuff', '-e', 'other', '-e', 'things'])
    const parsed = args()

    expect(parsed.include).toEqual(['stuff'])
    expect(parsed.exclude).toEqual(['other', 'things'])
  })

  test('default command is help.', () => {
    jest.replaceProperty(process, 'argv', ['', ''])
    expect(args().command).toBe('help')
  })

  test('command becomes version or help with their flags tooo.', () => {
    jest.replaceProperty(process, 'argv', ['', '', 'build', '-h'])
    expect(args().command).toBe('help')

    jest.replaceProperty(process, 'argv', ['', '', 'view', '-v'])
    expect(args().command).toBe('version')
  })
})
