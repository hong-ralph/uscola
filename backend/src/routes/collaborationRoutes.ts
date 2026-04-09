import { Router } from 'express'
import { CollaborationController } from '../controllers/CollaborationController'
import { optionalAuth } from '../middleware/auth'

const router = Router()
const controller = new CollaborationController()

router.get('/', controller.getCollaborations)
router.get('/:id', controller.getCollaborationById)
router.post('/', optionalAuth, controller.createCollaboration)
router.put('/:id', optionalAuth, controller.updateCollaboration)
router.delete('/:id', optionalAuth, controller.deleteCollaboration)

export default router
