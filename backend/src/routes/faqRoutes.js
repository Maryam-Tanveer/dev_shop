import express from 'express'
import { getFaqs, getFaqCategories } from '../controllers/faqController.js'

const router = express.Router()

router.get('/', getFaqs)
router.get('/categories', getFaqCategories)

export default router
