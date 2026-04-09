import { Router } from 'express'
import { BrandController } from '../controllers/BrandController'

const router = Router()
const controller = new BrandController()

router.get('/', controller.getBrands)
router.get('/:id', controller.getBrandById)
router.post('/', controller.createBrand)

export default router
