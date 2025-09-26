import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Subject, AcademicYear } from '../types';
import { SUBJECTS, ACADEMIC_YEARS } from '../constants';
import { useSpeechToText } from '../hooks/useSpeechToText';

const MicIcon = ({ isListening }: { isListening: boolean }) => (
    <svg className={`w-6 h-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
);

interface NewDoubtModalProps {
  onClose: () => void;
}

const NewDoubtModal: React.FC<NewDoubtModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { postDoubt } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [year, setYear] = useState<AcademicYear>(ACADEMIC_YEARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSpeechField, setActiveSpeechField] = useState<'title' | 'description' | null>(null);

  const handleTranscriptChange = useCallback((transcript: string) => {
    const textToAdd = transcript.trim();
    if (!textToAdd) return;

    if (activeSpeechField === 'title') {
      setTitle(prev => (prev ? prev + ' ' : '') + textToAdd);
    } else if (activeSpeechField === 'description') {
      setDescription(prev => (prev ? prev + ' ' : '') + textToAdd);
    }
  }, [activeSpeechField]);
  
  const { isListening, error: speechError, toggleListening } = useSpeechToText(handleTranscriptChange);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    await postDoubt({
      title,
      description,
      subject,
      year,
      authorId: user.id,
    });
    setIsSubmitting(false);
    onClose();
  };
  
  const handleMicClick = (field: 'title' | 'description') => {
    // If mic is off, start it for this field.
    if (!isListening) {
      setActiveSpeechField(field);
      toggleListening();
      return;
    }
    
    // If mic is on...
    if (activeSpeechField === field) {
      // ...and we click the active field, turn it off.
      toggleListening();
      setActiveSpeechField(null);
    } else {
      // ...and we click a different field, just switch the active field.
      // The mic stays on, but will now populate the new field.
      setActiveSpeechField(field);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-doubt-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="new-doubt-title" className="text-2xl font-bold">Post a New Doubt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close modal">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
                 {isListening && activeSpeechField === 'title' && (
                    <span className="ml-2 text-xs text-blue-500 animate-pulse font-normal">Listening...</span>
                 )}
              </label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                aria-required="true"
                className={`mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow ${isListening && activeSpeechField === 'title' ? 'ring-2 ring-blue-500' : ''}`}
              />
               <button type="button" onClick={() => handleMicClick('title')} className="absolute top-8 right-3 p-1 rounded-full" aria-label="Dictate title" aria-pressed={isListening && activeSpeechField === 'title'}>
                  <MicIcon isListening={isListening && activeSpeechField === 'title'}/>
              </button>
            </div>
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
                {isListening && activeSpeechField === 'description' && (
                    <span className="ml-2 text-xs text-blue-500 animate-pulse font-normal">Listening...</span>
                 )}
              </label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                aria-required="true"
                rows={6} 
                className={`mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow ${isListening && activeSpeechField === 'description' ? 'ring-2 ring-blue-500' : ''}`}
              ></textarea>
               <button type="button" onClick={() => handleMicClick('description')} className="absolute top-8 right-3 p-1 rounded-full" aria-label="Dictate description" aria-pressed={isListening && activeSpeechField === 'description'}>
                  <MicIcon isListening={isListening && activeSpeechField === 'description'}/>
              </button>
            </div>
             {speechError && <p role="alert" className="text-sm text-red-500">{speechError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value as Subject)} required aria-required="true" className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
                  <select id="year" value={year} onChange={(e) => setYear(e.target.value as AcademicYear)} required aria-required="true" className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-600 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
              {isSubmitting ? 'Posting...' : 'Post Doubt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDoubtModal;