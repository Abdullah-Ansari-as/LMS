import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Notes = () => {
	const { user } = useSelector((store) => store.user);

	const [title, setTitle] = useState('');
	const [note, setNote] = useState('');
	const [notes, setNotes] = useState([]);
	const [successMsg, setSuccessMsg] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	
 

	const handleSave = async () => {
		if (!title || !note) return;

		const newNote = {
			studentId: user?._id,
			title,
			note,
			date: new Date().toLocaleString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}),
		};
 
		try {
			const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notes/addnotes`, newNote, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}); 
			if (res.data.success) { 
				setTitle('');
				setNote('');
				setSuccessMsg('Note added');
				setTimeout(() => setSuccessMsg(''), 2000);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		setTitle('');
		setNote('');
	};

	const filteredNotes = notes.filter((n) =>
		n.title.toLowerCase().includes(search.toLowerCase()) ||
		n.note.toLowerCase().includes(search.toLowerCase())
	);

	
	const handleDelete = async (id) => { 
		try {
			const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notes/deletenote/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if(res.data.success) {
				setNotes(res.data.remainingNotes);
			}
		} catch (error) {
			console.error(error)
		}
		
	}

	const bgColors = ['bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-pink-200'];

	useEffect(() => {
		try {
			const fetchAllNotes = async () => {
				setLoading(true)
				const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/fetchnotes`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				}); 
				if(res.data.success) {
					setLoading(false)
					setNotes(res.data.notes);
				}
			}
			fetchAllNotes()
		} catch (error) {
			setLoading(false)
			console.error(error);
		}
	}, [successMsg]);

	if(loading) {
		return <div className="flex-1 flex items-center justify-center bg-[#F2F3F8] h-full py-8 px-7">
			<div><Loader2 className="h-10 w-10 animate-spin"/></div>
		</div> 
	}

	return (
		<div className="mt-18 bg-[#F2F3F8] h-full py-8 px-3 md:px-7">

			<div className='flex items-center mb-10'>
				<span className='text-2xl mx-auto md:mx-0'>My Notes</span>
			</div>
			

			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				{successMsg && (
					<p className="text-green-600 hidden md:flex text-xs font-medium">{successMsg}</p>
				)}
				<div className="ml-auto flex items-center bg-white border border-gray-300 rounded-md">
					<input
						type="text"
						placeholder="Search for..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="p-2 outline-none w-60 rounded-l-md"
					/>
					<button className="bg-indigo-500 text-white px-3   py-2 rounded-r-md hover:bg-indigo-600">
						<Search className="w-4 h-4" />
					</button>
				</div>
			</div>

			<div className="flex flex-wrap gap-4">
				{/* Input Note Card */}
				<div className="bg-white shadow p-5 rounded-md w-64">
					<textarea
						placeholder="Enter Title"
						className="w-full border border-gray-300 rounded-md p-2 mb-2 text-gray-700   h-16"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<p className="text-sm text-gray-500 mb-1">{new Date().toLocaleDateString()}</p>
					<hr className="border-dotted border-t-2 border-gray-300 mb-2" />
					<textarea
						placeholder="Enter Note"
						className="w-full border border-gray-300 rounded-md p-2 text-gray-700 h-24"
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>

					<div className="flex justify-center gap-4 mt-4">
						<button
							onClick={handleSave}
							className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-green-100"
						>
							<Check className="w-4 h-4 text-gray-700" />
						</button>
						<button
							onClick={handleCancel}
							className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-100"
						>
							<X className="w-4 h-4 text-gray-700" />
						</button>
					</div>
				</div>

				{/* Render Notes */}
				{filteredNotes.map((n, i) => (
					<div
						key={n._id}
						className={`w-64 p-4 rounded-md shadow ${bgColors[i % bgColors.length]}`}
					>
						<h2 className="font-bold mb-1">{n.title}</h2>
						<p className="text-sm text-gray-700 mb-1">{n.date}</p>
						<hr className="border-dotted border-t-2 border-gray-500 mb-2" />
						<p className="text-gray-800 mb-4">{n.note}</p>
						<div className="flex justify-end gap-2">
							<Trash2 onClick={() => handleDelete(n._id)} className="w-4 h-4 cursor-pointer hover:text-red-700" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Notes;
