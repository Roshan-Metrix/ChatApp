import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import userModel from '../models/userModel.js'
import { WELCOME_TEMPLATE } from '../config/emailTemplates.js'
import transporter from '../config/nodemailer.js'

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
       
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome To ChatApp',
            html: WELCOME_TEMPLATE.replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);

       res.json({success:true,message:'User Created Successfully'})

}catch(error){
       return res.json({success:false,message:error.message})
    }
}

export const loginUser = async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.json({success:false,message:'Missing Details'})
    
try{ 

    const user = await userModel.findOne({email});
    if(!user) return res.json({success:false,message:'User Not Found'})

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) return res.json({success:false,message:'Invalid Password'})

         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: '7d'});
        
        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    res.json({success:true,message:'Login Success'})
    } catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const logoutUser = async (req,res) => {
    try{
        res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success:true,message:'Logged Out'})
    } catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const sendVerifyOtp = async (req,res) => {
    const userId = req.userId;
    console.log(userId);
    return res.json({success:true,message:'OTP sent successfully'})

}
export const verifyEmail = async (req,res) => {

}
export const isAuthenticated = async (req,res) => {

}
export const sendResetOtp = async (req,res) => {

}
export const resetPassword = async (req,res) => {

}
