const { spawn } = require('child_process')

module.exports = function importLine() {
  const entries = ['things', 'I', 'want', 'to', 'search'].join('\n')

  const fzf = spawn(`echo "${entries}" | fzf-tmux`, {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true,
  })

  fzf.stdout.setEncoding('utf-8')

  return new Promise((resolve, reject) => {
    fzf.stdout.on('readable', () => {
      const value = fzf.stdout.read()

      if (value !== null && value.trim) {
        resolve(value.trim())
      }
    })
  })
}
