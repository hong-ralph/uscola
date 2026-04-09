import { Router } from 'express'
import { CollaborationController } from '../controllers/CollaborationController'

const router = Router()
const controller = new CollaborationController()

router.get('/', controller.getCollaborations)
router.get('/:id', controller.getCollaborationById)
router.post('/', controller.createCollaboration)
router.put('/:id', controller.updateCollaboration)
router.delete('/:id', controller.deleteCollaboration)

export default router
