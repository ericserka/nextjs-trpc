import jwt from 'jsonwebtoken'
import { SECRET } from '../constants'

export function signJwt(data: object) {
  return jwt.sign(data, SECRET)
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T
}
