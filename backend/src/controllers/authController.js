import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import userModel from '../models/userModel.js'

export const registerUser = async (req,res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:'Missing Details'})
    }

    try{

        const existingUser = await userModel.findOne({email});
        if(existingUser) return res.json({success:false,message:'User Already Available'})
       
        const hashedPassword = await bcrypt.hash(password,10)

        const user = new userModel({
            name,
            email,
            password:hashedPassword
        })

        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


       res.json({success:true,message:'User Created Successfully'})

}catch(error){
        res.json({success:false,message:error.message})
    }
}

export const loginUser = (req,res) => {
    res.json({success:true,message:'Login Usr'})
}

export const logoutUser = (req,res) => {
    res.json({success:true,message:'Logout Usr'})
}