const API = require('./')
const {HttpError} = API

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
      throw new HttpError('HAHA', 400)
    }
  }
])
