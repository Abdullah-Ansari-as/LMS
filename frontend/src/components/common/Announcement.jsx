import React, { useEffect, useState } from 'react';
import { MdOutlineArrowLeft } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import courseBG from "/courcebg.png"
import { getCourseAnnouncement } from '../../api/courseApi';
import { Loader2 } from 'lucide-react';

const Announcement = () => {
	const params = useParams();
	const paramId = params.courseId;

	const [announcement, setAnnouncement] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		try {
			const fetchAnnouncements = async () => {
				setLoading(true);
				const result = await getCourseAnnouncement(paramId);
				if (result.success) {
					setAnnouncement(result.courseAnnouncements.announcements)
				}
				setLoading(false);
			}
			fetchAnnouncements();
		} catch (error) {
			setLoading(false)
			console.error(error)
		}
	}, [paramId])

	return (

		<div className='bg-[#F2F3F8] h-full py-10 mt-14 md:mt-18 px-3 sm:px-12'>
			<div className="flex items-center px-4 py-3 md:py-6">
				<h2 className='text-2xl mx-auto md:mx-0'>{announcement[0]?.selectedCourse}</h2>
			</div>	

			<div className='bg-white my-3 h-auto overflow-y-auto'>

				<div className="relative">
					<img className='h-20 w-full object-cover' src={courseBG} alt="courseBgImg" />
					<div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
						<h3 className="text-white text-base md:text-lg font-semibold">
							course Announcement
						</h3>
						<Link to="/" className='flex items-center'><MdOutlineArrowLeft className='h-5 w-5 text-white' /><span className='hover:underline text-white'>Back</span></Link>
					</div>
				</div>


				{loading ? (
					<div className='flex justify-center text-center w-full p-5'><Loader2 className='h-8 w-8 animate-spin' /></div>
				) : (
					announcement.length > 0 ? (
						<div className="md:p-6 my-5 mx-1 md:mx-4">
							<div className="overflow-x-auto shadow-lg">

								<div className="space-y-4">
									{announcement?.slice().reverse().map((item, index) => (

										<div
											key={index}
											className="collapse collapse-arrow bg-white border border-gray-300 rounded-md shadow-sm"
										>
											<input type="radio" name="announcement-accordion" defaultChecked={index === 0} />
											<div className="collapse-title font-semibold text-gray-800 text-sm md:text-md flex justify-between">
												<p>
													📢 {item.title}
												</p>
												<p className='text-xs md:text-sm'>  {new Date(item.createdAt).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}</p>
											</div>
											<div className="collapse-content text-sm text-gray-600 leading-relaxed">
												{item.announcement}
											</div>
										</div>
									))}
								</div>

							</div>
						</div>
					) : (
						<p className='flex items-center justify-center p-5'>No Announcements Found!</p>
					)
				)}




			</div>
		</div>

	);
};

export default Announcement;
