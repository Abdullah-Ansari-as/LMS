import React, { useState } from 'react'
import LMSLOGO from "/Logo-New.png"
import LoginImg from "/loginimg.png"
import { useDispatch, useSelector } from 'react-redux';
import { FaBell, FaBook } from "react-icons/fa6";
import { userSignupSchema } from "../../schema/userSchema.js"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/userApi.js';
import { toast } from "sonner";
import { setUser } from '../../redux/slices/userSlice.js';


const Login = () => {
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
				toast.error(error.response.data.message);
			}
		}

	}


	return (
		<div className='w-full grid grid-cols-1 md:grid-cols-2 tracking-tighter'>
			{/* Topbar at mobile screen */}
			<div className='md:hidden relative'>
				<img className='h-12 w-full object-cover' src={LoginImg} alt="lmsLoginImg" />
				<div className="absolute top-0 left-0 w-full h-12 flex justify-center items-center">
					<h1 className="text-white text-xl font-bold tracking-wider text-outline text-center">
						Learning Management System
					</h1>
				</div>
			</div>
			{/* Left Section */}
			<div className="bg-white md:w-auto flex justify-center my-4 md:mt-14">
				<form onSubmit={handleSubmit}>
					<img className='mx-auto' src={LMSLOGO} alt="lms-picture" />
					<div className='my-5 flex flex-col'>
						<input
							type='text'
							name='name'
							className='bg-[#e8f0fe] w-[19rem] mt-2 md:mt-7 rounded-md p-2.5 focus:outline-none focus:ring-0'
							placeholder='Fullname'
							value={input.name}
							onChange={handleChange}
						/>
						{errors && <span className="text-sm text-red-500">{errors.name}</span>}
					</div>
					<div className='my-5 flex flex-col'>
						<input
							type='email'
							name='email'
							className='bg-[#e8f0fe] w-[19rem] rounded-md p-2.5 focus:outline-none focus:ring-0'
							placeholder='Email Address'
							value={input.email}
							onChange={handleChange}
						/>
						{errors && <span className="text-sm text-red-500">{errors.email}</span>}
					</div>
					<div className='my-5 flex flex-col relative'>
						<input
							type={!isEyeOff ? "password" : "text"}
							name='password'
							className='bg-[#e8f0fe] w-[19rem] rounded-md p-2.5 focus:outline-none focus:ring-0'
							placeholder='password'
							value={input.password}
							onChange={handleChange}
						/>
						{isEyeOff ?
							<IoIosEye onClick={toggleEye} className='text-blue-500 absolute top-3 right-3 h-6 w-6 cursor-pointer' />
							:
							<IoIosEyeOff onClick={toggleEye} className='text-blue-500 absolute top-3 right-3 h-6 w-6 cursor-pointer' />}

						{errors && <span className="text-sm text-red-500">{errors.password}</span>}
					</div>

					<div className='mt-5 md:mt-7 mb-7 md:mb-14'>
						<button type='submit' className='bg-blue-600 hover:bg-blue-700 w-32 flex justify-center mx-auto rounded-4xl text-white px-4 py-2 text-lg cursor-pointer'>Sign Up</button>
						<p className='text-sm mt-4'>if already have an account? <Link to="/login" className='text-sm text-blue-500 hover:underline cursor-pointer'>SignIn</Link></p>
					</div>

					<div className='my-5'>
						<p className='text-[#5F57C3] underline flex flex-row items-center gap-1'><FaBell /> <Link to="/notice-board" >Notice Board</Link></p>
					</div>
					<div className='mt-5'>
						<p className='text-[#5F57C3] underline flex flex-row items-center gap-1'><FaBook /> <span>Student Hand Book</span></p>
					</div>
				</form>

			</div>

			{/* Right Section */}
			<div className="hidden md:flex md:h-screen relative  ">
				<img className="object-cover w-full h-full" src={LoginImg} alt="" />

				<div className="absolute inset-0 flex items-center justify-center bg-black/20 flex-col gap-8">
					<h1 className="text-white text-4xl md:text-5xl font-bold tracking-tighter text-outline text-center px-6">
						Learning Management System
					</h1>
					<p className='text-outline-2 text-lg text-white mx-5'>" انسان اور اس کے کفر و شرک کے درمیان نماز نہ پڑھنے کا فرق ہے۔ مسلم شریف "</p>
				</div>
			</div>

		</div>
	)
}

export default Login
