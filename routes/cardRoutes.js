import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
import isAdmin from '../middleware/isAdmin.js'
import {
    createCard,
    getCards,
    deleteCard,
    updateCard
} from '../controllers/cardController.js'


const router = express.Router()


router.use(requireAuth)

router.post('/', isAdmin, createCard)

router.get('/', getCards)

// router.get('/forAdmin')

router.delete('/:_id', isAdmin, deleteCard)

router.patch('/:card_id', isAdmin, updateCard)


export default router