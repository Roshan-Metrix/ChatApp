import jwt from 'jsonwebtoken'

const userAuth = async (req,res,next) =>{
    const { token } = req.cookies;

    if(!token) return res.status(401).json({success:false,message:'Not Authorized , Login Again'})

    try {

       const decodeToken = jwt.verify(token,process.env.JWT_SECRET);

       if(decodeToken.id){
        req.userId = decodeToken.id;
       } else{
        return res.json({success:false,message:"Something Went Wrong"})
       }
        
      next();

    } catch(error){
        return res.status(500).json({success:false,message: error.message})
    }
}  

export default userAuth;