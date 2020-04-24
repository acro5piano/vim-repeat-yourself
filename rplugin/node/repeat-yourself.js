const { make, importLine } = require('../../src')

module.exports = plugin => {
  plugin.setOptions({ dev: false })

  plugin.registerCommand(
    'RepeatYourselfMake',
    async () => {
      try {
        await plugin.nvim.outWrite('Dayman (ah-ah-ah) \n')
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
        const line = await importLine()
        await plugin.nvim.setLine(line + 'hoge')
      } catch (err) {
        console.error(err)
      }
    },
    { sync: false },
  )

  plugin.registerFunction(
    'SetLines',
    () => {
      return plugin.nvim
        .setLine('May I offer you an egg in these troubling times')
        .then(() => console.log('Line should be set'))
    },
    { sync: false },
  )
}
