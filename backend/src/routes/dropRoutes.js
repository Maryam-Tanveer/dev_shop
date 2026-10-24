import express from 'express'
import {
  getHeroDrop,
  getFestivalPass,
  getAllDrops,
  subscribeDropAlert,
} from '../controllers/dropController.js'

const router = express.Router()

router.get('/', getAllDrops)
router.get('/hero', getHeroDrop)
router.get('/pass', getFestivalPass)
router.post('/subscribe-alert', subscribeDropAlert)

export default router
