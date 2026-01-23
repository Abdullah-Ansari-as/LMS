import React, { useState } from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword } from '../api/userApi';
import { toast } from 'sonner';

const ChangePassword = () => {
	const [form, setForm] = useState({
		email: '',
		currentPassword: '',
		newPassword: ''
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const result = await changePassword(form);
			if (result.success) {
				toast.success(result.message);
				setForm({
					email: '',
					currentPassword: '',
					newPassword: ''
				})
				navigate("/");
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		}
	}

	return (
		<div className="bg-[#F2F3F8] h-screen pt-17 px-3">

			<div className="flex flex-col items-center px-3 pt-11 md:px-10 md:py-6">
				<Link to="/" className='flex items-center gap-0'><HiOutlineArrowNarrowLeft /><p className='ml-1 mr-1 md:mr-4 hover:underline text-gray-600 hover:text-gray-800'>back to Home</p></Link>
				<h2 className='text-2xl mx-auto'>Change Password</h2>
			</div>


			<div className="max-w-md mx-auto mt-5 p-6 bg-white rounded-2xl shadow-md">
				<h2 className=" text-xl md:text-2xl font-semibold text-center mb-6 ">Change Password</h2>
				<form onSubmit={handleSubmit} className="space-y-5">

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder='Email Address'
							required
						/>
					</div>

					<div>
						<label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
						<input
							type="password"
							id="currentPassword"
							name="currentPassword"
							value={form.currentPassword}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder='Your current password'
							required
						/>
					</div>

					<div>
						<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
						<input
							type="password"
							id="newPassword"
							name="newPassword"
							value={form.newPassword}
							onChange={handleChange}
							className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder='Set new password (must atleast 3 characters)'
							required
						/>
					</div>

					<div className='w-full flex gap-2 mt-5'>
						<button
							type="submit"
							className="text-sm md:text-base p-2 cursor-pointer w-1/2 bg-blue-600 text-white md:py-2 rounded-lg hover:bg-blue-700 transition duration-200"
						>
							Update Password
						</button>
						<Link
							to="/"
							className="text-sm md:text-base p-2 flex items-center justify-center cursor-pointer w-1/2 bg-gray-400 text-white md:py-2 rounded-lg hover:bg-gray-500 transition duration-200"
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
