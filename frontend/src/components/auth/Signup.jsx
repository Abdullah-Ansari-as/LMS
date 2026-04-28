import React, { useState } from 'react'
import LMSLOGO from "/Logo-New.png"
import LoginImg from "/loginimg.png"
import { useDispatch } from 'react-redux';
import { userSignupSchema } from "../../schema/userSchema.js"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/userApi.js';
import { toast } from "sonner";
import { setUser } from '../../redux/slices/userSlice.js';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, BookOpen, Bell } from 'lucide-react';

const Signup = () => {
	const [input, setInput] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isEyeOff, setIsEyeOff] = useState(false);

	const toggleEye = () => {
		setIsEyeOff(!isEyeOff)
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInput({ ...input, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = userSignupSchema.safeParse(input);
		if (!result.success) {
			const fieldErrors = result.error.formErrors.fieldErrors;
			setErrors(fieldErrors)
		} else {
			try {
				const result = await register(input);
				if (result.success) {
					toast.success(result.message);
					dispatch(setUser(result.user));
					navigate("/");
				}
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || "Registration failed");
			}
		}

	}


	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900'>
			{/* Animated Background Elements - Softer for Light Theme */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
				<motion.div 
					animate={{ 
						scale: [1.2, 1, 1.2],
						rotate: [90, 0, 90],
						x: [50, 0, 50],
						y: [30, 0, 30]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full"
				/>
				<motion.div 
					animate={{ 
						scale: [1.3, 1, 1.3],
						rotate: [-90, 0, -90],
						x: [-40, 0, -40],
						y: [60, 0, 60]
					}}
					transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
					className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full"
				/>
			</div>

			<motion.div 
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-xl border border-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] mx-4"
			>
				{/* Right Section - Image & Quote (Hidden on mobile or moved) */}
				<div className="hidden md:block relative overflow-hidden">
					<img className="absolute inset-0 object-cover w-full h-full scale-105" src={LoginImg} alt="signup-hero" />
					<div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent opacity-80" />
					<div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
						>
							<h1 className="text-white text-4xl font-extrabold mb-8 tracking-tight drop-shadow-xl">
								Join the <br />
								<span className="text-indigo-300">Future</span> <br />
								of Learning
							</h1>
							<div className="max-w-xs mx-auto">
								<p className='text-white text-lg italic font-medium leading-relaxed mb-4 drop-shadow-lg'>
									"انسان اور اس کے کفر و شرک کے درمیان نماز نہ پڑھنے کا فرق ہے۔ مسلم شریف"
								</p>
								<div className="w-12 h-1 bg-white mx-auto rounded-full" />
							</div>
						</motion.div>
					</div>
				</div>

				{/* Left Section - Form */}
				<div className="p-8 md:p-12 flex flex-col justify-center bg-white/40">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-8 text-center md:text-left"
					>
						<img className='h-12 mb-6 mx-auto md:mx-0 object-contain drop-shadow-sm' src={LMSLOGO} alt="lms-logo" />
						<h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
						<p className="text-slate-500 text-sm">Join our student community today</p>
					</motion.div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-1.5">
							<label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
							<div className="relative group">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<input
									type='text'
									name='name'
									className='w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm'
									placeholder='John Doe'
									value={input.name}
									onChange={handleChange}
								/>
							</div>
							<AnimatePresence>
								{errors.name && (
									<motion.span 
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="text-xs text-red-500 block ml-1 font-medium"
									>
										{errors.name}
									</motion.span>
								)}
							</AnimatePresence>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
							<div className="relative group">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<input
									type='email'
									name='email'
									className='w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm'
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

						<div className="space-y-1.5">
							<label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
							<div className="relative group">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<input
									type={isEyeOff ? "text" : "password"}
									name='password'
									className='w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2.5 pl-10 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm'
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
							Sign Up
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</motion.button>
					</form>

					<div className="mt-6 text-center">
						<p className='text-slate-600 text-sm'>
							Already have an account? <Link to="/login" className='text-indigo-600 font-bold hover:underline transition-colors'>Sign In</Link>
						</p>
					</div>

					<div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-6">
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
			</motion.div>
		</div>
	)
}

export default Signup
