import express from 'express'
import { getFaqs, getFaqCategories, submitSupportTicket } from '../controllers/faqController.js'

const router = express.Router()

router.get('/', getFaqs)
router.get('/categories', getFaqCategories)
router.post('/contact', submitSupportTicket)

export default router
