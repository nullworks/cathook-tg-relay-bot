'use strict'
const Tail = require('tail').Tail
const fs = require('fs')
const requestPromise = require('request-promise-native')
const token = require('./config.json').token
if (token === 'Your Telegram bot token here') throw new Error('Set your bot token in config.json!')
const channel = require('./config.json').channel
if (channel === 'Your Channel ID here') throw new Error('Set your channel id in config.json!')

const splitCSV = (csv) => {
  const result = []
  let current = ''
  let quotes = false
  for (let i = 0; i < csv.length; ++i) {
    if (csv[i] === '"' && csv[i + 1] === '"') {
      current += '"'
      ++i
      continue
    }
    if (csv[i] === '"') {
      quotes = !quotes
      continue
    }
    if (csv[i] === ',' && !quotes) {
      result.push(current)
      current = ''
      continue
    }
    current += csv[i]
  }
  result.push(current)
  return result
}

const antiSpamData = {}
const muted = {}
const antiSpam = (data) => {
  const steamID = data[1]
  if (muted[steamID]) return false
  if (!antiSpamData[steamID]) antiSpamData[steamID] = { count: 0, last: 0 }
  if (Date.now() - antiSpamData[steamID].last > 15000) antiSpamData[steamID].count = 0
  antiSpamData[steamID].count++
  antiSpamData[steamID].last = Date.now()
  if (antiSpamData[steamID].count > 8) antiSpamData[steamID].banned = Date.now()
  return !antiSpamData[steamID].banned
}

const composeMessage = (data) => {
  const steamID = data[1]
  const username = data[2]
  const message = data[3]

  return `[U:1:${steamID}] ${username}: ${message}`
}

const composeMessageRaw = (data) => {
  const steamID = data[1]
  const username = data[2]
  const message = data[3]

  return `[U:1:${steamID}] ${username}: ${message}`
}

const getSpamCheckData = (data) => {
  const steamID = data[1]
  const username = data[2]
  const message = data[3]

  return `[U:1:${steamID}] ${username}: ${message}`
}

const stack = []
const stackSize = 10
let stackIterator = 0
const testAndSet = (msg) => {
  let j = stackIterator
  for (let i = 0; i < 10; i++) {
    if (stack[j] === msg) return false
    j++
    if (j >= stackSize) j = 0
  }
  stack[stackIterator++] = msg
  if (stackIterator >= stackSize) stackIterator = 0
  return true
}

const queue = []
const onLine = (data) => {
  try {
    if (testAndSet(data)) {
      queue.push(data)
    }
  } catch (e) {
  }
}

const send = () => {
  try {
    let msg = ''
    let msgRaw = ''
    // No new messages
    if (!queue.length) return
    while (queue.length) {
      try {
        const csv = queue.shift()
        const data = splitCSV(csv)
        if (!antiSpam(data)) continue
        const message = composeMessage(data)
        const spamCheck = getSpamCheckData(data)
        if (msg.includes(spamCheck)) continue

        msg += `${message}\n`
        msgRaw += `${composeMessageRaw(data)}\n`
      } catch (e) {
        console.log(`ERROR: ${e}`)
      }
    }
    if (msgRaw === '') return
    try {
      process.stdout.write(msgRaw)
      requestPromise(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${channel}&disable_web_page_preview=True&text=${encodeURIComponent(msg)}`)
    } catch (e) {
    }
  } catch (e) {
  }
}

setInterval(send, 8000)

const onError = (error) => {
  console.log(`ERROR: ${error}`)
}

// Used as a list to know which files we're watching
const watching = {}
const locateLogs = () => {
  try {
    // Function to get current filenames in directory
    fs.readdir('/opt/cathook/data', (error, files) => {
      if (error) {
        console.log(error)
        return
      }
      for (let file of files) {
        // If there's no listener installed, and the file's name is chat-*.cvs, install a listener on it
        if (!watching[file] && /chat-.+\.csv/.exec(file)) {
          console.log(`Found log file: ${file}`)
          file = `/opt/cathook/data/${file}`
          const tail = new Tail(file)
          tail.on('line', onLine)
          tail.on('error', onError)
          // Add the file to the watching list, so that we don't accidentally install a new listener on it
          watching[file] = true
        }
      }
    })
  } catch (e) {
    onError(e)
  }
}

locateLogs()
setInterval(locateLogs, 20000)
