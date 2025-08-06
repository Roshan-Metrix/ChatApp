import messageModel from '../models/messageModel.js'
import userModel from '../models/userModel.js'

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
        return res.status(500).json({
            success:false,
            message:"Failed to fetch users",
            error:error.message})
    }
}