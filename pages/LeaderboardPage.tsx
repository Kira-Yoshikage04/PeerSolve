import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import Spinner from '../components/Spinner';
import { Role, User } from '../types';

const GoldMedal = () => <div className="text-3xl">🥇</div>;
const SilverMedal = () => <div className="text-3xl">🥈</div>;
const BronzeMedal = () => <div className="text-3xl">🥉</div>;


const podiumStyles: { [key: number]: string } = {
  0: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/50 dark:to-amber-800/50 border-amber-400',
  1: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700/50 dark:to-slate-600/50 border-slate-400',
  2: 'bg-gradient-to-br from-orange-50 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border-orange-400'
};

const TopRankCard = ({ user, rank }: { user: User; rank: number }) => (
  <div className={`p-4 rounded-xl flex flex-col items-center text-center space-y-3 border-2 ${podiumStyles[rank]} shadow-lg`}>
    {rank === 0 && <GoldMedal />}
    {rank === 1 && <SilverMedal />}
    {rank === 2 && <BronzeMedal />}
    <img className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-500 shadow-md" src={user.avatarUrl} alt={user.name} />
    <div className="flex-1">
      <p className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</p>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.points} <span className="text-base font-normal text-gray-600 dark:text-gray-300">points</span></p>
    </div>
  </div>
);

const LeaderboardPage = () => {
  const { users, loadingDoubts } = useData();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const processedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.points - b.points;
      }
      return b.points - a.points; // desc
    });
  }, [users, sortOrder]);

  if (loadingDoubts) {
    return <div className="flex justify-center mt-12"><Spinner /></div>;
  }

  const topThree = processedUsers.slice(0, 3);
  const restOfUsers = processedUsers.slice(3);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800 dark:text-gray-100">Leaderboard</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">See who's making the biggest impact in the community.</p>

      {processedUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topThree.map((user, index) => <TopRankCard key={user.id} user={user} rank={index} />)}
          </div>

          {restOfUsers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-gray-700">
                <div className="p-4 flex justify-end">
                    <div className="w-full sm:w-48">
                      <label htmlFor="sort-order" className="sr-only">Sort by Points</label>
                      <select 
                        id="sort-order" 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} 
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="desc">Points: High to Low</option>
                        <option value="asc">Points: Low to High</option>
                      </select>
                    </div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {restOfUsers.map((user, index) => (
                    <li key={user.id} className="p-4 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-10 flex items-center justify-center mr-4">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700 font-bold text-slate-600 dark:text-slate-300 text-sm border border-slate-200 dark:border-gray-600">
                             {index + 4}
                           </div>
                        </div>
                        <img className="h-12 w-12 rounded-full" src={user.avatarUrl} alt={user.name} />
                        <div className="ml-4">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-500">{user.points}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
          )}
        </>
      ) : (
          <div className="text-center py-12">
              <h3 className="text-xl text-gray-700 dark:text-gray-300">The leaderboard is empty.</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Start answering doubts to earn points!</p>
          </div>
      )}
    </div>
  );
};

export default LeaderboardPage;