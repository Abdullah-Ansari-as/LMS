import React, { useState, useEffect } from "react";
import { Users, BookOpen, BarChart2, Megaphone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents, topPerformingStudents } from "../../api/userApi";
import { setAllStudents } from "../../redux/slices/userSlice";
import { getTotalGrades } from "../../api/gradesApi";
import { getTotalAnnouncements } from "../../api/courseApi";

const AdminDashboard = () => {

	const dispatch = useDispatch();
	const { user } = useSelector((store) => store.user);
	const { allStudents } = useSelector((store) => store.user);
	const { courses } = useSelector((store) => store.course);

	const [topStudents, setTopStudents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalGrades, setTotalGrades] = useState(0);
	const [totalAnnouncement, setTotalAnnouncement] = useState(0);
 
	useEffect(() => {
		if (user && user.role === "admin") {
			const getStudents = async () => {
				const result = await getAllStudents();
				if (result.success) {
					dispatch(setAllStudents(result.user));
				}
			}
			getStudents();
		}
	}, []);

	useEffect(() => {
		try {
			const getTopPerformingStudents = async () => {
				setLoading(true)
				const res = await topPerformingStudents();
				if (res.success) {
					setLoading(false);
					setTopStudents(res.topStudents);
				}
			};
			getTopPerformingStudents();

			// getTotalGrades
			const getGrades = async () => {
				const res = await getTotalGrades();
				if (res.success) {
					setTotalGrades(res.grades)
				}
			}
			getGrades();

			// getTotalAnnouncements
			const fetchAnnouncements = async () => { 
				const result = await getTotalAnnouncements();
				if (result.success) {
					setTotalAnnouncement(result.announcements.length)
				} 
			}
			fetchAnnouncements();
		} catch (error) {
			setLoading(false);
			console.error(error);
		}
	}, [])

	return (
		<div className="p-6 min-h-screen bg-[#F2F3F8] mt-0 md:pt-10 px-3 md:px-7">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				<div className="card bg-base-200 shadow-md">
					<div className="card-body flex-row items-center gap-4">
						<Users className="text-primary w-10 h-10" />
						<div>
							<p className="text-sm text-gray-500">Total Students</p>
							<h2 className="text-xl font-bold">{allStudents?.length}</h2>
						</div>
					</div>
				</div>

				<div className="card bg-base-200 shadow-md">
					<div className="card-body flex-row items-center gap-4">
						<BookOpen className="text-success w-10 h-10" />
						<div>
							<p className="text-sm text-gray-500">Total Courses</p>
							<h2 className="text-xl font-bold">{courses?.length}</h2>
						</div>
					</div>
				</div>

				<div className="card bg-base-200 shadow-md">
					<div className="card-body flex-row items-center gap-4">
						<BarChart2 className="text-purple-600 w-10 h-10" />
						<div>
							<p className="text-sm text-gray-500">Grades Uploaded</p>
							<h2 className="text-xl font-bold">{totalGrades}</h2>
						</div>
					</div>
				</div>

				<div className="card bg-base-200 shadow-md">
					<div className="card-body flex-row items-center gap-4">
						<Megaphone className="text-error w-10 h-10" />
						<div>
							<p className="text-sm text-gray-500">Announcements</p>
							<h2 className="text-xl font-bold">{totalAnnouncement} Active</h2>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mt-10 grid grid-cols-3 gap-0.5 md:gap-4">
				<Link to="/admin/manage-courses" className="btn btn-accent w-full text-sm md:text-lg">Manage Courses</Link>
				<Link to="/admin/manage-students" className="btn btn-primary w-full text-sm md:text-lg">All Students</Link>
				<Link to="/admin/upload-grades" className="btn btn-secondary w-full text-sm md:text-lg">Upload Grades</Link>
			</div>

			{/* Top Performing Students Section */}
			<div className="mt-10">
				<h2 className="text-2xl font-semibold mb-4">Top Performing Students</h2>

				{
					loading ? (
						<div className="flex items-center justify-center p-5"><Loader2 className="w-8 h-8 animate-spin" /></div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{topStudents.map((student) => (
								<div className="card bg-base-100 shadow-md" key={student._id}>
									<div className="card-body items-center text-center">
										<div className="avatar">
											<div className="w-22 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
												<img src={student.profilePicture} alt="Student" />
											</div>
										</div>
										<h4 className="font-bold mt-2">{student.name}</h4>
										<p className="text-sm text-gray-500">{student.email}</p>
										<progress className="progress progress-success w-full mt-2" value={student.average} max="100"></progress>
										<div className="badge badge-success mt-2">{student.average}% Avg</div>
									</div>
								</div>
							))}
						</div>
					)
				}

			</div>

		</div>
	);
};

export default AdminDashboard;
