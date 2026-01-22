import React, { useState } from 'react'
import { Outlet } from "react-router-dom"
import LeftSidebar from '../common/LeftSidebar'
import Header from '../common/Header'

const UserLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);
	return (
		<div className="flex h-screen">
			{/* Left Sidebar */}
			<div
				className={`
					bg-[#2C2E3E] text-white h-screen
					w-[70%] sm:w-[40%] md:w-[30%] lg:w-[19%]
					fixed lg:static z-100
					transform transition-transform duration-300 ease-in-out
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
					lg:translate-x-0 lg:flex
				`}
			>
				<LeftSidebar toggleSidebar={toggleSidebar} />
			</div>


			{/* Overlay for mobile when sidebar is open */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden"
					onClick={toggleSidebar}
				/>
			)}

			{/* Main content area */}
			<div className="flex-1 flex flex-col lg:ml-0">
				{/* Header */}
				<Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

				{/* Main Layout */}
				<main className="flex-1 overflow-y-auto bg-[#F2F3F8]">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default UserLayout
