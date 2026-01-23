import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { FaRegCalendarDays } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const MyLoginHistory = () => {

	const { user } = useSelector((store) => store.user);

	return (
		<div className='mt-17 bg-[#F2F3F8] h-screen overflow-y-auto'>

			<div className="flex flex-col items-center px-3 pt-11 md:px-10 md:py-6">
				<Link to="/" className='flex items-center gap-0'><HiOutlineArrowNarrowLeft /><p className='ml-1 mr-1 md:mr-4 hover:underline text-gray-600 hover:text-gray-800'>back to Home</p></Link>
				<h2 className='text-2xl mx-auto'>My Login History</h2>
			</div>

			<div className="bg-white m-3 md:m-8 p-3 md:p-10 overflow-y-auto flex flex-col gap-y-3">
				{
					user?.loginHistory.slice().reverse().map((h, i) => {
						const date = new Date(h);

						const datePart = date.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "2-digit"
						});

						const weekday = date.toLocaleDateString("en-US", {
							weekday: "long"
						});

						const time = date.toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "2-digit"
						});

						const formatted = `${datePart}, ${weekday} - ${time}`;

						return (
							<div key={i} className="border border-gray-400 rounded p-5">
								<div className="flex items-center gap-4">
									<FaRegCalendarDays />
									<p>{formatted}</p>
								</div>
							</div>
						);
					})
				}

			</div>
		</div>
	)
}

export default MyLoginHistory
