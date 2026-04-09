import { Router, Request, Response } from 'express'
import { supabase } from '../config/supabase'

const router = Router()

// 현재 유저 정보 조회
router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.json({ success: true, data: null })
    return
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    res.json({ success: true, data: null })
    return
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email,
      avatar_url: user.user_metadata?.avatar_url,
    },
  })
})

export default router
