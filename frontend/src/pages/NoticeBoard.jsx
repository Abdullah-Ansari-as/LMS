import React, { useEffect, useState } from "react";
import { Search, RotateCw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNoticeBoardAnnoucements } from "../api/noticeboardApi";


const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	const options = { year: "numeric", month: "short", day: "2-digit" };
	const formatted = date.toLocaleDateString("en-US", options);
	const [month, day, year] = formatted.replace(",", "").split(" ");
	return {
		day: day,
		month: month,
		full: `${month} ${day}, ${year}`,
	};
};

const NoticeBoard = () => {
	const [search, setSearch] = useState("");
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(false);

	const filteredNotices = announcements?.filter((notice) =>
		notice.title.toLowerCase().includes(search.toLowerCase())
	);

	const navigate = useNavigate();

	useEffect(() => {
		try {
			const getNoticeBoardAnnouces = async () => {
				setLoading(true)
				const res = await getNoticeBoardAnnoucements();
				if (res.success) {
					setAnnouncements(res.allAnnouncements);
					setLoading(false)
				}
			}
			getNoticeBoardAnnouces()
		} catch (error) {
			setLoading(false)
			console.error(error);
		}
	}, []);

	return (
		<div className="bg-[#F2F3F8] h-full py-10 md:py-20 px-2 md:px-7">
			<div className="bg-base-100 p-2 md:p-6 rounded-md max-w-4xl mx-auto ">
				<h2 className="text-2xl font-semibold mb-4">Notice Board</h2>

				{/* Purple Header */}
				<div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between items-center rounded-t-md">
					<span className="text-lg font-semibold">News & Events</span>
					<button className="btn btn-sm btn-outline text-white" onClick={() => navigate(-1)}>⬅ Back</button>
				</div>

				{/* Search + Refresh */}
				<div className="flex flex-wrap gap-2 p-4 bg-base-200 rounded-b-md">
					<div className="flex flex-1 items-center gap-2">
						<input
							type="text"
							placeholder="Search for..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="input input-bordered w-full"
						/>
						<button className="btn btn-primary">
							<Search size={18} />
						</button>
					</div>
					<button
						className="hidden md:btn md:btn-secondary"
						onClick={() => setSearch("")}
					>
						<RotateCw size={18} className="mr-1" />
						Refresh
					</button>
				</div>

				{
					loading ? (
						<div className="flex items-center justify-center p-5">
							<p><Loader2 className="h-9 w-9 animate-spin" /></p>
						</div>
					) : (
						<div className="mt-4 space-y-4">
							{filteredNotices?.map((notice, index) => {
								const { day, month, full } = formatDate(notice.date);
								return (
									<div
										key={index}
										className="flex items-start border-b pb-3 border-gray-200"
									>
										{/* Date Column */}
										<div className="hidden md:block w-16 text-right pr-4">
											<p className="text-md font-bold text-gray-700">{month}</p>
											<p className="text-xl font-bold text-blue-600">{day}</p>
										</div>

										{/* Content */}
										<div
											className="collapse collapse-arrow bg-white border border-gray-300 rounded-md shadow-sm"
										>
											<input type="radio" name="announcement-accordion" defaultChecked={index === 0} />
											<div className="collapse-title font-semibold text-gray-800 text-sm md:text-md flex justify-between">
												<p>
													📢 {notice.title}
												</p>
												<p className='text-xs md:text-sm'>{full}</p>
											</div>
											<div className="collapse-content text-sm text-gray-600 leading-relaxed">
												{notice.message}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)
				}

			</div>
		</div >
	);
};

export default NoticeBoard;
