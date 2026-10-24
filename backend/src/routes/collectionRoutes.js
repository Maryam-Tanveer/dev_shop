import express from 'express'
import { getCollections, getCollectionById } from '../controllers/collectionController.js'

const router = express.Router()

router.get('/', getCollections)
router.get('/:id', getCollectionById)

export default router
