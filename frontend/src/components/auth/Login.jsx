import React, { useState } from 'react'
import LMSLOGO from "/Logo-New.png"
import LoginImg from "/loginimg.png"
import { userLoginSchema } from "../../schema/userSchema.js"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/userApi.js';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '../../redux/slices/userSlice.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen, Bell } from 'lucide-react';


const Login = () => {
	const [input, setInput] = useState({
		email: "",
		password: ""
	});
	const [errors, setErrors] = useState({});

	const [isEyeOff, setIsEyeOff] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const toggleEye = () => {
		setIsEyeOff(!isEyeOff)
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput({ ...input, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = userLoginSchema.safeParse(input);
		if (!result.success) {
			const fieldErrors = result.error.formErrors.fieldErrors;
			setErrors(fieldErrors)
		} else {
			try {
				const result = await login(input);
				if (result.success) {
					toast.success(result.message);
					dispatch(setUser(result.user));
					navigate("/");
				}
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || "Something went wrong");
			}
		}

	}


	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900'>
			{/* Animated Background Elements - Softer for Light Theme */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
				<motion.div 
					animate={{ 
						scale: [1, 1.1, 1],
						rotate: [0, 45, 0],
						x: [0, 30, 0],
						y: [0, 20, 0]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full"
				/>
				<motion.div 
					animate={{ 
						scale: [1, 1.2, 1],
						rotate: [0, -45, 0],
						x: [0, -30, 0],
						y: [0, 40, 0]
					}}
					transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
					className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full"
				/>
			</div>

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-xl border border-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] mx-4"
			>
				{/* Left Section - Form */}
				<div className="p-8 md:p-12 flex flex-col justify-center bg-white/40">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-10 text-center md:text-left"
					>
						<img className='h-12 mb-6 mx-auto md:mx-0 object-contain drop-shadow-sm' src={LMSLOGO} alt="lms-logo" />
						<h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Student Login</h2>
						<p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
					</motion.div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
							<div className="relative group">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<input
									type='email'
									name='email'
									className='w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm'
									placeholder='name@university.edu'
									value={input.email}
									onChange={handleChange}
								/>
							</div>
							<AnimatePresence>
								{errors.email && (
									<motion.span 
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="text-xs text-red-500 block ml-1 font-medium"
									>
										{errors.email}
									</motion.span>
								)}
							</AnimatePresence>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between items-center px-1">
								<label className="text-sm font-semibold text-slate-700">Password</label>
								<Link to="/forgot-password" >
									<span className='text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors'>Forgot password?</span>
								</Link>
							</div>
							<div className="relative group">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<input
									type={isEyeOff ? "text" : "password"}
									name='password'
									className='w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm'
									placeholder='••••••••'
									value={input.password}
									onChange={handleChange}
								/>
								<button 
									type="button"
									onClick={toggleEye}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
								>
									{isEyeOff ? <IoIosEye className="h-6 w-6" /> : <IoIosEyeOff className="h-6 w-6" />}
								</button>
							</div>
							<AnimatePresence>
								{errors.password && (
									<motion.span 
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="text-xs text-red-500 block ml-1 font-medium"
									>
										{errors.password}
									</motion.span>
								)}
							</AnimatePresence>
						</div>

						<motion.button 
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							type='submit' 
							className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer group'
						>
							Sign In
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</motion.button>
					</form>

					<div className="mt-8 text-center">
						<p className='text-slate-600 text-sm'>
							Don't have an account? <Link to="/signup" className='text-indigo-600 font-bold hover:underline transition-colors'>Create Account</Link>
						</p>
					</div>

					<div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-6">
						<Link to="/notice-board" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors group">
							<Bell className="w-4 h-4 text-indigo-500 group-hover:animate-bounce" />
							Notice Board
						</Link>
						<Link to="#" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors group">
							<BookOpen className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
							Hand Book
						</Link>
					</div>
				</div>

				{/* Right Section - Image & Quote */}
				<div className="hidden md:block relative overflow-hidden">
					<img className="absolute inset-0 object-cover w-full h-full scale-105" src={LoginImg} alt="login-hero" />
					<div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent opacity-80" />
					<div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 }}
							className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
						>
							<h1 className="text-white text-4xl font-extrabold mb-8 tracking-tight drop-shadow-xl">
								Learning <br />
								<span className="text-indigo-300">Management</span> <br />
								System
							</h1>
							<div className="max-w-xs mx-auto">
								<p className='text-white text-lg italic font-medium leading-relaxed mb-4 drop-shadow-lg'>
									"If you think a thing is impossible, you'll make it impossible."
								</p>
								<div className="w-12 h-1 bg-white mx-auto rounded-full" />
								<p className="text-indigo-200 mt-4 font-bold tracking-wider uppercase text-xs">Bruce Lee</p>
							</div>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default Login
