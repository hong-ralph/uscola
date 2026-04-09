import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

export interface AuthRequest extends Request {
  userId?: string
}

// 선택적 인증: 로그인 유저면 userId를 세팅, 비로그인이어도 통과
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (token) {
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (user) {
      req.userId = user.id
    }
  }

  next()
}
