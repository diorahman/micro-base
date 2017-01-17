const API = require('./')
const {HttpError} = API

const options = {
  // HttpError
  renderError: (err) => {
    return {
      errors: [{
        message: err.message,
        code: err.internal || '1195'
      }]
    }
  }
}

module.exports = API([
  {
    method: 'GET',
    path: '/:id',
    handler: async (req, res) => {
      return req.options
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: async (req, res) => {
      throw new HttpError('HAHA', 400, '1201')
    }
  }
], options)
