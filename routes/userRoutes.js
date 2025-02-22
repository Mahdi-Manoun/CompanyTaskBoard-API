import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
import { updateUser } from '../controllers/userController.js'

// Middleware
import validateUsername from '../middleware/validateUsername.js'
import preventRoleChange from '../middleware/preventRoleChange.js'


const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// update user information
router.patch('/update', preventRoleChange, validateUsername, updateUser)


export default router