import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as AuthService from '../Services/AuthenticationService'

// ✅ Mock checkAuth
vi.mock('../Services/AuthenticationService', () => ({
  checkAuth: vi.fn(),
}))

// ✅ Test Component
const TestComponent = () => {
  const { userId, isAuthenticated, role, loading } = useAuth()
  return (
    <div>
      <div>userId: {userId}</div>
      <div>isAuthenticated: {String(isAuthenticated)}</div>
      <div>role: {role}</div>
      <div>loading: {String(loading)}</div>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders default unauthenticated state initially', async () => {
    vi.mocked(AuthService.checkAuth).mockResolvedValue({
      userId: null,
      isAuthenticated: false,
      role: null,
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/isAuthenticated: false/)).toBeInTheDocument()
      expect(screen.getByText(/loading: false/)).toBeInTheDocument()
      expect(screen.getByText(/role:/)).toBeInTheDocument()
      expect(screen.getByText(/userId:/)).toBeInTheDocument()
    })
  })

  it('updates context with user info after successful checkAuth', async () => {
    vi.mocked(AuthService.checkAuth).mockResolvedValue({
      userId: 'user123',
      isAuthenticated: true,
      role: 'admin',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/userId: user123/)).toBeInTheDocument()
      expect(screen.getByText(/isAuthenticated: true/)).toBeInTheDocument()
      expect(screen.getByText(/role: admin/)).toBeInTheDocument()
      expect(screen.getByText(/loading: false/)).toBeInTheDocument()
    })
  })

})
