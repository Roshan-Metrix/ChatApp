import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getMessages, getUsersForSidebar, sendMessages } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/users',userAuth,getUsersForSidebar)
messageRouter.get('/:id',userAuth,getMessages)
messageRouter.post('/send/:id',userAuth,sendMessages)

export default messageRouter;