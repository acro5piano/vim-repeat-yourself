const { make, importLine, cachedListJson } = require('../../src')

module.exports = plugin => {
  plugin.setOptions({ dev: true })

  plugin.registerCommand(
    'RepeatYourselfMake',
    async () => {
      try {
        await make()
      } catch (err) {
        console.error(err)
      }
    },
    { sync: false },
  )

  plugin.registerCommand(
    'RepeatYourselfImport',
    async () => {
      try {
        const cword = await plugin.nvim.eval('expand("<cword>")')
        const buffer = await plugin.nvim.buffer
        const line = await importLine(cword)

        setTimeout(() => {
          buffer.insert(line, 0)
        }, 100)

        if (line === 0) {
          await plugin.nvim.outWrite(`[RepeatYourself] Not found: ${cword}\n`)
          return
        }
      } catch (err) {
        console.error(err)
      }
    },
    { sync: false },
  )

  plugin.registerAutocmd(
    'BufEnter',
    async fileName => {
      await importLine()
      // await cachedListJson(process.cwd())
      // await plugin.nvim.buffer.append('BufEnter for a JS File?')
    },
    { sync: false, pattern: '*.{js,jsx,ts,tsx}', eval: 'expand("<afile>")' },
  )
}
