import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);


const NavigationArrows = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
            <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all hover:scale-110"
            >
                <ArrowLeftIcon />
            </button>
            <button
                onClick={() => navigate(1)}
                aria-label="Go forward"
                className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all hover:scale-110"
            >
                <ArrowRightIcon />
            </button>
        </div>
    );
};

export default NavigationArrows;