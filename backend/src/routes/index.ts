import { Router } from 'express'
import collaborationRoutes from './collaborationRoutes'
import brandRoutes from './brandRoutes'

const router = Router()

router.use('/collaborations', collaborationRoutes)
router.use('/brands', brandRoutes)

router.get('/test', (_req, res) => {
  res.json({
    success: true,
    message: 'uscola API is working!',
    timestamp: new Date().toISOString(),
  })
})

export default router
