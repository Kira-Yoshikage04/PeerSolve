import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Subject, AcademicYear, Doubt, Branch } from '../types';
import { SUBJECTS, ACADEMIC_YEARS, BRANCHES, BRANCH_ACRONYMS } from '../constants';
import { useModal } from '../hooks/useModal';
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

const getBranchClasses = (branch: Branch) => {
  const styles: Record<Branch, string> = {
    [Branch.CSE]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    [Branch.ECE]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
    [Branch.CE]: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
    [Branch.EEE]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    [Branch.CIVIL]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
    [Branch.MECH]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  };
  return styles[branch] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getYearClasses = (year: AcademicYear) => {
  const styles: Record<AcademicYear, string> = {
    [AcademicYear.FIRST]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [AcademicYear.SECOND]: 'bg-stone-100 text-stone-800 dark:bg-stone-900/50 dark:text-stone-300',
    [AcademicYear.THIRD]: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300',
    [AcademicYear.FOURTH]: 'bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300',
  };
  return styles[year] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

type DoubtCardProps = {
  doubt: Doubt;
};

const DoubtCard = ({ doubt }: DoubtCardProps) => {
  return (
    <Link to={`/doubt/${doubt.id}`} className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-full ${getSubjectClasses(doubt.subject)}`}>{doubt.subject}</span>
             <span className={`px-2.5 py-1 rounded-full ${getBranchClasses(doubt.branch)}`}>{BRANCH_ACRONYMS[doubt.branch] || doubt.branch}</span>
             <span className={`px-2.5 py-1 rounded-full ${getYearClasses(doubt.year)}`}>{doubt.year}</span>
          </div>
          {doubt.isResolved &&
            <span className="flex-shrink-0 ml-4 text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2.5 py-1 rounded-full inline-flex items-center">
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Resolved
            </span>}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
           {doubt.title}
        </h3>
      </div>
       <div className="bg-slate-50 dark:bg-gray-800/50 border-t border-slate-200 dark:border-gray-700/50 px-5 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <img src={doubt.authorAvatar} alt={doubt.authorName} className="w-6 h-6 rounded-full mr-2" />
            <span>{doubt.authorName}</span>
          </div>
          <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
        </div>
    </Link>
  )
};


const SearchIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BookOpenIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const BranchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3v4a2 2 0 002 2h8a2 2 0 002-2V3m-8 18v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4m12-6h-4a2 2 0 00-2 2v4"></path></svg>;

interface FilterDropdownProps<T extends string> {
  icon: React.ReactNode;
  options: T[];
  allLabel: string;
  selectedValue: T | 'all';
  onValueChange: (value: T | 'all') => void;
}

const FilterDropdown = <T extends string>({ icon, options, allLabel, selectedValue, onValueChange }: FilterDropdownProps<T>) => {
  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <select
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value as T | 'all')}
        className="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-8 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const FeedPage = () => {
  const { doubts, loadingDoubts } = useData();
  const { openModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<AcademicYear | 'all'>('all');
  const [branchFilter, setBranchFilter] = useState<Branch | 'all'>('all');
  const [resolutionFilter, setResolutionFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');

  const filteredDoubts = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return doubts
      .filter(d => {
        if (!searchQuery.trim()) return true;
        return d.title.toLowerCase().includes(lowercasedQuery) ||
               d.description.toLowerCase().includes(lowercasedQuery);
      })
      .filter(d => subjectFilter === 'all' || d.subject === subjectFilter)
      .filter(d => yearFilter === 'all' || d.year === yearFilter)
      .filter(d => branchFilter === 'all' || d.branch === branchFilter)
      .filter(d => {
        if (resolutionFilter === 'all') return true;
        if (resolutionFilter === 'resolved') return d.isResolved;
        if (resolutionFilter === 'unresolved') return !d.isResolved;
        return true;
      })
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [doubts, searchQuery, subjectFilter, yearFilter, branchFilter, resolutionFilter]);

  const getFilterButtonClasses = (isActive: boolean) => {
    const baseStyle = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 whitespace-nowrap";
    const activeStyle = "bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400";
    const inactiveStyle = "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50";
    return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Doubts Feed</h1>
        <button
          onClick={() => openModal('newDoubt')}
          className="px-5 py-2.5 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition shadow-md hover:shadow-lg w-full md:w-auto"
        >
          Post a New Doubt
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-8 border border-slate-200 dark:border-gray-700 space-y-4">
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Search by keyword in title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2.5 pl-10 pr-4 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                aria-label="Search doubts"
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FilterDropdown<Subject>
                icon={<BookOpenIcon />}
                options={SUBJECTS}
                allLabel="All Subjects"
                selectedValue={subjectFilter}
                onValueChange={setSubjectFilter}
            />
            <FilterDropdown<AcademicYear>
                icon={<CalendarIcon />}
                options={ACADEMIC_YEARS}
                allLabel="All Years"
                selectedValue={yearFilter}
                onValueChange={setYearFilter}
            />
            <FilterDropdown<Branch>
                icon={<BranchIcon />}
                options={BRANCHES}
                allLabel="All Branches"
                selectedValue={branchFilter}
                onValueChange={setBranchFilter}
            />
         </div>
         <div className="pt-4 border-t border-slate-200 dark:border-gray-600">
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button 
                        onClick={() => setResolutionFilter('all')} 
                        className={getFilterButtonClasses(resolutionFilter === 'all')}
                        aria-pressed={resolutionFilter === 'all'}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setResolutionFilter('resolved')} 
                        className={getFilterButtonClasses(resolutionFilter === 'resolved')}
                        aria-pressed={resolutionFilter === 'resolved'}
                    >
                        Resolved
                    </button>
                    <button 
                        onClick={() => setResolutionFilter('unresolved')} 
                        className={getFilterButtonClasses(resolutionFilter === 'unresolved')}
                        aria-pressed={resolutionFilter === 'unresolved'}
                    >
                        Unresolved
                    </button>
                </div>
            </div>
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
    </div>
  );
};

export default FeedPage;