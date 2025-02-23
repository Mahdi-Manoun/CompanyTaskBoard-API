import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { updateUser } from '../controllers/userController.js';

// middleware
import validateUsername from '../middleware/validateUsername.js';
import preventRoleChange from '../middleware/preventRoleChange.js';


const router = express.Router();

router.use(requireAuth);

router.patch('/update', preventRoleChange, validateUsername, updateUser);


export default router;