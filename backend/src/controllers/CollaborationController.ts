import { Request, Response, NextFunction } from 'express'
import { CollaborationService } from '../services/CollaborationService'
import {
  CreateCollaborationSchema,
  UpdateCollaborationSchema,
} from '../utils/validation'

export class CollaborationController {
  private service: CollaborationService

  constructor() {
    this.service = new CollaborationService()
  }

  getCollaborations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, category, brand, sort } = req.query
      const query: Record<string, unknown> = {}
      if (page) query.page = Number(page)
      if (limit) query.limit = Number(limit)
      if (category) query.category = category as string
      if (brand) query.brand = brand as string
      if (sort) query.sort = sort as string
      const result = await this.service.getCollaborations(query)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  getCollaborationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const collab = await this.service.getCollaborationById(id)

      if (!collab) {
        res.status(404).json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  createCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = CreateCollaborationSchema.validate(req.body)
      if (error) {
        res.status(400).json({ success: false, error: error.details[0].message })
        return
      }

      const collab = await this.service.createCollaboration(value)
      res.status(201).json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  updateCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const { error, value } = UpdateCollaborationSchema.validate(req.body)
      if (error) {
        res.status(400).json({ success: false, error: error.details[0].message })
        return
      }

      const collab = await this.service.updateCollaboration(id, value)
      if (!collab) {
        res.status(404).json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  deleteCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const deleted = await this.service.deleteCollaboration(id)

      if (!deleted) {
        res.status(404).json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, message: '삭제되었습니다' })
    } catch (error) {
      next(error)
    }
  }
}
