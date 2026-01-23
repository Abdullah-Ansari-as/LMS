import React, { useState } from "react";
import { useSelector } from "react-redux";

const ManageStudents = () => {
	
	const { allStudents } = useSelector((store) => store.user);

	const [search, setSearch] = useState(""); 

	const filteredStudents = allStudents?.filter(
		(student) =>
			student.name.toLowerCase().includes(search.toLowerCase()) ||
			student.email.toLowerCase().includes(search.toLowerCase())
	);


	return (
		<div className='bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6'>
 
			<div className=" p-3 md:p-6 max-w-6xl bg-[#F8F8F8] mx-auto  rounded-lg shadow">
				<div className="flex flex-col sm:flex-row justify-between items-center mb-4">
					<h2 className='font-semibold text-2xl'>All Students</h2>
					<input
						type="text"
						placeholder="Search by name or email"
						className="input input-bordered w-full sm:w-80 mt-3 sm:mt-0"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="overflow-x-auto">
					<table className="table table-zebra w-full">
						<thead className="bg-base-200 text-base font-semibold">
							<tr>
								<th>Avatar</th>
								<th>Studnet Id</th>
								<th>Name</th>
								<th>Email</th>
							</tr>
						</thead>
						<tbody>
							{filteredStudents?.map((student) => (
								<tr key={student._id}>
									<th><img className="rounded-full h-10 w-10 object-cover" src={student.profilePicture} alt="..." /></th>
									<th>{student._id}</th>
									<td>{student.name}</td>
									<td>{student.email}</td>
								</tr>
							))}
							{filteredStudents.length === 0 && (
								<tr>
									<td colSpan={6} className="text-center py-4 text-gray-500">
										No students found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ManageStudents;
