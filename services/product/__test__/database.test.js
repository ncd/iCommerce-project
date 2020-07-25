'use strict'
require('mockingoose')
const mongoose = require('mongoose')
const database = require('../database')
jest.mock('mongoose')

describe('Database test', () => {
  test('mongoose first failed test', async () => {
    let count = 0
    const consoleOutput = []
    const mockedLog = output => consoleOutput.push(output)
    console.log = mockedLog
    jest.setTimeout(15000)
    mongoose.connect.mockImplementation(args => {
      if (count < 1) {
        count++
        throw new Error('failed to connect to server xx on first connect')
      }
    })
    await database({})
    expect(mongoose.connect).toHaveBeenCalledTimes(2)
  })
})
