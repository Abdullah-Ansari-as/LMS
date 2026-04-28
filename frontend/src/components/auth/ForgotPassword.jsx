import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP, resetPassword } from '../../api/userApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowLeft, Save, CheckCircle2, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	const [loading, setLoading] = useState(false);
	
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [passwords, setPasswords] = useState({
		newPassword: '',
		confirmPassword: ''
	});

	const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

	// Handle Email Submission
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const result = await forgotPassword({ email });
			if (result.success) {
				toast.success(result.message);
				setStep(2);
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Failed to send OTP");
		} finally {
			setLoading(false);
		}
	};

	// Handle OTP Input Change
	const handleOtpChange = (index, value) => {
		if (isNaN(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		// Move to next input if value is entered
		if (value && index < 5) {
			otpRefs[index + 1].current.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			otpRefs[index - 1].current.focus();
		}
	};

	// Handle OTP Verification
	const handleVerifyOTP = async (e) => {
		e.preventDefault();
		const otpValue = otp.join('');
		if (otpValue.length < 6) {
			return toast.error("Please enter the full 6-digit OTP");
		}
		try {
			setLoading(true);
			const result = await verifyOTP({ email, otp: otpValue });
			if (result.success) {
				toast.success(result.message);
				setStep(3);
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Invalid OTP");
		} finally {
			setLoading(false);
		}
	};

	// Handle Password Reset
	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (passwords.newPassword !== passwords.confirmPassword) {
			return toast.error("Passwords do not match!");
		}
		if (passwords.newPassword.length < 6) {
			return toast.error("Password must be at least 6 characters long");
		}
		try {
			setLoading(true);
			const result = await resetPassword({ 
				email, 
				otp: otp.join(''), 
				newPassword: passwords.newPassword 
			});
			if (result.success) {
				toast.success(result.message);
				navigate("/login");
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900'>
			{/* Animated Background Elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
				<motion.div 
					animate={{ 
						scale: [1, 1.1, 1],
						x: [0, 30, 0],
						y: [0, -30, 0]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
					className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full"
				/>
				<motion.div 
					animate={{ 
						scale: [1, 1.2, 1],
						x: [0, -20, 0],
						y: [0, 40, 0]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full"
				/>
			</div>

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] mx-4"
			>
				<div className="p-8 md:p-10">
					<div className="mb-8">
						<Link to="/login" className='inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group mb-6'>
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
							<span className="text-sm">Return to Login</span>
						</Link>
						
						<AnimatePresence mode="wait">
							{step === 1 && (
								<motion.div
									key="step1-header"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
								>
									<h2 className='text-3xl font-black text-slate-900 tracking-tight'>Forgot Password?</h2>
									<p className="text-slate-500 text-sm mt-2 font-medium">Enter your email to receive a recovery OTP.</p>
								</motion.div>
							)}
							{step === 2 && (
								<motion.div
									key="step2-header"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
								>
									<h2 className='text-3xl font-black text-slate-900 tracking-tight'>Verify OTP</h2>
									<p className="text-slate-500 text-sm mt-2 font-medium">We've sent a 6-digit code to <span className="text-indigo-600 font-bold">{email}</span></p>
								</motion.div>
							)}
							{step === 3 && (
								<motion.div
									key="step3-header"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
								>
									<h2 className='text-3xl font-black text-slate-900 tracking-tight'>New Password</h2>
									<p className="text-slate-500 text-sm mt-2 font-medium">Create a strong password for your account.</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.form
								key="step1-form"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								onSubmit={handleEmailSubmit}
								className="space-y-6"
							>
								<div className="space-y-2">
									<label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
									<div className="relative group">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
										<input
											type="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
											placeholder='name@university.edu'
										/>
									</div>
								</div>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									disabled={loading}
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
								>
									{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
										<>
											Send OTP Code
											<ArrowRight className="w-4 h-4" />
										</>
									)}
								</motion.button>
							</motion.form>
						)}

						{step === 2 && (
							<motion.form
								key="step2-form"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								onSubmit={handleVerifyOTP}
								className="space-y-8"
							>
								<div className="flex justify-between gap-2">
									{otp.map((digit, index) => (
										<input
											key={index}
											ref={otpRefs[index]}
											type="text"
											maxLength={1}
											value={digit}
											onChange={(e) => handleOtpChange(index, e.target.value)}
											onKeyDown={(e) => handleKeyDown(index, e)}
											className="w-12 h-14 text-center text-xl font-black bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-indigo-600 shadow-sm"
										/>
									))}
								</div>

								<div className="space-y-4">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={loading}
										className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
									>
										{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
											<>
												Verify OTP
												<ShieldCheck className="w-4 h-4" />
											</>
										)}
									</motion.button>
									
									<button 
										type="button" 
										onClick={handleEmailSubmit}
										className="w-full text-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
									>
										Didn't receive code? <span className="text-indigo-600">Resend</span>
									</button>
								</div>
							</motion.form>
						)}

						{step === 3 && (
							<motion.form
								key="step3-form"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								onSubmit={handleResetPassword}
								className="space-y-6"
							>
								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
										<div className="relative group">
											<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
											<input
												type="password"
												required
												value={passwords.newPassword}
												onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
												className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
												placeholder='••••••••'
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
										<div className="relative group">
											<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
											<input
												type="password"
												required
												value={passwords.confirmPassword}
												onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
												className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
												placeholder='••••••••'
											/>
										</div>
									</div>
								</div>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									disabled={loading}
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
								>
									{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
										<>
											Reset Password
											<Save className="w-4 h-4" />
										</>
									)}
								</motion.button>
							</motion.form>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPassword;
