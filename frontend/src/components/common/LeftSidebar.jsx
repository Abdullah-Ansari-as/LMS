import React, { useState } from "react";
import VuLogo from "/VuLogo.png";
import GovLogo from "/govLogo.png";
import { FaHome, FaPhoneAlt } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { IoMdHelp } from "react-icons/io";
import { MdOutlineNoteAlt, MdGridOn } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa6";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { AiOutlineOpenAI } from "react-icons/ai";

const LeftSidebar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const [tab, setTab] = useState("");

	const sidebarHandler = (text) => {
		if (text !== "Contact Us") {
			setTab(text);
		}

		if (text === "Home") {
			navigate("/");
		} else if (text === "Account Book") {
			navigate("/account-book");
		} else if (text === "Progress") {
			navigate("/progress");
		} else if (text === "Grade Book") {
			navigate("/grade-book");
		} else if (text === "Notes") {
			navigate("/notes");
		} else if (text === "My Studied Courses") {
			navigate("/mystudiedcourses");
		} else if (text === "AI Chatbot") {
			navigate("/chatbot");
		}
	};

	const location = useLocation();
	const isChatbotActive = location.pathname === "/chatbot";

	const sideBarItems = [
		{ icon: <FaHome className="w-6 h-6" />, text: "Home" },
		{ icon: <FaLayerGroup className="w-6 h-6" />, text: "Grade Book" },
		{
			icon: <HiOutlineAdjustmentsHorizontal className="w-6 h-6" />,
			text: "Account Book",
		},
		{ icon: <GiProgression className="w-6 h-6" />, text: "Progress" },
		{ icon: <MdOutlineNoteAlt className="w-6 h-6" />, text: "Notes" },
		{ icon: <MdGridOn className="w-6 h-6" />, text: "My Studied Courses" },
		{ icon: <AiOutlineOpenAI className="w-6 h-6" />, text: "AI Chatbot" },
		{ icon: <IoMdHelp className="w-6 h-6" />, text: "Help" },
	];

	return (
		<div className="h-screen">
			<div className="h-[90%]">
				<div className="flex items-center md:justify-center justify-start ml-9 md:ml-0 mt-2 gap-1 mx-auto">
					<img className="bg-white" src={VuLogo} alt="" />
					<img className="bg-white" src={GovLogo} alt="" />
				</div>

				<div className="mx-4 mt-5">
					{sideBarItems.map((item, index) => {
						return (
							<div
								key={index}
								onClick={() => {
									sidebarHandler(item.text);
									toggleSidebar();
								}}
								className={`flex h-full w-full mx-[7px] sm:mx-2 items-center justify-start gap-4 my-3 md:my-1 py-1.5 relative hover:cursor-pointer hover:bg-[#909194] rounded-md px-2 sm:px-3 sm:pt-3 sm:pb-2
									  ${isChatbotActive
										? item.text === "AI Chatbot"
											? "bg-[#909194] text-white shadow-md"
											: ""
										: item.text === tab
											? "bg-[#909194]"
											: ""
									}
									`}
							>
								<span>{item.icon}</span>
								<span>{item.text}</span>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex-1 flex-col md:items-center items-start ml-6">
				<span className="text-sm font-bold mx-auto">Online University</span>
			</div>
		</div>
	);
};

export default LeftSidebar;
