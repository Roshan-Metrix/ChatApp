import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUsersForSidebar } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/users',userAuth,getUsersForSidebar)

export default messageRouter;