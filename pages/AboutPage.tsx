import React from 'react';

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
    <div className="bg-slate-100 dark:bg-gray-800 p-6 rounded-lg border border-slate-200 dark:border-gray-700 h-full">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Welcome to PeerSolve</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our mission is to create a collaborative and accessible learning environment where students can help each other succeed.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-8 border border-slate-200 dark:border-gray-700/50 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">What is PeerSolve?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
          PeerSolve is a peer-to-peer doubt solving network designed exclusively for students. It's a platform where you can ask academic questions and get answers from your peers. Our system uses AI to analyze the quality of answers and rewards helpful students with points, fostering a supportive and knowledgeable community.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
                icon="❓"
                title="Post & Answer Doubts"
                description="Easily post questions with specific subjects and academic years. Browse the feed and help others by sharing your knowledge."
            />
             <FeatureCard 
                icon="🏆"
                title="AI-Powered Leaderboard"
                description="Provide helpful answers, get positive ratings and reviews, and watch our AI award you points to climb the real-time leaderboard."
            />
             <FeatureCard 
                icon="🎤"
                title="Speech-to-Text"
                description="For easier accessibility, you can dictate your doubts and answers using our built-in speech-to-text functionality."
            />
             <FeatureCard 
                icon="🌐"
                title="Multi-language Support"
                description="Break language barriers with our flexible translation feature for both doubts and answers, powered by Gemini. Select a language and translate content on the fly."
            />
        </div>
      </div>
      
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Ready to Join?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Start asking, answering, and learning with your peers today!</p>
      </div>
    </div>
  );
};

export default AboutPage;