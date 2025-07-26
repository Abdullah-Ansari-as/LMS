import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	BookOpen,
	FilePlus2,
	Megaphone,
	LogOut,
} from "lucide-react";
import { BiLeftArrow } from 'react-icons/bi';
import { setAllStudents, setLogout } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { setCourses } from '../../redux/slices/courseSlice';
import { toast } from 'sonner';

const navLinks = [
	{ name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
	{ name: "Manage Courses", path: "/admin/manage-courses", icon: <BookOpen size={20} /> },
	{ name: "Manage Payments", path: "/admin/payments", icon: <Users size={20} /> },
	{ name: "Upload Grades", path: "/admin/upload-grades", icon: <FilePlus2 size={20} /> },
	{ name: "Announcements", path: "/admin/announcements", icon: <Megaphone size={20} /> },
];

// AdminLeftSidebar.jsx
const AdminLeftSidebar = ({ toggleSidebar }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(setLogout());
		dispatch(setCourses([]));
		dispatch(setAllStudents([]));
		localStorage.removeItem("token");
		navigate("/login");
		toast.success("Logged out successfully!");
	};

	return (
		<div className="flex flex-col justify-between h-full w-full bg-[#2C2E3E] text-white px-1 lg:px-4 py-6">
			<div>
				<div className="mb-8 flex items-center gap-2 text-sm font-medium">
					<BiLeftArrow className="w-4 h-4" />
					<Link to="/" className="hover:underline">
						Back to LMS
					</Link>
				</div>

				<ul className="space-y-2 overflow-hidden">
					{navLinks.map((link) => (
						<li key={link.name}>
							<Link
								to={link.path}
								onClick={toggleSidebar}
								className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all ${location.pathname === link.path
									? "bg-[#909194] text-white"
									: "hover:bg-[#909194]/80"
									}`}
							>
								<span className="text-lg">{link.icon}</span>
								<span className="text-sm lg:text-base">{link.name}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>

			<div className="pt-6">
				<button
					onClick={logoutHandler}
					className="w-full flex items-center justify-center gap-3 py-2 px-3 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium"
				>
					<LogOut size={18} />
					Logout
				</button>
			</div>
		</div>
	);
};

export default AdminLeftSidebar;

