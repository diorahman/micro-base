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
  }
])

test('ok', async (t) => {
  const url = await listen(app)
  const {body} = await request.get(url)
  t.deepEqual(body, 'ok')
})
