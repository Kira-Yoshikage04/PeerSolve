import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import Spinner from '../components/Spinner';
import { Role, User } from '../types';

const GoldMedal = () => <div className="text-3xl">🥇</div>;
const SilverMedal = () => <div className="text-3xl">🥈</div>;
const BronzeMedal = () => <div className="text-3xl">🥉</div>;


const podiumStyles: { [key: number]: string } = {
  0: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-800/50 border-amber-300',
  1: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-700/50 border-slate-300',
  2: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 border-orange-300'
};

// FIX: Define props with a type alias to correctly handle React's special 'key' prop in .map().
type TopRankCardProps = {
  user: User;
  rank: number;
};

const TopRankCard = ({ user, rank }: TopRankCardProps) => (
  <div className={`p-4 rounded-xl flex flex-col items-center text-center space-y-3 border ${podiumStyles[rank]} shadow-lg h-full`}>
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
  type SortKey = 'points-desc' | 'points-asc' | 'name-asc' | 'name-desc';
  const [sortKey, setSortKey] = useState<SortKey>('points-desc');

  const usersByPoints = useMemo(() => {
    return [...users].sort((a, b) => b.points - a.points);
  }, [users]);
  
  const topThree = usersByPoints.slice(0, 3);
  
  const restOfUsersWithRank = useMemo(() => {
      return usersByPoints.slice(3).map((user, index) => ({...user, rank: index + 4 }));
  }, [usersByPoints]);

  const sortedRestOfUsers = useMemo(() => {
    return [...restOfUsersWithRank].sort((a, b) => {
      switch (sortKey) {
        case 'points-asc':
          return a.points - b.points;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'points-desc':
        default:
          return b.points - a.points;
      }
    });
  }, [restOfUsersWithRank, sortKey]);

  if (loadingDoubts) {
    return <div className="flex justify-center mt-12"><Spinner /></div>;
  }
  
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumSlots = [
    { user: topThree[1], rank: 1 }, // 2nd place
    { user: topThree[0], rank: 0 }, // 1st place
    { user: topThree[2], rank: 2 }, // 3rd place
  ].filter(slot => slot.user);


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800 dark:text-gray-100">Leaderboard</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">See who's making the biggest impact in the community.</p>

      {usersByPoints.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 items-end">
            {podiumSlots.map(({ user, rank }) => (
              <div key={user.id} className={`${rank === 0 ? 'md:-translate-y-4' : ''} transition-transform duration-300`}>
                <TopRankCard user={user} rank={rank} />
              </div>
            ))}
          </div>

          {sortedRestOfUsers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-gray-700">
                <div className="p-4 flex justify-end">
                    <div className="w-full sm:w-48">
                      <label htmlFor="sort-order" className="sr-only">Sort by</label>
                      <select 
                        id="sort-order" 
                        value={sortKey} 
                        onChange={(e) => setSortKey(e.target.value as SortKey)} 
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="points-desc">Points: High to Low</option>
                        <option value="points-asc">Points: Low to High</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedRestOfUsers.map((user) => (
                    <li key={user.id} className="p-4 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-10 flex-shrink-0 flex items-center justify-center mr-4">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700 font-bold text-slate-600 dark:text-slate-300 text-sm border border-slate-200 dark:border-gray-600">
                             {user.rank}
                           </div>
                        </div>
                        <img className="h-12 w-12 rounded-full" src={user.avatarUrl} alt={user.name} />
                        <div className="ml-4">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
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