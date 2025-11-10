
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { EmailInputForm } from './components/EmailInputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeEmailForPhishing } from './services/geminiService';
import { AnalysisReport } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailData, setEmailData] = useState({ sender: '', subject: '', body: '' });

  const handleAnalyze = useCallback(async () => {
    if (!emailData.body) {
      setError("Email body cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeEmailForPhishing(emailData.sender, emailData.subject, emailData.body);
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze the email. The AI model might be unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [emailData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <EmailInputForm 
                emailData={emailData} 
                setEmailData={setEmailData} 
                onAnalyze={handleAnalyze} 
                isLoading={isLoading} 
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Analysis Report</h2>
              <div className="flex-grow">
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                       <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-4 text-gray-400">Analyzing email content...</p>
                    </div>
                  </div>
                )}
                {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
                {analysis && !isLoading && <AnalysisResult report={analysis} />}
                {!analysis && !isLoading && !error && (
                   <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <p>Your phishing analysis report will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini. This tool is for educational purposes and is not a substitute for professional cybersecurity advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
