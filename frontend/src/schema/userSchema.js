import {z} from "zod";

export const userLoginSchema = z.object({
	email: z.string().email("Please Enter a valid email address"),
	password: z.string().min(3, "password must be atleast 3 characters!")
})

export const userSignupSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please Enter a valid email address"),
	password: z.string().min(3, "password must be atleast 3 characters!")
})

