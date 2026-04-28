import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, Search, Loader2, StickyNote, Plus, Calendar, Hash } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

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

	const bgColors = [
    'bg-indigo-50 border-indigo-100', 
    'bg-emerald-50 border-emerald-100', 
    'bg-amber-50 border-amber-100', 
    'bg-rose-50 border-rose-100',
    'bg-sky-50 border-sky-100'
  ];
	const textColors = [
    'text-indigo-700', 
    'text-emerald-700', 
    'text-amber-700', 
    'text-rose-700',
    'text-sky-700'
  ];

	useEffect(() => {
		const fetchAllNotes = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/fetchnotes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }); 
        if(res.data.success) {
          setNotes(res.data.notes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
    fetchAllNotes()
	}, [successMsg]);

	if(loading) {
		return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
          <span className="text-slate-500 font-medium animate-pulse">Gathering your notes...</span>
        </motion.div>
      </div>
    )
	}

	return (
		<div className="mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <StickyNote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Notes</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Capture your thoughts and reminders</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium w-full md:w-64 shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-8">
        {/* Input Note Card - Premium Redesign */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-xl shadow-slate-200/50 p-6 rounded-[32px] w-full md:w-[320px] border border-slate-100 group hover:border-indigo-200 transition-all duration-300 h-fit sticky top-28"
        >
          <div className="flex items-center gap-2 mb-4 px-1">
            <Plus className="w-5 h-5 text-indigo-500 group-hover:rotate-90 transition-transform" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">New Entry</span>
          </div>

          <textarea
            placeholder="Give it a title..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-3 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-14 overflow-hidden resize-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className="flex items-center gap-2 px-1 mb-4">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase">{new Date().toLocaleDateString()}</span>
          </div>

          <textarea
            placeholder="Write your thoughts here..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-40 resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
            >
              <Check className="w-4 h-4" />
              Save Note
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 hover:border-red-100"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          
          {successMsg && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-[10px] font-black uppercase tracking-widest text-center mt-4"
            >
              {successMsg}
            </motion.p>
          )}
        </motion.div>

        {/* Render Notes - Masonry-like Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredNotes.map((n, i) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className={`group p-6 rounded-3xl border-2 flex flex-col h-fit transition-all hover:shadow-xl hover:shadow-slate-200/20 ${bgColors[i % bgColors.length]}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className={`w-3 h-3 ${textColors[i % textColors.length]} opacity-50`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${textColors[i % textColors.length]} opacity-70`}>Quick Note</span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight line-clamp-2 leading-tight">{n.title}</h2>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(n._id)}
                    className="p-2 text-slate-400 hover:bg-white/50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                   <Calendar className={`w-3 h-3 ${textColors[i % textColors.length]} opacity-50`} />
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{n.date}</span>
                </div>

                <div className="h-0.5 w-full bg-black/5 mb-4"></div>

                <p className="text-slate-700 font-medium text-sm leading-relaxed whitespace-pre-wrap flex-1">{n.note}</p>
                
                <div className="mt-6 flex justify-end">
                   <div className={`px-3 py-1 rounded-full bg-white/40 border border-white/20 text-[9px] font-black uppercase tracking-widest ${textColors[i % textColors.length]}`}>
                     {n.note.split(' ').length} Words
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNotes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-200"
            >
              <Hash className="w-16 h-16 text-slate-100 mb-4" />
              <p className="text-slate-400 font-black text-lg uppercase tracking-widest">No Notes Found</p>
              <p className="text-slate-300 text-sm mt-1">Try a different search or create a new note.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
	);
};

export default Notes;
