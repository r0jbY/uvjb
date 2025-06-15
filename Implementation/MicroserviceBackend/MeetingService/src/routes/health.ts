// src/routes/health.ts
import { Router } from 'express'
import { Request, Response } from 'express'

const router = Router()

router.get('/health', (req: Request, res: Response) => {res.sendStatus(200)})

export default router
