
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Doubt, Answer, User, Feedback } from '../types';
import { 
  getDoubts as dbGetDoubts, 
  addDoubt as dbAddDoubt,
  addAnswer as dbAddAnswer,
  addFeedbackToAnswer as dbAddFeedback,
  getUsers as dbGetUsers,
  updateUserPoints as dbUpdateUserPoints,
  updateUserName as dbUpdateUserName,
  getUserById as dbGetUserById,
  deleteDoubt as dbDeleteDoubt,
  getAllAnswers as dbGetAllAnswers,
  updateUserAccess as dbUpdateUserAccess,
} from '../services/db';
import { analyzeFeedbackAndAwardPoints } from '../services/geminiService';

interface DataContextType {
  doubts: Doubt[];
  users: User[];
  loadingDoubts: boolean;
  getAnswers: (doubtId: string | null) => Answer[];
  postDoubt: (doubt: Omit<Doubt, 'id' | 'createdAt' | 'authorName' | 'authorAvatar' | 'isResolved'>) => Promise<void>;
  postAnswer: (answer: Omit<Answer, 'id' | 'createdAt' | 'authorName' | 'authorAvatar'>) => Promise<void>;
  submitFeedback: (answerId: string, doubtId: string, answerAuthorId: string, feedback: Feedback) => Promise<void>;
  updateUserName: (userId: string, newName: string) => Promise<User | null>;
  getUserById: (userId: string) => User | undefined;
  deleteDoubt: (doubtId: string) => Promise<void>;
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
    await fetchData(); // Refetch all data to show new answer
  };
  
  const submitFeedback = async (answerId: string, doubtId: string, answerAuthorId: string, feedback: Feedback) => {
    try {
        const aiAnalysis = await analyzeFeedbackAndAwardPoints(feedback.review, feedback.rating);
        await dbAddFeedback(answerId, doubtId, feedback);
        await dbUpdateUserPoints(answerAuthorId, aiAnalysis.points);
    } catch (error) {
        console.error("AI feedback analysis or DB update failed.", error);
        throw new Error("Failed to submit feedback. Please try again.");
    }

    await fetchData();
  };
  
  const updateUserName = async (userId: string, newName: string): Promise<User | null> => {
    const updatedUser = await dbUpdateUserName(userId, newName);
    await fetchData(); // Refetch everything to reflect name changes
    return updatedUser;
  }

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