import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import Spinner from '../components/Spinner';

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: React.ReactNode, label: string }) => (
    <div className="bg-slate-100 dark:bg-gray-700/50 p-4 rounded-xl flex items-center border border-slate-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg mr-4 border border-slate-200 dark:border-gray-600">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
    </div>
);

const DoubtsIcon = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const AnswersIcon = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const RatingIcon = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.522 4.676a1 1 0 00.95.69h4.904c.969 0 1.371 1.24.588 1.81l-3.968 2.88a1 1 0 00-.364 1.118l1.522 4.676c.3.921-.755 1.688-1.54 1.118l-3.968-2.88a1 1 0 00-1.175 0l-3.968 2.88c-.784.57-1.838-.197-1.539-1.118l1.522-4.676a1 1 0 00-.364-1.118L2.04 10.103c-.783-.57-.38-1.81.588-1.81h4.904a1 1 0 00.95-.69L9.547 2.927z"></path></svg>;
const ResolvedIcon = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

const UserProfilePage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { doubts, getAnswers, updateUserName } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const myDoubts = useMemo(() => {
    if (!user) return [];
    return doubts.filter(d => d.authorId === user.id);
  }, [doubts, user]);
  
  const myAnswers = useMemo(() => {
    if (!user) return [];
    const allAnswers = getAnswers(null);
    return allAnswers.filter(a => a.authorId === user.id);
  }, [getAnswers, user]);

  const answeredDoubtIds = useMemo(() => {
      return new Set(myAnswers.map(a => a.doubtId));
  }, [myAnswers]);

  const answeredDoubts = useMemo(() => {
      return doubts.filter(d => answeredDoubtIds.has(d.id));
  }, [doubts, answeredDoubtIds]);

  const stats = useMemo(() => {
    if (!user) return null;

    const totalDoubtsPosted = myDoubts.length;
    const totalAnswersGiven = myAnswers.length;

    const answersWithFeedback = myAnswers.filter(a => a.feedback);
    const totalRating = answersWithFeedback.reduce((sum, a) => sum + (a.feedback?.rating || 0), 0);
    const averageRating = answersWithFeedback.length > 0 ? (totalRating / answersWithFeedback.length) : 0;

    const answeredResolvedDoubts = answeredDoubts.filter(d => d.isResolved).length;
    const resolvedPercentage = answeredDoubts.length > 0 ? (answeredResolvedDoubts / answeredDoubts.length) * 100 : 0;

    return {
        totalDoubtsPosted,
        totalAnswersGiven,
        averageRating: averageRating.toFixed(1),
        resolvedPercentage: resolvedPercentage.toFixed(0)
    };
  }, [user, myDoubts, myAnswers, answeredDoubts]);


  if (!user) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  const handleSaveName = async () => {
    if (!displayName.trim() || displayName.trim() === user.name) {
      setIsEditing(false);
      setDisplayName(user.name);
      return;
    }
    setIsSaving(true);
    const updatedUser = await updateUserName(user.id, displayName.trim());
    if (updatedUser) {
      updateAuthUser(updatedUser);
    }
    setIsSaving(false);
    setIsEditing(false);
  };

  const DoubtListItem = ({ doubt }: { doubt: import('../types').Doubt }) => (
    <Link to={`/doubt/${doubt.id}`} className="block p-4 border-b dark:border-gray-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex justify-between items-start">
            <p className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">{doubt.title}</p>
            {doubt.isResolved && <span className="text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">Resolved</span>}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
            <span>{doubt.subject}</span>
            <span>&middot;</span>
            <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
        </div>
    </Link>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-200 dark:border-gray-700 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover" />
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-2xl font-bold p-2 border rounded-md bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Edit display name"
              />
              <button onClick={handleSaveName} disabled={isSaving} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setIsEditing(false); setDisplayName(user.name); }} className="px-4 py-2 bg-slate-200 dark:bg-gray-600 rounded-md">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h1>
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500" aria-label="Edit name">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
              </button>
            </div>
          )}
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
          <div className="mt-4 text-3xl font-bold text-blue-500">
            {user.points} <span className="text-lg font-normal text-gray-600 dark:text-gray-300">Points</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">My Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard icon={<DoubtsIcon />} value={stats.totalDoubtsPosted} label="Doubts Posted" />
                <StatCard icon={<AnswersIcon />} value={stats.totalAnswersGiven} label="Answers Given" />
                <StatCard icon={<RatingIcon />} value={<>{stats.averageRating} <span className="text-yellow-400 text-lg relative -top-px">★</span></>} label="Average Rating" />
                <StatCard icon={<ResolvedIcon />} value={`${stats.resolvedPercentage}%`} label="Answer Resolved Rate" />
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-gray-700 group">
          <h2 className="text-xl font-bold p-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-100">My Doubts ({myDoubts.length})</h2>
          <div>
            {myDoubts.length > 0 ? myDoubts.map(d => <DoubtListItem key={d.id} doubt={d} />) : <p className="p-4 text-gray-500">No doubts posted yet.</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-gray-700 group">
           <h2 className="text-xl font-bold p-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-100">Answered Doubts ({answeredDoubts.length})</h2>
           <div>
            {answeredDoubts.length > 0 ? answeredDoubts.map(d => <DoubtListItem key={d.id} doubt={d} />) : <p className="p-4 text-gray-500">No doubts answered yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;