import express from 'express';
import {
    createBoard,
    getBoards,
    deleteBoard,
    updateBoard
} from '../controllers/boardController.js';

// middleware
import requireWorkspace from '../middleware/requireWorkspace.js';
import requireAuth from '../middleware/requireAuth.js';
import isAdmin from '../middleware/isAdmin.js';
import isValidColor from '../middleware/isValidColor.js';


const router = express.Router();

router.use(requireAuth);

router.post('/:workspace_id/boards', isAdmin, requireWorkspace, isValidColor , createBoard);

router.get('/', getBoards);

router.delete('/:title', isAdmin, deleteBoard);

router.patch('/:title', isAdmin, updateBoard);


export default router;