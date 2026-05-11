import { changeEmailAction, changePasswordAction, changeUsernameAction, forgotPasswordAction, loginAction, logoutAction, signUpAction } from "@/app/api/auth/action"

export const login = async(email:string,password:string)=>{
    const data = await loginAction(email,password);
    return data;
}

export const logout = async()=>{
    const response = await logoutAction();
    if(!response.success){
        throw new Error(response.message)
    }
}

export const signup = async(username:string,email:string,password:string)=>{
    const {data} = await signUpAction(username,email,password);
    return data;
}

export const resetPassword = async(email:string,password:string)=>{
    const {data} = await forgotPasswordAction(email,password);
    return data;
}

export const changeUsername = async(username:string,userId:string)=>{
    const data = await changeUsernameAction(username,userId);
    return data;
}

export const changeEmail = async(email:string,userId:string)=>{
    const data= await changeEmailAction(email,userId);
    return data;
}
export const changePassword = async(currentPassword:string,newPassword:string,userId:string)=>{
    const data = await changePasswordAction(currentPassword,newPassword,userId);
    return data;
}


