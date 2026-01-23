import React, { useState } from "react";
import { uploadNoticeBoardAnnoucements } from "../../api/noticeboardApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const NoticeBoardAnnouncements = () => {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [date, setDate] = useState("");
	const [loading, setLoading] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !message || !date) {
			alert("Please fill in all fields.");
			return;
		}

		const newAnnouncement = {
			title,
			message,
			date,
		};

		try {
			setLoading(true);
			const result = await uploadNoticeBoardAnnoucements(newAnnouncement);
			if (result.success) {
				setLoading(false);
				toast.success(result.message);
				// Reset form
				setTitle("");
				setMessage("");
				setDate("");
				navigate(-1);
			}
		} catch (error) {
			setLoading(false);
			console.error(error);
		}

	};

	return (
		<div className='bg-[#F2F3F8] h-full my-8 md:my-0 mt-0 md:pt-10 px-3 md:PX-7 p-6'>
			<h2 className='font-semibold text-2xl mb-6'>Notice Board Announcements</h2>
			<div className="max-w-2xl mx-auto bg-base-100 p-3 md:p-6 rounded-lg shadow">
				<h2 className="text-xl mb-4">Post New Announcement</h2>
				<form onSubmit={handleSubmit} className="space-y-4">

					{/* Title */}
					<div className="form-control">
						<label className="label font-medium pr-2">Title</label>
						<input
							type="text"
							placeholder="e.g. Midterm Schedule Released"
							className="input input-bordered"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					{/* Message */}
					<div className="form-control">
						<label className="label font-medium pr-2">Message</label>
						<textarea
							placeholder="Write your announcement message..."
							className="textarea textarea-bordered"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							required
						/>
					</div>

					{/* Date */}
					<div className="form-control">
						<label className="label font-medium pr-2">Date</label>
						<input
							type="date"
							className="input input-bordered"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
					</div>

					{/* Submit */}
					{
						loading ? (<button className="w-full  "><div className="bg-gray-300 p-3 flex items-center justify-center"><p><Loader2 className="w-5 h-5 animate-spin" /></p></div></button>) : (
							<button className="btn btn-primary w-full mt-3" type="submit">
								Post Announcement
							</button>
						)
					}

				</form>
			</div>
		</div>
	);
};

export default NoticeBoardAnnouncements;
