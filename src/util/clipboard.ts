// istanbul ignore file

export async function copy(text: string) {
  const dimport = new Function('modulePath', 'return import(modulePath);')
  const clipboard = (await dimport('clipboardy')).default as any
  await clipboard.write(text)
}
