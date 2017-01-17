const create = require('uniloc')
const {json} = require('micro')
const id = require('shortid')

async function unhandled () { throw new Error('Unhandled') }

class HttpError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

module.exports = exports = serve
exports.HttpError = HttpError

function serve (routes) {
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
    return await handlers[name](req, res)
  }
}
