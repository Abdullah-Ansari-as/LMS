import React, { useEffect, useState } from "react";
import { Search, RotateCw, Loader2, Megaphone, Calendar, ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNoticeBoardAnnoucements } from "../api/noticeboardApi";
import { motion, AnimatePresence } from "framer-motion";

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
	const [expandedIndex, setExpandedIndex] = useState(0);

	const filteredNotices = announcements?.filter((notice) =>
		notice.title.toLowerCase().includes(search.toLowerCase())
	);

	const navigate = useNavigate();

	useEffect(() => {
		const getNoticeBoardAnnouces = async () => {
      try {
        setLoading(true)
        const res = await getNoticeBoardAnnoucements();
        if (res.success) {
          setAnnouncements(res.allAnnouncements);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
    getNoticeBoardAnnouces()
	}, []);

	return (
		<div className="mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12">
			<div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Notice Board</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Official news and academic updates</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </motion.button>
        </motion.div>

				{/* Search Bar */}
        <div className="mb-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
          />
        </div>

				{loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">Broadcasting updates...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotices?.map((notice, index) => {
                const { day, month, full } = formatDate(notice.date);
                const isExpanded = expandedIndex === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-200 shadow-xl shadow-indigo-500/5' : 'border-slate-200/60 shadow-sm'}`}
                  >
                    <div 
                      onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                      className="p-6 cursor-pointer flex items-center gap-6"
                    >
                      {/* Date Badge */}
                      <div className="hidden md:flex flex-col items-center justify-center min-w-[64px] h-16 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{month}</span>
                        <span className="text-2xl font-black text-indigo-600 leading-none">{day}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded border border-indigo-100">
                            Academic
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 md:hidden">{full}</span>
                        </div>
                        <h3 className={`text-base font-black tracking-tight leading-tight transition-colors ${isExpanded ? 'text-indigo-600' : 'text-slate-900'}`}>
                          {notice.title}
                        </h3>
                      </div>

                      <div className={`p-2 rounded-xl transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="pt-4 border-t border-slate-50">
                            <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                              {notice.message}
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              <Calendar className="w-3 h-3" />
                              Posted on {full}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredNotices.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <Megaphone className="w-16 h-16 text-slate-100 mb-4" />
                <p className="text-slate-400 font-black text-lg uppercase tracking-widest">No Notices Found</p>
                <p className="text-slate-300 text-sm mt-1">Check back later for more updates.</p>
              </div>
            )}
          </div>
        )}
			</div>
		</div >
	);
};

export default NoticeBoard;
