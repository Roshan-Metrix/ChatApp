import messageModel from '../models/messageModel.js'
import userModel from '../models/userModel.js'
import cloudinary from '../lib/cloudinary.js';

export const getUsersForSidebar = async (req,res) => {
    const loggedInUserId = req.userId;

    if(!loggedInUserId) return res.status(400).json({success:false,message:'Not Authorized , Login Again'})

    try{

        const filteredUsers = await userModel.find({_id: {$ne:loggedInUserId}}).select("name email profilePic").select('-password');

  res.status(200).json({
    success:true,
    allUsers:filteredUsers,
    })

    }catch(error){
        console.log("Error in getUsersForSidebar controller:",error.message)
        res.status(500).json({
            success:false,
            message:"Internal Serval Errors",
            error:error.message})
    }
}

export const getMessages = async (req,res) => {
    const { id:userToChatId } = req.params;
    const myId = req.userId;

    try{

    const messages = await messageModel.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    })

    await messages.save();

    res.status(200).json(messages)
    }catch(error){
         console.log("Error in getMessages controller:",error.message)
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }

}

export const sendMessages = async (req,res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;
    
    try{

    let imageUrl;
    if(image){
        //Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
     
    const newMessage = new messageModel({
        senderId,
        receiverId,
        text,
        image:imageUrl
    });

    await newMessage.save();

    // todo : realtime functionality goes here => socket.io


    res.status(201).json(newMessage)

    }catch(error){
         console.log("Error in sendMessage controller:",error.message)
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
}


