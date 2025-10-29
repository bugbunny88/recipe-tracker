import { test, expect } from '@playwright/test'
const API_BASE_URL = 'http://localhost:3001/api'

test('User can Signup', async ({ request }) => {
  const response = await request.post(`${API_BASE_URL}/auth/signup`, {
    data: {
      email: 'denisekxo-test@gmail.com',
      password: 'Password123!',
    },
  })

  expect(response.status(), await response.text()).toEqual(201)

  const json = await response.json()
  expect(json.message).toEqual('User created successfully')
  expect(json.token).toBeDefined()
})

test('User Exists', async ({ request }) => {
  const response = await request.post(`${API_BASE_URL}/auth/signup`, {
    data: {
      email: 'denisekx1o-test@gmail.com',
      password: 'Password123!',
    },
  })

  expect(response.status(), await response.text()).toEqual(409)

  const json = await response.json()
  expect(json.error).toEqual('User with this email already exists')
})
