"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { signAccessToken,signRefreshToken, verifyRefreshToken} from "@/app/lib/jwt"; 
import bcrypt from 'bcrypt' 
import { loginSchema, signupSchema } from "@/app/utils/zod";


export const signUpAction = async (username: string, email: string, password: string) => {
    const result = signupSchema.safeParse({username,email,password});

    if(!result.success){
      return{
        success:false,
        message:"Enter details properly"
      }
    }
    const { username: validUsername, email: validEmail, password: validPassword } = result.data;

    try {
      
      const existing = await prisma.user.findFirst({
        where:{email:validEmail}
      })

      if(existing){
        return{
          success:false,
          message:"user already exists !"
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12);
  
      const user = await prisma.user.create({
        data: {
          username:validUsername,
          email:validEmail,
          password: hashedPassword,
        },
      });
  
      
      return {
        success: true,
        message: "Account created !",
        data:{
          id:user.id,
          email:user.email,
          username:user.username
        }
      };
  
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { success: false, message: "Email or Username already taken" };
      }
      return {
        success: false,
        message: "Failed to create user",
      };
    }
};

export const loginAction = async( email: string, password: string)=>{
  const result = loginSchema.safeParse({email,password});
  if(!result.success){
    return {
      success:false,
      message:"Enter credentials properly"
    }
  }

  const {email:validEmail,password:validPassword} = result.data;
  try {
    const existingUser= await prisma.user.findFirst({
      where:{email:validEmail},
    })

    if(!existingUser){
      return{
        success:false,
        message:"User not found"
      }
    }

    const isValid = await bcrypt.compare(validPassword,existingUser.password)
    if(!isValid){
      return{
        success:false,
        message:"Password is invalid"
      }
    }

    const accessToken = await signAccessToken({userId:existingUser.id})
    const refreshToken = await signRefreshToken({userId:existingUser.id})
    const cookieStore = await cookies()
    
     cookieStore.set("access-token",accessToken ,{
      httpOnly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:"lax",
      path:"/",
      maxAge:60 * 15, //5 mins
    })

    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    
    await prisma.refreshToken.create({
      data:{
          userId:existingUser.id ,
          token:refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
    })
      
    return{
      success:true,
      message:"User logged in! ",
      data:{
        id:existingUser.id,
        username:existingUser.username,
        email:existingUser.email,
      }
    }


  } catch (error) {
    return{
      success:false,
      message:"Login failed"
    }
  }
}

export const logoutAction = async()=>{

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh-token')?.value;
  try {
    if(refreshToken){
      await prisma.refreshToken.deleteMany({
        where:{token:refreshToken}
      })
      cookieStore.delete("refresh-token")
    }

    cookieStore.delete("access-token")

    return {
        success: true,
        message: "Logged out successfully",
        error:""
    };
    
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message,
     
    }
  }

}

export const generateRefreshToken = async()=>{
  const cookieStore = await cookies()
  const refreshTokenFromCookie = cookieStore.get("refresh-token")?.value
  
  try {
    if(!refreshTokenFromCookie){
    return {success:false,message:"No refresh token"}
  }

  const decoded = await verifyRefreshToken(refreshTokenFromCookie)

  if (!decoded || decoded.type !== 'refresh') {
    return { success: false, message: "Invalid refresh token" }
  }

  const existingTokenInDb = await prisma.refreshToken.findMany({
    where:{token:refreshTokenFromCookie}
  })

  if(!existingTokenInDb){
    cookieStore.delete("access-token")
    cookieStore.delete("refresh-token")
    return { success: false, message: "Session expired" }
  }

  const newAccessToken= await signAccessToken({userId:decoded.userId})
  
  cookieStore.set('access-token',newAccessToken,{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15
  })

  return{
    success:true,
    message:"token rotated , new access token sent"
  }

  } catch (error) {
    return{
      success:false,
      message:"Failed to rotate token.."
    }
  }

}
export const forgotPasswordAction = async (email: string, newPassword: string) => {
  const result = loginSchema.safeParse({email,newPassword})
  if(!result.success){
    throw new Error("Enter details properly")
  }  
  const {email:validEmail,password:validNewPassword} = result.data;
  try {
    const user = await prisma.user.findFirst({ where: { email:validEmail } });

    if (!user) {
      return { success: false, message: "No account found with that email." };
    }

    const hashedPassword = await bcrypt.hash(validNewPassword, 12);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select:{
        id:true,
        username:true,
        email:true,
        projects:true
      }
    });

    return { success: true, message: "Password updated successfully." , data:updatedUser };
  } catch (error) {
    return { success: false, message: "Failed to update password." };
  }
};


export const changeUsernameAction = async(username:string,userId:string)=>{

  try {
    const user = await  prisma.user.update({
      where:{id:userId},
      data:{
        username:username
      },
      select:{
        id:true,
        email:true,
        username:true,
      }
    })

    if(!user){
      return{
        success:false,
        message:"Couldn't update username"
      }
    }
    return{
      success:true,
      message:"Username updated successfully!",
      data:user
    }

  } catch (error) {
      return{
        success:false,
        message:(error as Error).message
    }
  }
}
export const changeEmailAction = async(email:string,userId:string)=>{

  try {
    const user = await  prisma.user.update({
      where:{id:userId},
      data:{
        email:email
      },
      select:{
        id:true,
        email:true,
        username:true,
      }
    })

    if(!user){
      return{
        success:false,
        message:"Couldn't update email"
      }
    }
    return{
      success:true,
      message:"Email updated successfully!",
      data:user
    }

  } catch (error) {
      return{
        success:false,
        message:(error as Error).message
    }
  }
}

export const changePasswordAction = async(currentPassword:string,newPassword:string,userId:string)=>{

  try {

    const currentUser = await prisma.user.findUnique({
      where:{id:userId},
      select:{
        password:true
      }
    })

    if(!currentUser){
      return {
        success:false,
        message:"User not found !"
      }
    }

    const isValid = await bcrypt.compare(currentPassword,currentUser.password)

    if(!isValid){
      return{
        success:false,
        message:"Invalid current password",
        data:null
      }
    }

    const newPasswordHash = await bcrypt.hash(newPassword,12);
    const updatedUser = await  prisma.user.update({
      where:{id:userId},
      data:{
        password:newPasswordHash
      },
      select:{
        id:true,
        email:true,
        username:true,
      }
    })

    if(!updatedUser){
      return{
        success:false,
        message:"Couldn't update email"
      }
    }
    return{
      success:true,
      message:"Email updated successfully!",
      data:updatedUser
    }

  } catch (error) {
      return{
        success:false,
        message:(error as Error).message
    }
  }
}

