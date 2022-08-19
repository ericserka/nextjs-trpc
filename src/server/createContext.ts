import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'
import { verifyJwt } from '@/utils/jwt'

interface CtxUser {
  id: string
  email: string
  name: string
  iat: string
  exp: number
}

const getUserFromRequest = (req: NextApiRequest) => {
  const token = req.cookies.token
  if (token) {
    try {
      return verifyJwt<CtxUser>(token)
    } catch (e) {
      return null
    }
  }
  return null
}

export const createContext = ({
  req,
  res,
}: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
  const user = getUserFromRequest(req)
  return {
    req,
    res,
    prisma,
    user,
  }
}

export type Context = ReturnType<typeof createContext>
