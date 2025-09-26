import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Doubt, Answer, User, Feedback } from '../types';
import { 
  getDoubts as dbGetDoubts, 
  getAnswersForDoubt,
  addDoubt as dbAddDoubt,
  addAnswer as dbAddAnswer,
  addFeedbackToAnswer as dbAddFeedback,
  getUsers as dbGetUsers,
  updateUserPoints as dbUpdateUserPoints,
  updateUserName as dbUpdateUserName,
  getUserById as dbGetUserById,
  deleteDoubt as dbDeleteDoubt,
  getAllAnswers as dbGetAllAnswers,
  // FIX: Import the new database function.
  updateUserAccess as dbUpdateUserAccess,
} from '../services/db';
import { analyzeFeedbackForPoints } from '../services/geminiService';

interface DataContextType {
  doubts: Doubt[];
  users: User[];
  loadingDoubts: boolean;
  getAnswers: (doubtId: string | null) => Answer[];
  postDoubt: (doubt: Omit<Doubt, 'id' | 'createdAt' | 'authorName' | 'authorAvatar' | 'isResolved'>) => Promise<void>;
  postAnswer: (answer: Omit<Answer, 'id' | 'createdAt' | 'authorName' | 'authorAvatar'>) => Promise<void>;
  submitFeedback: (answer: Answer, feedback: Feedback) => Promise<{ aiAnalyzed: boolean }>;
  updateUserName: (userId: string, newName: string) => Promise<User | null>;
  getUserById: (userId: string) => User | undefined;
  deleteDoubt: (doubtId: string) => Promise<void>;
  // FIX: Add updateUserAccess to the context type.
  updateUserAccess: (userId: string, accessGranted: boolean) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDoubts, setLoadingDoubts] = useState(true);

  const fetchData = useCallback(async () => {
    setLoadingDoubts(true);
    // Note: Fetching all answers can be slow with many records.
    // This is kept simple to match the original mock implementation's behavior.
    const [doubtsData, usersData, answersData] = await Promise.all([
        dbGetDoubts(),
        dbGetUsers(),
        dbGetAllAnswers(),
    ]);
    setDoubts(doubtsData);
    setUsers(usersData);
    setAnswers(answersData);
    setLoadingDoubts(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAnswers = (doubtId: string | null): Answer[] => {
    if (doubtId === null) {
      return [...answers].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return answers.filter(a => a.doubtId === doubtId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const postDoubt = async (doubtData: Omit<Doubt, 'id' | 'createdAt' | 'authorName' | 'authorAvatar' | 'isResolved'>) => {
    await dbAddDoubt(doubtData);
    await fetchData(); // Refetch all data
  };

  const postAnswer = async (answerData: Omit<Answer, 'id' | 'createdAt' | 'authorName' | 'authorAvatar'>) => {
    await dbAddAnswer(answerData);
    await fetchData(); // Refetch all data
  };
  
  const submitFeedback = async (answer: Answer, feedback: Feedback): Promise<{ aiAnalyzed: boolean }> => {
    let points = 0;
    let aiAnalyzed = true;

    try {
      points = await analyzeFeedbackForPoints(feedback);
    } catch (error) {
      console.warn("AI feedback analysis failed. Using fallback.", error);
      points = feedback.rating * 2;
      aiAnalyzed = false;
    }
    
    await dbAddFeedback(answer.id, answer.doubtId, feedback);
    await dbUpdateUserPoints(answer.authorId, points);
    
    // Refetch all data to show updates
    await fetchData();
    
    return { aiAnalyzed };
  };
  
  const updateUserName = async (userId: string, newName: string): Promise<User | null> => {
    const updatedUser = await dbUpdateUserName(userId, newName);
    await fetchData(); // Refetch everything to reflect name changes
    return updatedUser;
  }

  // FIX: Implement and expose the updateUserAccess function.
  const updateUserAccess = async (userId: string, accessGranted: boolean) => {
    await dbUpdateUserAccess(userId, accessGranted);
    await fetchData(); // Refetch users
  };

  const getUserById = (userId: string) => {
      return users.find(u => u.id === userId);
  }

  const deleteDoubt = async (doubtId: string) => {
    await dbDeleteDoubt(doubtId);
    await fetchData(); // Refetch doubts
  };

  const value = { doubts, users, loadingDoubts, getAnswers, postDoubt, postAnswer, submitFeedback, updateUserName, getUserById, deleteDoubt, updateUserAccess };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
