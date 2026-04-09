import { Response, NextFunction } from 'express'
import { CollaborationService } from '../services/CollaborationService'
import { AuthRequest } from '../middleware/auth'
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
    req: AuthRequest,
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
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const collab = await this.service.getCollaborationById(id)

      if (!collab) {
        res
          .status(404)
          .json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  createCollaboration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = CreateCollaborationSchema.validate(req.body)
      if (error) {
        res
          .status(400)
          .json({ success: false, error: error.details[0].message })
        return
      }

      // 회원이면 submitted_by 설정
      if (req.userId) {
        value.submitted_by = req.userId
      }

      const collab = await this.service.createCollaboration(value)
      res.status(201).json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  updateCollaboration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)
      const { error, value } = UpdateCollaborationSchema.validate(req.body)
      if (error) {
        res
          .status(400)
          .json({ success: false, error: error.details[0].message })
        return
      }

      // 권한 체크
      const guestPassword = req.headers['x-guest-password'] as string
      const isOwner = await this.service.verifyOwnership(
        id,
        req.userId,
        guestPassword
      )
      if (!isOwner) {
        res.status(403).json({ success: false, error: '수정 권한이 없습니다' })
        return
      }

      const collab = await this.service.updateCollaboration(id, value)
      if (!collab) {
        res
          .status(404)
          .json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, data: collab })
    } catch (error) {
      next(error)
    }
  }

  deleteCollaboration = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id)

      // 권한 체크
      const guestPassword = req.headers['x-guest-password'] as string
      const isOwner = await this.service.verifyOwnership(
        id,
        req.userId,
        guestPassword
      )
      if (!isOwner) {
        res.status(403).json({ success: false, error: '삭제 권한이 없습니다' })
        return
      }

      const deleted = await this.service.deleteCollaboration(id)
      if (!deleted) {
        res
          .status(404)
          .json({ success: false, error: '콜라보를 찾을 수 없습니다' })
        return
      }

      res.json({ success: true, message: '삭제되었습니다' })
    } catch (error) {
      next(error)
    }
  }
}
