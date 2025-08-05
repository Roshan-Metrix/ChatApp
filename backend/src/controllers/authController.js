import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_SUCCESSFULLY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_TEMPLATE } from '../config/emailTemplates.js'
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

    if(!userId) return res.json({success:false,message:'Something Went Wrong ! Login Again'})

    try{
     
    const user = await userModel.findById(userId);

    if(user.isAccountVerified) return res.json({success:false,message:'User Already Verified'})

     const otp = String(Math.floor(100000 + Math.random() * 900000));

     user.verifyOtp = otp;
     user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

     await user.save();

     const mailOption = {
        from : process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
     }

     await transporter.sendMail(mailOption);

    return res.json({success:true,message:'OTP sent successfully'})

    } catch(error){
        return res.json({success:false,message:error.message})
    }

}

export const verifyEmail = async (req,res) => {
    const userId = req.userId;
     const { otp, email } = req.body;
     
    if(!userId) return res.json({success:false,message:'Not Authorized, Please login again'});

    if(!otp) return res.json({success:false,message:'Missing Details'});

    try{
         
        const user = await userModel.findOne({email});

        if(!user) return res.json({success:false,message:'User Not Found'})

        if(user.verifyOtp === '' || user.verifyOtp !== otp) return res.json({success:false,message:'Invalid OTP'})

        if(user.verifyOtpExpireAt < Date.now()) return res.json({success:false,message:'OTP Expired, Send Again'});
   
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save(); 
        return res.json({success:true,message:'Email Verified Successfully'})

    }catch(error){
        return res.json({success:false, message:error.message})
    }


}

export const isAuthenticated = async (req,res) => {
       try{
        res.json({success:true});
       } catch(error){
        res.json({success:false,message:error.message})
       }
}

export const sendResetOtp = async (req,res) => {
      const { email } = req.body;

    if(!email) return res.json({success:false,message:'Email is Required'})

    try{
     
    const user = await userModel.findOne({email});

    if(!user) return res.json({success:false,message:'User Not Found'})

     const otp = String(Math.floor(100000 + Math.random() * 900000));

     user.resetOtp = otp;
     user.resetOtpExpireAt = Date.now() + 20 * 60 * 1000;

     await user.save();

     const mailOption = {
        from : process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
     }

     await transporter.sendMail(mailOption);

    return res.json({success:true,message:'Reset OTP sent successfully'})

    } catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const resetPassword = async (req,res) => {
     const { email, otp, newPassword } = req.body;  

      if(!email) return res.json({success:false,message:'Email is required'});

    if(!otp) return res.json({success:false,message:'OTP is required'});

    if(!newPassword) return res.json({success:false,message:'Password is required'});

    try{
        const user = await userModel.findOne({email});

        if(!user) return res.json({success:false,message:'User Not Found'})

        if(user.resetOtp === '' || user.resetOtp !== otp) return res.json({success:false,message:'Invalid OTP'})

        if(user.resetOtpExpireAt < Date.now()) return res.json({success:false, message:'OTP expired, request again'})

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

         const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset Successfully',
        text: `Your Password for ${email} is reset successfully.`,
        html: PASSWORD_RESET_SUCCESSFULLY_TEMPLATE.replace("{{email}}",user.email)
    }

    await transporter.sendMail(mailOption);
   

   return res.json({success:true,message:'Password has been reset successfully'});


    }catch(error){
        return res.json({success:false,message:error.message})
    }

}
