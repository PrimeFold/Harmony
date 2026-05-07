import  { z } from 'zod'

export const signupSchema = z.object({
    username:z.string().min(4).max(20),
    email:z.email(),
    password:z.string().min(8),
})

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(8)
})

export const projectSchema = z.object({
    name:z.string().min(4).max(20)
})

