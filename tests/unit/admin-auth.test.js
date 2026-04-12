import test from 'node:test'
import assert from 'node:assert/strict'
import {ensureAdminRequest} from '../../lib/admin-auth.js'

const ORIGINAL_ENV = {...process.env}

function resetEnv() {
  process.env = {...ORIGINAL_ENV}
}

function makeRequest(headers = {}) {
  return new Request('https://example.com', {headers})
}

test('rejects when no tokens configured', () => {
  resetEnv()
  const res = ensureAdminRequest(makeRequest())
  assert.ok(res, 'response should be returned')
  assert.equal(res.status, 500)
})

test('authorizes matching admin token header', () => {
  process.env.ADMIN_API_TOKEN = 'admin-secret'
  const res = ensureAdminRequest(makeRequest({'x-admin-token': 'admin-secret'}))
  assert.equal(res, null)
  resetEnv()
})

test('authorizes matching studio token header', () => {
  resetEnv()
  process.env.NEXT_PUBLIC_STUDIO_API_TOKEN = 'studio-token'
  const res = ensureAdminRequest(makeRequest({'x-studio-token': 'studio-token'}))
  assert.equal(res, null)
  resetEnv()
})

test('rejects mismatched token', () => {
  process.env.ADMIN_API_TOKEN = 'admin-secret'
  const res = ensureAdminRequest(makeRequest({'x-admin-token': 'nope'}))
  assert.ok(res)
  assert.equal(res.status, 401)
  resetEnv()
})
