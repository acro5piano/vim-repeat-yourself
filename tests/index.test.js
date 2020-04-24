const test = require('ava')
const { make, getSaveTo, importLine } = require('../src')
const path = require('path')
const fs = require('fs')
const util = require('util')

const readFilePromise = util.promisify(fs.readFile)

test('make', async t => {
  const searchPath = path.resolve(__dirname, 'test-project')
  await make(searchPath)
  const artifact = await readFilePromise(getSaveTo(searchPath))

  t.deepEqual(JSON.parse(artifact), [
    "import app from '@react-native-firebase/app'",
    "import { AppRegistry, Text } from 'react-native'",
    "import React from 'react'",
    "import styled from 'styled-components'",
  ])

  t.is(
    await importLine('@react-native-firebase/app', searchPath),
    "import app from '@react-native-firebase/app'",
  )

  if (!process.env.CI) {
    t.is(
      await importLine('react', searchPath),
      "import app from '@react-native-firebase/app'",
    )
  }
})
