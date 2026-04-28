import React, { useState } from "react";
import VuLogo from "/VuLogo.png";
import GovLogo from "/govLogo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  StickyNote, 
  Library, 
  Bot, 
  HelpCircle,
  Menu
} from "lucide-react";

const LeftSidebar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const sidebarHandler = (item) => {
		if (item.text !== "Help") {
			navigate(item.path);
		}
		if (window.innerWidth < 1024) {
			toggleSidebar();
		}
	};

	const sideBarItems = [
		{ icon: <Home className="w-5 h-5" />, text: "Home", path: "/" },
		{ icon: <BookOpen className="w-5 h-5" />, text: "Grade Book", path: "/grade-book" },
		{ icon: <CreditCard className="w-5 h-5" />, text: "Account Book", path: "/account-book" },
		{ icon: <TrendingUp className="w-5 h-5" />, text: "Progress", path: "/progress" },
		{ icon: <StickyNote className="w-5 h-5" />, text: "Notes", path: "/notes" },
		{ icon: <Library className="w-5 h-5" />, text: "My Studied Courses", path: "/mystudiedcourses" },
		{ icon: <Bot className="w-5 h-5" />, text: "AI Chatbot", path: "/chatbot" },
		{ icon: <HelpCircle className="w-5 h-5" />, text: "Help", path: "#" },
	];

	return (
		<div className="h-screen flex flex-col bg-[#0f172a] shadow-2xl font-sans relative">
			{/* Brand Decoration */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
			
			{/* Logo Section */}
			<div className="p-7 mb-4 relative">
				<div className="flex items-center gap-3">
					<div className="flex -space-x-3">
						<img className="h-11 w-11 rounded-xl shadow-lg border-2 border-slate-800 bg-white p-1.5 transition-transform hover:scale-110" src={VuLogo} alt="VU" />
						<img className="h-11 w-11 rounded-xl shadow-lg border-2 border-slate-800 bg-white p-1.5 transition-transform hover:scale-110" src={GovLogo} alt="Gov" />
					</div>
					<div className="flex flex-col ml-1">
						<span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase leading-none">Student</span>
						<span className="text-base font-black text-white tracking-tight mt-1">LMS Portal</span>
					</div>
				</div>
			</div>

			{/* Navigation Items */}
			<nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar relative">
				{sideBarItems.map((item, index) => {
					const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
					
					return (
						<motion.div
							key={index}
							whileHover={{ x: 4 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => sidebarHandler(item)}
							className={`
								flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group relative
								${isActive 
									? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" 
									: "text-slate-400 hover:bg-slate-800/50 hover:text-white"}
							`}
						>
							<span className={`transition-all duration-300 ${isActive ? "text-white scale-110" : "text-slate-500 group-hover:text-indigo-400"}`}>
								{item.icon}
							</span>
							<span className={`text-[13.5px] font-bold tracking-wide transition-all ${isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`}>
								{item.text}
							</span>
							
							{isActive && (
								<motion.div 
									layoutId="activeIndicator"
									className="absolute left-[-4px] w-1.5 h-6 bg-indigo-400 rounded-r-full shadow-[0_0_10px_rgba(129,140,248,0.5)]"
								/>
							)}
						</motion.div>
					);
				})}
			</nav>

			{/* Footer Section */}
			<div className="p-6 relative">
				<div className="bg-slate-800/40 border border-slate-700/50 rounded-[24px] p-4 flex items-center gap-3 group hover:bg-slate-800/60 transition-all">
					<div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
						<Library className="w-5 h-5 text-indigo-400" />
					</div>
					<div className="flex flex-col">
						<span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Powered By</span>
						<span className="text-[12px] font-black text-white mt-1 tracking-tight">Virtual University</span>
					</div>
				</div>
				<p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center mt-4 opacity-50 italic">v2.0 Premium Experience</p>
			</div>
		</div>
	);
};

export default LeftSidebar;
