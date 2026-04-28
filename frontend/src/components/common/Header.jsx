import React, { useRef, useState } from 'react'
import LogoImg from "/Logo-New.png"
import { GoBell } from "react-icons/go";
import courseBG from "/courcebg.png"
import { PiPassword } from "react-icons/pi"
import { IoBagCheckOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import LogoImgDark from "/VuLogoDark.png"
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '../../api/userApi';
import { toast } from 'sonner';
import { setAllStudents, setLogout, setUser } from '../../redux/slices/userSlice';
import { setCourses } from '../../redux/slices/courseSlice';
import { Loader2, Menu, X, Bell, Bot, LogOut, History, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";



const Header = ({ toggleSidebar, sidebarOpen }) => {
	const modalRef = useRef();
	const imgRef = useRef(null);
	const inputRef = useRef(null);

	const { user } = useSelector((store) => store.user);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const changePassword = () => {
		modalRef.current?.close()
		navigate("/settings/change-password")
	}

	const myLoginHistory = () => {
		modalRef.current?.close()
		navigate("/settings/myloginhistory")
	}

	const fileChangeHandler = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onloadend = async () => {
			const base64String = reader.result;

			try {
				setLoading(true)
				const result = await updateProfilePicture({ file: base64String });
				if (result.success) {
					setLoading(false)
					dispatch(setUser(result.updatedStudent));
					toast.success("Profile picture updated!");
				}
			} catch (error) {
				setLoading(false);
				console.error(error);
				toast.error("Failed to update profile picture");
			}
		};

		reader.readAsDataURL(file);
	};

	const logoutHandler = () => {
		dispatch(setLogout());
		dispatch(setCourses([]));
		dispatch(setAllStudents([]))
		localStorage.removeItem("token");
		navigate("/login");
		toast.success("Logged out successfully!");
	}

	return (
		<header className='w-full lg:w-[81%] flex-1 h-20 bg-white/80 backdrop-blur-md z-40 fixed top-0 border-b border-slate-200/60'>
			<div className='h-full flex items-center justify-between px-4 md:px-8'>

				{/* Left Side - Brand & Toggle */}
				<div className='flex items-center gap-4'>
					<button 
						onClick={toggleSidebar}
						className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
					>
						{sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>

					<Link to="/" className="flex items-center gap-3">
						<img className='h-10 w-auto object-contain hidden md:block' src={LogoImg} alt="Logo" />
						<img className='h-8 w-auto object-contain md:hidden' src={LogoImgDark} alt="Logo" />
						<div className="hidden lg:flex flex-col">
							<h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">LMS</h1>
							<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal</span>
						</div>
					</Link>
				</div>

				{/* Right Side - Actions & Profile */}
				<div className='flex items-center gap-2 md:gap-4'>
					
					{/* Desktop Actions */}
					<div className='hidden md:flex items-center gap-2 pr-4 border-r border-slate-100'>
						<Link
							to="/chatbot"
							className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group"
							title="AI Assistant"
						>
							<Bot className='w-5.5 h-5.5 transition-transform group-hover:scale-110' />
						</Link>

						<Link
							to="/noticeboard"
							className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group relative"
							title="Notifications"
						>
							<Bell className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
							<span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
						</Link>
					</div>

					{/* User Profile */}
					<div 
						onClick={() => modalRef.current?.showModal()}
						className='flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-2xl transition-all group'
					>
						<div className='hidden md:flex flex-col text-right'>
							<span className='text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors'>{user?.name}</span>
							<span className='text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider'>Student</span>
						</div>
						
						<div className="relative">
							<img 
								className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm" 
								src={user?.profilePicture} 
								alt="Profile" 
							/>
							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
						</div>
						<ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all" />
					</div>

					{/* Admin Shortcut */}
					{user?.role === "admin" && (
						<button 
							onClick={() => navigate("/admin")}
							className='hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ml-2'
						>
							<ShieldCheck className="w-3.5 h-3.5" />
							ADMIN
						</button>
					)}
				</div>
			</div>

			{/* Profile Modal - Modern Redesign */}
			<dialog id="my_modal_2" className="modal backdrop-blur-sm" ref={modalRef}>
				<div className="modal-box bg-white p-0 rounded-3xl border border-slate-200 shadow-2xl w-[90%] max-w-sm overflow-hidden">
					{/* Header Background */}
					<div className="h-28 bg-gradient-to-br from-indigo-600 to-violet-700 relative">
						<div className="absolute -bottom-10 left-8">
							<div className="relative group">
								<img 
									className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white object-cover shadow-lg shadow-indigo-200" 
									src={user?.profilePicture} 
									alt="User Avatar" 
								/>
								<button 
									onClick={() => inputRef.current?.click()}
									className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
								>
									{loading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <User className="w-6 h-6 text-white" />}
								</button>
								<input 
									type="file" 
									className="hidden" 
									ref={inputRef} 
									onChange={fileChangeHandler} 
									accept="image/*" 
								/>
							</div>
						</div>
					</div>

					{/* User Details */}
					<div className="pt-12 px-8 pb-8">
						<div className="mb-6">
							<h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{user?.name}</h3>
							<p className="text-sm font-medium text-slate-500">{user?.email}</p>
						</div>

						{/* Menu Items */}
						<div className="space-y-1 mb-8">
							<button 
								onClick={changePassword}
								className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group font-semibold text-sm"
							>
								<PiPassword className="w-5 h-5 transition-transform group-hover:scale-110" />
								Change Password
							</button>
							<button 
								onClick={myLoginHistory}
								className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group font-semibold text-sm"
							>
								<History className="w-5 h-5 transition-transform group-hover:scale-110" />
								Login History
							</button>
						</div>

						{/* Logout Button */}
						<button 
							onClick={logoutHandler}
							className="w-full py-3 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-100 hover:border-red-100"
						>
							<LogOut className="w-4 h-4" />
							Sign Out
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</header>
	)
}

export default Header
