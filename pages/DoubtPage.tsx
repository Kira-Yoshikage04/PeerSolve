import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Answer, Feedback } from '../types';
import Spinner from '../components/Spinner';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { translateText } from '../services/geminiService';
import ConfirmationModal from '../components/ConfirmationModal';

const MicIcon = ({ isListening }: { isListening: boolean }) => (
    <svg className={`w-6 h-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
);
const TranslateIcon = () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4-4 4M5 13h14" /></svg>
const StarIcon = ({ filled, onClick, label }: { filled: boolean; onClick: () => void; label: string; }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 focus:ring-blue-500 ${filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
    >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
    </button>
);


const DoubtPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { doubts, getAnswers, postAnswer, submitFeedback, getUserById, deleteDoubt } = useData();
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackStates, setFeedbackStates] = useState<Record<string, { rating: number; review: string; loading: boolean; error?: string }>>({});
    const [translations, setTranslations] = useState<Record<string, { text: string; loading: boolean; error?: string }>>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleTranscriptChange = (transcript: string) => {
        const textToAdd = transcript.trim();
        if (!textToAdd) return;
        setAnswerText(prev => (prev ? prev + ' ' : '') + textToAdd);
    };
    const { isListening, error: speechError, toggleListening } = useSpeechToText(handleTranscriptChange);

    const doubt = useMemo(() => doubts.find(d => d.id === id), [doubts, id]);
    const answers = useMemo(() => (id ? getAnswers(id) : []), [id, getAnswers]);
    const author = useMemo(() => doubt ? getUserById(doubt.authorId) : null, [doubt, getUserById]);
    
    if (!doubt || !user || !author) {
        return <div className="text-center py-12"><Spinner /></div>;
    }
    
    const isAsker = user.id === doubt.authorId;

    const handleAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerText.trim() || !id) return;
        setSubmitting(true);
        await postAnswer({ doubtId: id, text: answerText, authorId: user.id });
        setAnswerText('');
        setSubmitting(false);
    };

    const handleFeedbackSubmit = async (answer: Answer) => {
        const feedbackState = feedbackStates[answer.id];
        if (!feedbackState || feedbackState.rating === 0 || !feedbackState.review.trim()) {
            alert("Please provide a rating and a review.");
            return;
        }
        setFeedbackStates(prev => ({ ...prev, [answer.id]: { ...feedbackState, loading: true, error: undefined } }));
        
        const { aiAnalyzed } = await submitFeedback(answer, { rating: feedbackState.rating, review: feedbackState.review });
        
        setFeedbackStates(prev => {
            const currentAnswerState = prev[answer.id] || { rating: 0, review: '', loading: false };
            return {
                ...prev,
                [answer.id]: { 
                    ...currentAnswerState, 
                    loading: false, 
                    error: aiAnalyzed ? undefined : "AI analysis failed. Default points were awarded." 
                }
            }
        });
    };

    const handleTranslate = async (textId: string, text: string, targetLanguage: 'English' | 'Hindi') => {
        setTranslations(prev => ({
            ...prev,
            [textId]: { 
                text: prev[textId]?.text || '',
                loading: true, 
                error: undefined 
            }
        }));

        try {
            const translatedText = await translateText(text, targetLanguage);
            setTranslations(prev => ({
                ...prev, 
                [textId]: { text: translatedText, loading: false, error: undefined }
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setTranslations(prev => ({
                ...prev, 
                [textId]: {
                     text: prev[textId]?.text || '',
                     loading: false, 
                     error: errorMessage
                }
            }));
        }
    };
    
    const handleDeleteDoubt = async () => {
        if (!id) return;
        setIsDeleting(true);
        await deleteDoubt(id);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 mb-8 border border-slate-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                     <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full">{doubt.subject}</span>
                        <span className="text-sm font-semibold bg-slate-100 text-slate-800 dark:bg-gray-700 dark:text-slate-300 px-3 py-1 rounded-full">{doubt.year}</span>
                        {doubt.isResolved && <span className="text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full">Resolved</span>}
                    </div>
                     {isAsker && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition"
                            aria-label="Delete doubt"
                        >
                            Delete
                        </button>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">{doubt.title}</h1>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
                    <span>Posted by <span className="font-semibold text-gray-700 dark:text-gray-300">{author.name}</span> on {new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{translations[`doubt-${doubt.id}`]?.text || doubt.description}</p>
                <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleTranslate(`doubt-${doubt.id}`, doubt.description, 'Hindi')} className="inline-flex items-center text-xs text-blue-500 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:no-underline" disabled={translations[`doubt-${doubt.id}`]?.loading}><TranslateIcon /> To Hindi</button>
                        <span className="text-slate-300 dark:text-gray-600">|</span>
                        <button onClick={() => handleTranslate(`doubt-${doubt.id}`, doubt.description, 'English')} className="inline-flex items-center text-xs text-blue-500 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:no-underline" disabled={translations[`doubt-${doubt.id}`]?.loading}><TranslateIcon /> To English</button>
                    </div>
                    {translations[`doubt-${doubt.id}`]?.loading && (
                        <span className="text-xs text-blue-500 animate-pulse ml-2">Translating...</span>
                    )}
                </div>
                {translations[`doubt-${doubt.id}`]?.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-700">
                        <p className="text-xs text-red-700 dark:text-red-300">{translations[`doubt-${doubt.id}`].error}</p>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold p-6 md:p-8 border-b dark:border-gray-700">{answers.length} Answer{answers.length !== 1 && 's'}</h2>
                <div className="divide-y dark:divide-gray-700">
                {answers.map(answer => {
                    const feedbackState = feedbackStates[answer.id] || { rating: 0, review: '', loading: false };
                    return (
                        <div key={answer.id} className="p-6 md:p-8">
                            <div className="flex items-start space-x-4">
                                <img src={answer.authorAvatar} alt={answer.authorName} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{answer.authorName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(answer.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{translations[`answer-${answer.id}`]?.text || answer.text}</p>
                             <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleTranslate(`answer-${answer.id}`, answer.text, 'Hindi')} className="inline-flex items-center text-xs text-blue-500 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:no-underline" disabled={translations[`answer-${answer.id}`]?.loading}><TranslateIcon /> To Hindi</button>
                                     <span className="text-slate-300 dark:text-gray-600">|</span>
                                    <button onClick={() => handleTranslate(`answer-${answer.id}`, answer.text, 'English')} className="inline-flex items-center text-xs text-blue-500 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:no-underline" disabled={translations[`answer-${answer.id}`]?.loading}><TranslateIcon /> To English</button>
                                </div>
                                {translations[`answer-${answer.id}`]?.loading && (
                                     <span className="text-xs text-blue-500 animate-pulse ml-2">Translating...</span>
                                )}
                            </div>
                             {translations[`answer-${answer.id}`]?.error && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-700">
                                    <p className="text-xs text-red-700 dark:text-red-300">{translations[`answer-${answer.id}`].error}</p>
                                </div>
                            )}

                            {answer.feedback && (
                                <div className="mt-4 bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-green-800 dark:text-green-300">Feedback Given</h4>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} label={`${i+1} of 5 stars`} filled={i < answer.feedback!.rating} onClick={() => {}} />)}
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-200 mt-1 italic">"{answer.feedback.review}"</p>
                                    {feedbackStates[answer.id]?.error && (
                                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-md border border-yellow-300 dark:border-yellow-700">
                                            <p className="text-xs text-yellow-800 dark:text-yellow-200">{feedbackStates[answer.id].error}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAsker && !answer.feedback && (
                                <div className="mt-4 bg-slate-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <div role="group" aria-labelledby={`feedback-rating-label-${answer.id}`}>
                                        <p id={`feedback-rating-label-${answer.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Was this answer helpful?</p>
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} label={`Rate ${i + 1} of 5 stars`} filled={i < feedbackState.rating} onClick={() => setFeedbackStates(p => ({...p, [answer.id]: {...(p[answer.id] || {review: '', loading: false}), rating: i + 1}}))} />)}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor={`review-textarea-${answer.id}`} className="sr-only">Review</label>
                                        <textarea
                                            id={`review-textarea-${answer.id}`}
                                            value={feedbackState.review}
                                            onChange={(e) => setFeedbackStates(p => ({...p, [answer.id]: {...(p[answer.id] || {rating: 0, loading: false}), review: e.target.value}}))}
                                            placeholder="Add a review..."
                                            className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 border-slate-300 dark:border-gray-600"
                                            rows={2}
                                            aria-required="true"
                                        />
                                    </div>
                                    <button onClick={() => handleFeedbackSubmit(answer)} disabled={feedbackState.loading} className="mt-2 px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-md hover:bg-green-600 disabled:bg-gray-400">
                                        {feedbackState.loading ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                </div>

                {!isAsker && !doubt.isResolved && (
                    <form onSubmit={handleAnswerSubmit} className="p-6 md:p-8 mt-8 border-t dark:border-gray-700">
                        <h3 id="post-answer-heading" className="text-xl font-bold mb-4">Post Your Answer</h3>
                        <div className="relative">
                             <label htmlFor="answer-textarea" className="sr-only">Your Answer</label>
                            <textarea
                                id="answer-textarea"
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Share your knowledge or use the mic to dictate..."
                                className={`w-full p-3 pr-12 border rounded-md bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-shadow ${isListening ? 'ring-2 ring-blue-500' : ''}`}
                                rows={5}
                                required
                                aria-required="true"
                                aria-labelledby="post-answer-heading"
                            />
                            <div className="absolute top-3 right-3 flex items-center space-x-2">
                                {isListening && (
                                    <span className="text-xs text-blue-500 animate-pulse">Listening...</span>
                                )}
                                <button type="button" onClick={toggleListening} className="p-1 rounded-full" aria-label={isListening ? 'Stop listening' : 'Start listening'} aria-pressed={isListening}>
                                    <MicIcon isListening={isListening}/>
                                </button>
                            </div>
                        </div>
                        {speechError && <p role="alert" className="text-red-500 text-sm mt-1">{speechError}</p>}
                        <button type="submit" disabled={submitting} className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                            {submitting ? 'Posting...' : 'Post Answer'}
                        </button>
                    </form>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteDoubt}
                title="Delete Doubt"
                message="Are you sure you want to delete this doubt? This action will also remove all associated answers and cannot be undone."
                confirmText="Delete"
                isConfirming={isDeleting}
            />
        </div>
    );
};

export default DoubtPage;