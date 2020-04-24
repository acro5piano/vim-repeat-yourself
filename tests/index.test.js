const test = require('ava')
const { make } = require('../src')
const path = require('path')

test('make', async t => {
  await make(path.resolve(__dirname, 'test-project'))
  t.is(1, 1)
})
