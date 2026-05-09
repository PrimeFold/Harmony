import { loginAction, logoutAction, signUpAction } from "@/app/api/auth/action"

export const login = async(email:string,password:string)=>{
    const {data} = await loginAction(email,password);
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
