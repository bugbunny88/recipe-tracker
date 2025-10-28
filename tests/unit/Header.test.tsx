import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../../src/components/Header'

// Mock the contexts
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
  }),
}))

describe('Header', () => {
  it('renders the header component', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText('Masa Mía')).toBeInTheDocument()
  })

  it('shows login and signup links when user is not logged in', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getAllByText('Log In')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Sign Up')).toHaveLength(2) // Desktop and mobile
  })
})
