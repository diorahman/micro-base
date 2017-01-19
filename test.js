const API = require('./')
const test = require('ava')
const request = require('tarik')
const listen = require('micro-listen-test')

const app = API([
  {
    method: 'GET',
    path: '/',
    handler: async (req, res) => {
      return 'ok'
    }
  },
  {
    method: 'POST',
    path: '/',
    handler: async (req, res) => {
      return req.body
    }
  },
  {
    method: 'GET',
    path: '/empty',
    handler: async (req, res) => {
      return null
    }
  },
  {
    method: 'GET',
    path: '/err',
    handler: async (req, res) => {
      throw new Error('HAHAHA')
    }
  }
], { renderError: (err) => { return {message: 'LOL'}}})

test('ok', async (t) => {
  const url = await listen(app)
  const {body} = await request.get(url)
  t.deepEqual(body, 'ok')
})

test('body', async (t) => {
  const url = await listen(app)
  const {body} = await request.post(url, {ok: 'ok'}, {json: true})
  t.deepEqual(body.ok, 'ok')
})

test('empty', async (t) => {
  const url = await listen(app)
  const {body, statusCode} = await request.get(`${url}/empty`)
  t.deepEqual(statusCode, 204)
  t.deepEqual(body, '')
})

test('custom err', async (t) => {
  const url = await listen(app)
  const {body, statusCode} = await request.get(`${url}/err`)
  t.deepEqual(statusCode, 500)
  t.deepEqual(body.message, 'LOL')
})
