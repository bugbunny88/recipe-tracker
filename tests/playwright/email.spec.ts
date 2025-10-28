import { test, expect } from '@playwright/test'
import { normalizeEmail } from '../../server/src/email.utils'

test('Email addresses are normalized', () => {
  expect(normalizeEmail('denisek.xo@gmail.com')).toBe('denisek.xo@gmail.com')
  expect(normalizeEmail('Denisek.xo@gmail.com')).toBe('denisek.xo@gmail.com')
  expect(normalizeEmail('DeniseK.xo+1@gmail.com')).toBe('denisek.xo+1@gmail.com')
})
