import { Router } from 'express'
import collaborationRoutes from './collaborationRoutes'
import brandRoutes from './brandRoutes'
import authRoutes from './authRoutes'

const router = Router()

router.use('/collaborations', collaborationRoutes)
router.use('/brands', brandRoutes)
router.use('/auth', authRoutes)

router.get('/test', (_req, res) => {
  res.json({
    success: true,
    message: 'uscola API is working!',
    timestamp: new Date().toISOString(),
  })
})

export default router
