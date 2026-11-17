import express from 'express'
import {
  subscribeNewsletter,
  getSubscriberCount,
  broadcastNewsletter,
} from '../controllers/newsletterController.js'

const router = express.Router()

router.post('/subscribe', subscribeNewsletter)
router.get('/count', getSubscriberCount)
router.post('/broadcast', broadcastNewsletter)

export default router
