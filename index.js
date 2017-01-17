const create = require('uniloc')
const {json, send} = require('micro')
const id = require('shortid')

const DEV = process.env.NODE_ENV === 'development'

async function unhandled () { throw new Error('Unhandled') }

class HttpError extends Error {
  constructor (message, statusCode, internal) {
    super(message)
    this.name = 'HttpError'
    this.internal = internal
    this.statusCode = statusCode
  }
}

module.exports = exports = serve
exports.HttpError = HttpError

function serve (routes, settings = {}) {
  const prepared = {}
  const handlers = {}
  for (let route of routes) {
    const name = id.generate()
    prepared[name] = `${route.method} ${route.path}`
    handlers[name] = route.handler || unhandled
  }

  const router = create(prepared)

  return async (req, res) => {
    const {name, options} = router.lookup(req.url, req.method)
    if (/json/.test(req.headers['Content-Type'])) {
      req.body = await json(req)
    }
    req.options = options
    try {
      return await handlers[name](req, res)
    } catch (err) {
      const {renderError} = settings
      if (typeof renderError === 'function') {
        let message = renderError(err)
        if (DEV) {
          if (typeof message === 'object') {
            if (Array.isArray(message)) {
              message.push({stack: err.stack})
            } else {
              message.stack = err.stack
            }
          } else {
            message += ' TRACE:' + err.stack
          }
        }
        return send(res, err.statusCode || 500, message)
      }

      throw err
    }
  }
}
