const isAsyncSupported = require('is-async-supported')
const DEV = process.env.NODE_ENV === 'development'
if (!isAsyncSupported()) {
  require('async-to-gen/register')({
    sourceMaps: DEV,
    excludes: /\/node_modules\/(?!micro-suite\/)/
  })
}

module.exports = require('./index.js')
