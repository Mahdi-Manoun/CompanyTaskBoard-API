import express from 'express'
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    getWorkspaces,
    updateWorkspace,
    assignUserIdToCard
} from '../controllers/workspaceController.js'

// middleware
import requireAuth from '../middleware/requireAuth.js'
import isAdmin from '../middleware/isAdmin.js'
import validateWorkspaceTitle from '../middleware/validateWorkspaceTitle.js'


const router = express.Router()

router.use(requireAuth)

router.post('/', isAdmin, validateWorkspaceTitle, createWorkspace)

router.get('/', getWorkspaces)

router.get('/:title', isAdmin, getWorkspace)

router.delete('/:id', isAdmin, deleteWorkspace)

router.patch('/', isAdmin, validateWorkspaceTitle, updateWorkspace)

router.patch('/assign-user', isAdmin, assignUserIdToCard)


export default router