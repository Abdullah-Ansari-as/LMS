import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP, resetPassword } from '../api/userApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
	const { user } = useSelector((store) => store.user);
	const navigate = useNavigate();
	const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	const [loading, setLoading] = useState(false);
	
	const [email, setEmail] = useState(user?.email || '');
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [passwords, setPasswords] = useState({
		newPassword: '',
		confirmPassword: ''
	});

	const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

	// Handle Email Submission (Sending OTP)
	const handleSendOTP = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const result = await forgotPassword({ email });
			if (result.success) {
				toast.success("Verification code sent to your email!");
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
				toast.success("Identity verified!");
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
			return toast.error("Password must be at least 6 characters");
		}
		try {
			setLoading(true);
			const result = await resetPassword({ 
				email, 
				otp: otp.join(''), 
				newPassword: passwords.newPassword 
			});
			if (result.success) {
				toast.success("Password updated successfully!");
				navigate("/");
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-20 bg-[#f8fafc] min-h-screen py-12 px-4 md:px-8 lg:px-12 font-sans">
			<motion.div 
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-xl mx-auto"
			>
				{/* Header */}
				<div className="flex items-center gap-4 mb-10">
					<div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
						<KeyRound className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Settings</h2>
						<p className="text-slate-500 text-sm font-medium mt-1">Update your login credentials safely</p>
					</div>
				</div>

				{/* Step Progress Indicator */}
				<div className="flex items-center justify-between mb-12 px-4 relative">
					<div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
					{[1, 2, 3].map((s) => (
						<div 
							key={s} 
							className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
								step >= s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-slate-300 border-2 border-slate-100"
							}`}
						>
							{step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
						</div>
					))}
				</div>

				<motion.div 
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 md:p-12"
				>
					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.form
								key="step1"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								onSubmit={handleSendOTP}
								className="space-y-8"
							>
								<div>
									<h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Step 1: Verify Email</h3>
									<p className="text-slate-500 text-sm font-medium">Confirm your email address to receive a secure OTP.</p>
								</div>

								<div className="space-y-2">
									<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
									<div className="relative group">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
										<input
											type="email"
											required
											readOnly={!!user}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold shadow-sm'
											placeholder='name@university.edu'
										/>
									</div>
									{user && <p className="text-[10px] font-bold text-indigo-500 mt-2 px-1 uppercase tracking-tighter italic">Logged in as {user.name}</p>}
								</div>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									disabled={loading}
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
								>
									{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
										<>
											Send Verification Code
											<ArrowRight className="w-5 h-5" />
										</>
									)}
								</motion.button>
							</motion.form>
						)}

						{step === 2 && (
							<motion.form
								key="step2"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								onSubmit={handleVerifyOTP}
								className="space-y-8"
							>
								<div>
									<h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Step 2: Enter OTP</h3>
									<p className="text-slate-500 text-sm font-medium">We've sent a code to <span className="text-indigo-600 font-bold">{email}</span></p>
								</div>

								<div className="flex justify-between gap-2 md:gap-4">
									{otp.map((digit, index) => (
										<input
											key={index}
											ref={otpRefs[index]}
											type="text"
											maxLength={1}
											value={digit}
											onChange={(e) => handleOtpChange(index, e.target.value)}
											onKeyDown={(e) => handleKeyDown(index, e)}
											className="w-full h-16 text-center text-2xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all text-indigo-600 shadow-sm"
										/>
									))}
								</div>

								<div className="space-y-4">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={loading}
										className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
									>
										{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
											<>
												Verify OTP
												<ShieldCheck className="w-5 h-5" />
											</>
										)}
									</motion.button>
									
									<button 
										type="button" 
										onClick={handleSendOTP}
										className="w-full text-center text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
									>
										Didn't get code? <span className="text-indigo-600">Resend Now</span>
									</button>
								</div>
							</motion.form>
						)}

						{step === 3 && (
							<motion.form
								key="step3"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								onSubmit={handleResetPassword}
								className="space-y-8"
							>
								<div>
									<h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Step 3: New Password</h3>
									<p className="text-slate-500 text-sm font-medium">Please enter your new secure password.</p>
								</div>

								<div className="space-y-6">
									<div className="space-y-2">
										<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
										<div className="relative group">
											<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
											<input
												type="password"
												required
												value={passwords.newPassword}
												onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
												className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold shadow-sm'
												placeholder='••••••••'
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
										<div className="relative group">
											<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
											<input
												type="password"
												required
												value={passwords.confirmPassword}
												onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
												className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold shadow-sm'
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
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
								>
									{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
										<>
											Complete Reset
											<Save className="w-5 h-5" />
										</>
									)}
								</motion.button>
							</motion.form>
						)}
					</AnimatePresence>
				</motion.div>
				
				<div className="mt-10 flex justify-center">
					<Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all group">
						<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Cancel and return
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default ChangePassword;
