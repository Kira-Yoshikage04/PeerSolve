


import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { translateText } from '../services/geminiService';
import ConfirmationModal from '../components/ConfirmationModal';
import { LANGUAGES, BRANCH_ACRONYMS } from '../constants';
import TranslationControls from '../components/TranslationControls';

const MicIcon = ({ isListening }: { isListening: boolean }) => (
    <svg className={`w-6 h-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
);


type StarIconProps = {
    filled: boolean;
};

const StarIcon = ({ filled }: StarIconProps) => (
     <svg className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);


const FeedbackForm = ({ answer, doubtId }: { answer: any; doubtId: string }) => {
    const { submitFeedback } = useData();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !review.trim()) {
            setError("Please provide a rating and a written review.");
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await submitFeedback(answer.id, doubtId, answer.authorId, { rating, review });
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="mt-4 bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg border border-slate-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Provide Feedback</h4>
            <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                    <button
                        type="button"
                        key={i}
                        className="p-1 focus:outline-none"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${i + 1} of 5 stars`}
                    >
                         <svg className={`w-7 h-7 transition-colors ${(hoverRating || rating) > i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </button>
                ))}
            </div>
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Explain why you gave this rating..."
                className="w-full p-2 border rounded-md border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                rows={3}
                required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                {isSubmitting ? 'Submitting...' : 'Submit Feedback & Resolve'}
            </button>
        </form>
    )
}


const DoubtPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { doubts, getAnswers, postAnswer, getUserById, deleteDoubt } = useData();
    const [answerText, setAnswerText] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [translations, setTranslations] = useState<Record<string, { text: string; loading: boolean; error?: string }>>({});
    const [targetLanguage, setTargetLanguage] = useState<string>(LANGUAGES[0]);
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
        if ((!answerText.trim() && !videoFile && !audioFile) || !id) return;
        setSubmitting(true);
        
        let videoUrl: string | undefined = undefined;
        if (videoFile) {
            videoUrl = URL.createObjectURL(videoFile);
        }

        let audioUrl: string | undefined = undefined;
        if (audioFile) {
            audioUrl = URL.createObjectURL(audioFile);
        }

        await postAnswer({ 
            doubtId: id, 
            text: answerText, 
            videoUrl: videoUrl,
            audioUrl: audioUrl,
            authorId: user.id 
        });

        setAnswerText('');
        setVideoFile(null);
        setAudioFile(null);
        setSubmitting(false);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideoFile(file);
        } else {
            setVideoFile(null);
        }
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioFile(file);
        } else {
            setAudioFile(null);
        }
    };

    const handleShowOriginal = (textId: string) => {
        setTranslations(prev => {
            const newTranslations = { ...prev };
            delete newTranslations[textId];
            return newTranslations;
        });
    };

    const handleTranslate = async (textId: string, text: string) => {
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

    const doubtTextId = `doubt-${doubt.id}`;
    const doubtTranslation = translations[doubtTextId];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8 border border-slate-200 dark:border-gray-700">
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
                 <div className="flex items-baseline gap-3 flex-wrap mb-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">{doubt.title}</h1>
                    <span className="text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 px-3 py-1 rounded-full whitespace-nowrap">{BRANCH_ACRONYMS[doubt.branch]}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
                    <span>Posted by <span className="font-semibold text-gray-700 dark:text-gray-300">{author.name}</span> on {new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{doubtTranslation?.text || doubt.description}</p>
                 <TranslationControls
                    textId={doubtTextId}
                    translationState={translations[doubtTextId]}
                    targetLanguage={targetLanguage}
                    onTargetLanguageChange={setTargetLanguage}
                    onTranslateRequest={() => handleTranslate(doubtTextId, doubt.description)}
                    onShowOriginalRequest={() => handleShowOriginal(doubtTextId)}
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">{answers.length} Answer{answers.length !== 1 && 's'}</h2>
                
                {answers.map(answer => {
                    const answerTextId = `answer-${answer.id}`;
                    const answerTranslation = translations[answerTextId];
                    return (
                        <div key={answer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 border border-slate-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <img src={answer.authorAvatar} alt={answer.authorName} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{answer.authorName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Answered on {new Date(answer.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{answerTranslation?.text || answer.text}</p>
                            {answer.videoUrl && (
                                <div className="mt-4">
                                    <video
                                        src={answer.videoUrl}
                                        controls
                                        className="w-full max-w-md rounded-lg border dark:border-gray-700 shadow-sm"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {answer.audioUrl && (
                                <div className="mt-4">
                                    <audio
                                        src={answer.audioUrl}
                                        controls
                                        className="w-full"
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                            <TranslationControls
                                textId={answerTextId}
                                translationState={translations[answerTextId]}
                                targetLanguage={targetLanguage}
                                onTargetLanguageChange={setTargetLanguage}
                                onTranslateRequest={() => handleTranslate(answerTextId, answer.text)}
                                onShowOriginalRequest={() => handleShowOriginal(answerTextId)}
                            />

                            {answer.feedback && (
                                <div className="mt-4 bg-slate-100 dark:bg-gray-700/50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">Feedback from Asker</h4>
                                    <div className="flex items-center mt-2">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < answer.feedback!.rating} />)}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">"{answer.feedback.review}"</p>
                                </div>
                            )}

                            {isAsker && !doubt.isResolved && !answer.feedback && (
                                <FeedbackForm answer={answer} doubtId={doubt.id} />
                            )}
                        </div>
                    );
                })}
                
                {!isAsker && !doubt.isResolved && (
                    <form onSubmit={handleAnswerSubmit} className="p-6 md:p-8 bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/50 rounded-xl">
                        <h3 id="post-answer-heading" className="text-xl font-bold mb-4">Post Your Answer</h3>
                        <div>
                            <label htmlFor="answer-textarea" className="sr-only">Your Answer</label>
                            <div className="relative">
                                <textarea
                                    id="answer-textarea"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Share your knowledge or use the mic to dictate..."
                                    className={`w-full p-3 pr-12 border rounded-md border-slate-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-shadow ${isListening ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'}`}
                                    rows={5}
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
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Upload Video (Optional)
                                </label>
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
                                    aria-label="Upload a video answer"
                                />
                            </div>
                             <div>
                                <label htmlFor="audio-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Upload Audio (Optional)
                                </label>
                                <input
                                    id="audio-upload"
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleAudioChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 dark:file:bg-violet-900/50 file:text-violet-700 dark:file:text-violet-300 hover:file:bg-violet-100 dark:hover:file:bg-violet-900"
                                    aria-label="Upload an audio answer"
                                />
                            </div>
                        </div>

                        {videoFile && (
                            <div className="mt-4 border p-4 rounded-lg bg-white dark:bg-gray-700">
                                <p className="text-sm font-semibold mb-2 dark:text-gray-200">Video Preview:</p>
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full max-w-sm rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => setVideoFile(null)}
                                    className="mt-3 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition"
                                >
                                    Remove Video
                                </button>
                            </div>
                        )}

                        {audioFile && (
                            <div className="mt-4 border p-4 rounded-lg bg-white dark:bg-gray-700">
                                <p className="text-sm font-semibold mb-2 dark:text-gray-200">Audio Preview:</p>
                                <audio
                                    src={URL.createObjectURL(audioFile)}
                                    controls
                                    className="w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setAudioFile(null)}
                                    className="mt-3 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition"
                                >
                                    Remove Audio
                                </button>
                            </div>
                        )}
                        
                        <button type="submit" disabled={submitting} className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400">
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