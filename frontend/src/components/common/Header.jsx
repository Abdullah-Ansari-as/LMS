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
import { Loader2 } from 'lucide-react';
import { FiAlignRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";


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
		document.getElementById("my_modal_2").close()
		navigate("/settings/change-password")
	}

	const myLoginHistory = () => {
		document.getElementById("my_modal_2").close()
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
				}
			} catch (error) {
				setLoading(false);
				console.error(error);
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
		<div className='w-full lg:w-[81%] flex-1 h-18 bg-[#282a3c] md:bg-white z-50 fixed top-0 shadow-md'>
			<div className='h-full flex items-center justify-between mx-5 md:mx-10'>

				<div className='flex items-center'>

					<div className="hidden md:flex lg:hidden mr-3">
						<AnimatePresence mode="wait" initial={false}>
							{sidebarOpen ? (
								<motion.div
									key="close"
									initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
									animate={{ opacity: 1, rotate: 0, scale: 1 }}
									exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
									transition={{ duration: 0.2 }}
								>
									<RxCross2 onClick={toggleSidebar} className="text-black w-7 h-7 cursor-pointer" />
								</motion.div>
							) : (
								<motion.div
									key="open"
									initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
									animate={{ opacity: 1, rotate: 0, scale: 1 }}
									exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
									transition={{ duration: 0.2 }}
								>
									<FiAlignRight onClick={toggleSidebar} className="text-black w-7 h-7 cursor-pointer" />
								</motion.div>
							)}
						</AnimatePresence>
					</div>


					<Link to="/"><img className='hidden md:flex h-10 w-auto items-center my-auto' src={LogoImg} alt="" /></Link>
					<Link to="/"><img className='flex md:hidden h-10 w-auto items-center my-auto' src={LogoImgDark} alt="" /></Link> 
					<p className='text-2xl pl-5 hidden md:flex'>Learning Management System</p>
				</div>

				<div className="flex md:hidden">

					<AnimatePresence mode="wait" initial={false}>
						{sidebarOpen ? (
							<motion.div
								key="close"
								initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
								animate={{ opacity: 1, rotate: 0, scale: 1 }}
								exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
								transition={{ duration: 0.2 }}
							>
								<RxCross2 onClick={toggleSidebar} className="text-gray-300 hover:text-gray-200 w-7 h-7 cursor-pointer" />
							</motion.div>
						) : (
							<motion.div
								key="open"
								initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
								animate={{ opacity: 1, rotate: 0, scale: 1 }}
								exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
								transition={{ duration: 0.2 }}
							>
								<FiAlignRight onClick={toggleSidebar} className="text-gray-300 hover:text-gray-200 w-7 h-7 cursor-pointer" />
							</motion.div>
						)}
					</AnimatePresence>

					<BiDotsVerticalRounded onClick={() => setIsOpen((prev) => !prev)} className='text-gray-300 hover:text-gray-200 ml-1.5 w-6.5 h-6.5' />
				</div>

				{/* Navbar for lg screens */}
				<div className='md:flex items-center hidden'>
					{
						user?.role === "admin" && <div>
							<span onClick={() => navigate("/admin")} className='bg-gray-600 hover:bg-gray-700 rounded-2xl tracking-wide text-white text-sm px-2 py-1 cursor-pointer'>
								Admin
							</span>
						</div>
					}
					<div className='mx-5'>
						<Link
							to="/noticeboard"
							className="inline-block transition duration-300 ease-in-out hover:scale-110 hover:text-yellow-500 hover:drop-shadow-lg"
						>
							<GoBell className="h-6 w-6 text-primary" />
						</Link>

					</div>

					<div className='flex flex-col mx-auto w-full'>
						<span className='text-[13px] uppercase tracking-wide text-gray-600'>{user?.name}</span>
						<p className='text-xs text-gray-600'>({user?.email})</p>
					</div>

					<div className='mr-2 cursor-pointer' onClick={() => document.getElementById('my_modal_2').showModal()}>
						<img className="w-20 h-11 rounded-full object-cover" title='change profile' src={user?.profilePicture} alt="" />
					</div>
				</div>

			</div>

			{/* Navbar for sm screens */}
			<div className={`
				md:hidden
				h-15 flex bg-white items-center justify-end
				transform transition-all duration-300
				${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
				
			`}>
				{
					user?.role === "admin" && <div>
						<span onClick={() => navigate("/admin")} className='bg-gray-600 hover:bg-gray-700 rounded-2xl tracking-wide text-white text-sm px-2 py-1 cursor-pointer'>
							Admin
						</span>
					</div>
				}
				<div className='mx-3'>
					<Link
						to="/noticeboard"
						className="inline-block transition duration-300 ease-in-out hover:scale-110 hover:text-yellow-500 hover:drop-shadow-lg"
					>
						<GoBell className="h-6 w-6 text-primary" />
					</Link>
				</div>

				<div className='flex flex-col'>
					<span className='text-[13px] uppercase tracking-wide text-gray-600'>{user?.name}</span>
					<p className='text-xs text-gray-600'>({user?.email})</p>
				</div>

				<div className='mx-4 cursor-pointer' onClick={() => document.getElementById('my_modal_2').showModal()}>
					<img className="w-11 h-11 rounded-full object-cover" src={user?.profilePicture} alt="" />
				</div>
			</div>


			<dialog id="my_modal_2" className="modal" ref={modalRef} >
				<div className="modal-box absolute top-34 md:top-20 right-5 w-68 md:w-82 h-84 p-0">
					<div className="relative">
						<img className='h-26 md:h-30 w-full object-cover' src={courseBG} alt="courseBgImg" />
						<div className="absolute inset-0 flex justify-start items-center gap-2">

							{loading ? (
								<div className="flex items-center justify-center px-14"><Loader2 className='w-7 h-7 animate-spin' /></div>
							) : (
								<div
									className="relative w-20 h-20 md:w-24 md:h-24 ml-10 group"
									onClick={() => inputRef.current?.click()}
								>
									{/* Hidden File Input */}
									<input
										type="file"
										accept="image/*"
										name="profilePicture"
										className="hidden"
										onChange={(e) => fileChangeHandler(e)}
										ref={inputRef}
									/>

									{/* Profile Image */}
									<img
										ref={imgRef}
										className="w-full h-full rounded-full object-cover"
										src={user?.profilePicture}
										alt="Profile"
									/>

									{/* Overlay with camera icon */}
									<div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-60 transition-opacity duration-300 cursor-pointer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 7h4l2-3h6l2 3h4v13H3V7z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 11a3 3 0 100 6 3 3 0 000-6z"
											/>
										</svg>
									</div>
								</div>

							)}


							<div className='flex flex-col ml-0 md:ml-3'>
								<p className='text-gray-200 text-lg mb-0.5 uppercase'>{user?.name}</p>
								<p className='text-gray-300 text-xs overflow-x-hidden'>{user?.email}</p>
							</div>
						</div>
					</div>

					<div className='my-5'>
						<div className="flex items-center justify-start mx-5 hover:text-blue-400" >
							<PiPassword className='w-5 h-5' />
							<p onClick={changePassword} className='p-3 text-base text-gray-700 hover:text-blue-400 cursor-pointer'>Change Password</p>
						</div>
						<div className="flex items-center justify-start mx-5 hover:text-blue-400">
							<IoBagCheckOutline className='w-5 h-5' />
							<p onClick={myLoginHistory} className='p-3 text-base text-gray-700 hover:text-blue-400 cursor-pointer'>My Login History</p>
						</div>
					</div>


					<button onClick={logoutHandler} className='text-blue-500 hover:text-blue-600 outline py-2 px-4 rounded-3xl hover:bg-gray-100 ml-5 cursor-pointer'>
						Logout
					</button>

				</div>
				<form method="dialog" className="modal-backdrop">
					<button></button>
				</form>

			</dialog>

		</div>
	)
}

export default Header
