// src/Services/authService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { login, checkAuth } from '../Services/AuthenticationService'
import axios from '../axiosConfigs'

// Mock axios
vi.mock('../axiosConfigs')

describe('authService', () => {
  describe('login()', () => {
    it('should return something on successful login', async () => {
      // Arrange
      const mockResponse = { data: {user: { id: 1 } } }
      vi.mocked(axios.post).mockResolvedValue(mockResponse)

      // Act
      const result = await login('test@example.com', 'password')

      // Assert
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw an error if no server response', async () => {
      const error = { isAxiosError: true, response: null }
      vi.mocked(axios.post).mockRejectedValue(error)

      await expect(login('x', 'x')).rejects.toThrow(
        'Unable to reach server. Please check your connection.'
      )
    })

    it('should throw login failed if server responds with error', async () => {
      const error = { isAxiosError: true, response: { status: 401 } }
      vi.mocked(axios.post).mockRejectedValue(error)

      await expect(login('x', 'x')).rejects.toThrow('Login failed')
    })

    it('should throw a generic error for unknown errors', async () => {
      const error = { message: 'boom' }
      vi.mocked(axios.post).mockRejectedValue(error)

      await expect(login('x', 'x')).rejects.toThrow('An unexpected error occurred')
    })
  })

  describe('checkAuth()', () => {
    it('should return user data if authenticated', async () => {
      const mockResponse = {
        data: { id: 'user123', role: 'admin' },
      }
      vi.mocked(axios.get).mockResolvedValue(mockResponse)

      const result = await checkAuth()

      expect(result).toEqual({
        userId: 'user123',
        role: 'admin',
        isAuthenticated: true,
      })
    })

    it('should return defaults if unauthenticated or error occurs', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Unauthorized'))

      const result = await checkAuth()

      expect(result).toEqual({
        userId: null,
        role: null,
        isAuthenticated: false,
      })
    })
  })
})
