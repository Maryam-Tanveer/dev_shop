import express from 'express'
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// All user management routes require valid authentication
router.use(requireAuth)

// Profile endpoints
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/password', changePassword)

// Address endpoints
router.get('/addresses', getAddresses)
router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)

export default router
