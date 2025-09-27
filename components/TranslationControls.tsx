import React from 'react';
import { LANGUAGES } from '../constants';

const TranslateIcon = () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4-4 4M5 13h14" /></svg>;
const RevertIcon = () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface TranslationState {
    text: string;
    loading: boolean;
    error?: string;
}

interface TranslationControlsProps {
    textId: string;
    translationState?: TranslationState;
    targetLanguage: string;
    onTargetLanguageChange: (newLang: string) => void;
    onTranslateRequest: () => void;
    onShowOriginalRequest: () => void;
}

const TranslationControls: React.FC<TranslationControlsProps> = ({
    textId,
    translationState,
    targetLanguage,
    onTargetLanguageChange,
    onTranslateRequest,
    onShowOriginalRequest
}) => {
    const isTranslated = translationState?.text && !translationState.loading;
    const isLoading = translationState?.loading ?? false;

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
                {isTranslated ? (
                    <button
                        onClick={onShowOriginalRequest}
                        className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <RevertIcon /> Show Original
                    </button>
                ) : (
                    <>
                        <label htmlFor={`translate-select-${textId}`} className="sr-only">Translate to</label>
                        <select
                            id={`translate-select-${textId}`}
                            value={targetLanguage}
                            onChange={(e) => onTargetLanguageChange(e.target.value)}
                            className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md py-1"
                            disabled={isLoading}
                        >
                            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                        <button 
                            onClick={onTranslateRequest} 
                            className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:no-underline disabled:cursor-wait" 
                            disabled={isLoading}
                        >
                           {isLoading ? <SpinnerIcon /> : <TranslateIcon />}
                           {isLoading ? 'Translating...' : 'Translate'}
                        </button>
                    </>
                )}
            </div>
            {translationState?.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-700">
                    <p className="text-xs text-red-700 dark:text-red-300">{translationState.error}</p>
                </div>
            )}
        </div>
    );
};

export default TranslationControls;
