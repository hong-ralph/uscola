import { Request, Response, NextFunction } from 'express'
import { BrandService } from '../services/BrandService'
import { CreateBrandSchema } from '../utils/validation'

export class BrandController {
  private service: BrandService

  constructor() {
    this.service = new BrandService()
  }

  getBrands = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { q } = req.query
      const brands = q
        ? await this.service.searchBrands(q as string)
        : await this.service.getAllBrands()
      res.json({ success: true, data: brands })
    } catch (error) {
      next(error)
    }
  }

  getBrandById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const brand = await this.service.getBrandById(id)

      if (!brand) {
        res.status(404).json({ success: false, error: '브랜드를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, data: brand })
    } catch (error) {
      next(error)
    }
  }

  createBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = CreateBrandSchema.validate(req.body)
      if (error) {
        res.status(400).json({ success: false, error: error.details[0].message })
        return
      }

      const brand = await this.service.createBrand(value)
      res.status(201).json({ success: true, data: brand })
    } catch (error) {
      next(error)
    }
  }
}
