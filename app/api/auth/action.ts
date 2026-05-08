"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { signAccessToken,signRefreshToken, verifyRefreshToken} from "@/app/lib/jwt"; 
import bcrypt from 'bcrypt' 
import { loginSchema, signupSchema } from "@/app/utils/zod";

export const signUpAction = async (formData: FormData) => {

    const result = signupSchema.safeParse(formData);

    if(!result.success){
      return{
        success:false,
        message:"Enter details properly"
      }
    }
    const {username,email,password} = result.data;

    try {
      
      const existing = await prisma.user.findFirst({
        where:{email:email}
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
          username,
          email,
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

export const loginAction = async(formData:FormData)=>{
  const result = loginSchema.safeParse(formData);
  if(!result.success){
    return {
      success:false,
      message:"Enter credentials properly"
    }
  }

  const {email,password} = result.data;

  try {
    const existingUser= await prisma.user.findFirst({
      where:{email:email}
    })
    
    if(!existingUser){
      return{
        success:false,
        message:"User doesn't exist"
      }
    }

    const isValid = await bcrypt.compare(password,existingUser.password)
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
      maxAge:60 * 5, //5 mins
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
      }
    })
      
    return{
      success:true,
      message:"User logged in! ",
      data:{
        id:existingUser.id,
        username:existingUser.username,
        email:existingUser.email
      }
    }


  } catch (error) {
    return{
      success:false,
      message:"Login failed"
    }
  }
}

export const logout = async()=>{

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
    };
    
  } catch (error) {
    return{
      success:false,
      message:"Log out failed !"
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

