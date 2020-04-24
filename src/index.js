const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const util = require('util')
const execa = require('execa')
const Aigle = require('aigle')

const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)
const readFile = path => readFilePromise(path, 'utf8')

function exec(command) {
  const ps = spawn(command, {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true,
  })

  ps.stdout.setEncoding('utf-8')

  return new Promise((resolve, reject) => {
    ps.stdout.on('readable', () => {
      const value = ps.stdout.read()
      if (value !== null && value.trim) {
        resolve(value.trim())
      }
    })
  })
}

async function importLine(searchWord = '', searchPath = process.cwd()) {
  const json = JSON.parse(await readFile(getSaveTo(searchPath)))
  const list = json.filter(line => line.includes(searchWord))
  if (list.length === 0) {
    return 0
  }
  if (list.length === 1) {
    return list[0]
  }
  const entries = list.join('\n')
  return exec(`echo "${entries}" | fzf-tmux`)
}

function getSaveTo(searchPath) {
  const fileName = searchPath.replace(/\//g, '__')
  const dir = path.resolve(`${process.env.HOME}/.vim-repeat-yourself`)
  return `${dir}/${fileName}`
}

async function getList(searchPath, fileRegex, importRegex) {
  return Aigle.resolve(execa('git', ['ls-files', searchPath]))
    .then(x => x.stdout.split('\n'))
    .filter(x => fileRegex.test(x))
    .map(readFile)
    .map(x => x.split('\n'))
    .reduce((car, cur) => [...car, ...cur], [])
    .filter(Boolean)
    .filter(x => importRegex.test(x))
    .filter(x => !x.startsWith(' '))
    .filter(x => x.length < 80)
    .filter(x => !x.includes('../../'))
    .sortBy((x, y) => x.localeCompare(y))
}

async function make(
  searchPath = process.cwd(),
  fileRegex = /.(jsx?|tsx?)$/,
  importRegex = /^import |const.+=.+require/,
) {
  const fileName = searchPath.replace(/\//g, '__')
  const dir = path.resolve(`${process.env.HOME}/.vim-repeat-yourself`)
  await execa('mkdir', [dir]).catch(() => {})
  const lines = await getList(searchPath, fileRegex, importRegex)
  await writeFilePromise(
    getSaveTo(searchPath),
    JSON.stringify(lines, undefined, 2),
  )
}

module.exports = {
  importLine,
  getSaveTo,
  make,
}
