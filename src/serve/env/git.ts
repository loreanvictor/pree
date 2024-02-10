import parse from 'git-url-parse'
import _git from 'simple-git'

import { response, router } from './router'
import { mimetype } from '../../util/file-types'


const instance = _git()

async function remoteUrl() {
  const url = await instance.remote(['get-url', 'origin'])

  return (url as string).trim()
}

async function remoteInfo() {
  const url = await remoteUrl()
  const info = parse(url)

  return info
}

async function commit(hash: string) {
  return (await instance.log(['-1', hash.trim()])).latest
}

async function firstCommit(path: string) {
  return path ?
    (await instance.log(['--diff-filter=A', path])).latest :
    commit(await instance.raw('rev-list', '--max-parents=0', 'HEAD'))
}

async function lastCommit(path: string) {
  return path ?
    (await instance.log(['-n', '1', path])).latest :
    commit('HEAD')
}

async function allCommits(path: string) {
  return path ?
    (await instance.log([path])).all :
    (await instance.log([])).all
}

async function show(object: string) {
  return response(await instance.show([object]), mimetype(object))
}

export const git = router({
  '/remote/url': async () => response(await remoteUrl(), 'text/plain'),
  '/remote/info': remoteInfo,
  '/commit/': commit,
  '/commits/first/': firstCommit,
  '/commits/last/': lastCommit,
  '/commits/all/': allCommits,
  '/show/': show,
})
