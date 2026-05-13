import type { Request } from 'express'

export interface JwtPayload {
  sub: string
  email: string
  role: string
  esfId: string
  esfName: string
  esfCode: string
  iat?: number
  exp?: number
}

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
  esfId: string
  esfName: string
  esfCode: string
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
