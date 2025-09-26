import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Subject, AcademicYear, Doubt } from '../types';
import { SUBJECTS, ACADEMIC_YEARS } from '../constants';
import NewDoubtModal from '../components/NewDoubtModal';
import Spinner from '../components/Spinner';

const getSubjectClasses = (subject: Subject) => {
  const styles: Record<Subject, string> = {
    [Subject.COMPUTER_SCIENCE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [Subject.MATHEMATICS]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    [Subject.PHYSICS]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    [Subject.CHEMISTRY]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [Subject.BIOLOGY]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    [Subject.ELECTRICAL_ENGINEERING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  };
  return styles[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const DoubtCard = ({ doubt }: { doubt: Doubt }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-full ${getSubjectClasses(doubt.subject)}`}>{doubt.subject}</span>
            <span className="bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-slate-300 px-2.5 py-1 rounded-full">{doubt.year}</span>
          </div>
          {doubt.isResolved &&
            <span className="flex-shrink-0 ml-4 text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2.5 py-1 rounded-full inline-flex items-center">
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Resolved
            </span>}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-snug">
            <Link to={`/doubt/${doubt.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 group-hover:underline">
                {doubt.title}
            </Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          <img src={doubt.authorAvatar} alt={doubt.authorName} className="w-6 h-6 rounded-full mr-2" />
          <span>{doubt.authorName} &middot; {new Date(doubt.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
       <div className="bg-slate-50 dark:bg-gray-800/50 border-t border-slate-200 dark:border-gray-700/50 px-5 py-3 flex items-center justify-end">
           <button onClick={() => navigate(`/doubt/${doubt.id}`)} className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition shadow-sm hover:shadow-md">
              View & Answer
            </button>
        </div>
    </div>
  )
};


const FeedPage = () => {
  const { user } = useAuth();
  const { doubts, loadingDoubts } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<AcademicYear | 'all'>('all');

  const filteredDoubts = useMemo(() => {
    return doubts
      .filter(d => subjectFilter === 'all' || d.subject === subjectFilter)
      .filter(d => yearFilter === 'all' || d.year === yearFilter)
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [doubts, subjectFilter, yearFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Doubts Feed</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition shadow-md hover:shadow-lg w-full md:w-auto"
        >
          Post a New Doubt
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 border border-slate-200 dark:border-gray-700">
        <div className="flex-1">
          <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Subject</label>
          <select id="subject-filter" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value as Subject | 'all')} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="all">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Year</label>
          <select id="year-filter" value={yearFilter} onChange={(e) => setYearFilter(e.target.value as AcademicYear | 'all')} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="all">All Years</option>
            {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loadingDoubts ? (
        <div className="flex justify-center mt-12"><Spinner /></div>
      ) : filteredDoubts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoubts.map(doubt => <DoubtCard key={doubt.id} doubt={doubt} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No doubts found.</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or be the first to post a doubt!</p>
        </div>
      )}

      {isModalOpen && <NewDoubtModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default FeedPage;