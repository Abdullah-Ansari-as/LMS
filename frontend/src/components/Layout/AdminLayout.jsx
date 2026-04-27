import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import AdminLeftSidebar from '../admin/AdminLeftSidebar';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../api/courseApi";
import { setCourses } from "../../redux/slices/courseSlice";

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const dispatch = useDispatch();
	const courses = useSelector((store) => store.course.courses);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);

	useEffect(() => {
		// Admin pages rely on course list for dropdowns; ensure it's loaded.
		if (courses && courses.length > 0) return;

		const fetchCourses = async () => {
			try {
				const data = await getAllCourses();
				if (data?.success) {
					dispatch(setCourses(data.allCourses || []));
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchCourses();
	}, [dispatch, courses]);

	return (
		<div className="flex flex-col md:flex-row h-screen relative">

			{/* Topbar only on mobile */}
			<div className="md:hidden py-3 pl-6 bg-[#F2F3F8]">
				<Menu onClick={toggleSidebar} className="w-7 h-7 text-gray-800 cursor-pointer" />
			</div>

			{/* Sidebar container */}
			<div
				className={`
					fixed top-0 left-0 h-full w-[75%] sm:w-[60%] md:w-[19%] bg-[#2C2E3E] text-white z-50
					transform transition-transform duration-300 ease-in-out
					${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
					md:translate-x-0 md:relative md:flex
				`}
			>
				<AdminLeftSidebar toggleSidebar={toggleSidebar} />
			</div>

			{/* Overlay on small screens */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
					onClick={toggleSidebar}
				></div>
			)}

			{/* Main content */}
			<div className="flex-1 overflow-y-auto bg-[#F2F3F8]">
				<Outlet />
			</div>
		</div>
	);
};

export default AdminLayout;
