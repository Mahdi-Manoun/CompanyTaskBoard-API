import express from 'express';

// middleware
import requireAuth from '../middleware/requireAuth.js';
import isAdmin from '../middleware/isAdmin.js';
import {
    createCard,
    getCards,
    deleteCard,
    updateCard
} from '../controllers/cardController.js';


const router = express.Router();


router.use(requireAuth);

router.post('/', isAdmin, createCard);

router.get('/', getCards);

router.delete('/:_id', isAdmin, deleteCard);

router.patch('/:_id', isAdmin, updateCard);


export default router;