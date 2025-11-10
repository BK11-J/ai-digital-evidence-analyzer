import React from 'react';

interface EmailInputFormProps {
  emailData: { sender: string; subject: string; body: string };
  setEmailData: React.Dispatch<React.SetStateAction<{ sender: string; subject: string; body: string }>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const EmailInputForm: React.FC<EmailInputFormProps> = ({ emailData, setEmailData, onAnalyze, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClear = () => {
    setEmailData({ sender: '', subject: '', body: '' });
  };

  const isAnalyzeDisabled = !emailData.body || isLoading;
  const isClearDisabled = (!emailData.sender && !emailData.subject && !emailData.body) || isLoading;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onAnalyze(); }} className="space-y-6">
      <div>
        <label htmlFor="sender" className="block text-sm font-medium text-gray-300">
          Sender's Email (Optional)
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="sender"
            id="sender"
            value={emailData.sender}
            onChange={handleInputChange}
            className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-3 disabled:opacity-50"
            placeholder="suspicious.sender@example.com"
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
          Subject Line (Optional)
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="subject"
            id="subject"
            value={emailData.subject}
            onChange={handleInputChange}
            className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-3 disabled:opacity-50"
            placeholder="Urgent: Action Required!"
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-300">
          Email Body (Required)
        </label>
        <div className="mt-1">
          <textarea
            id="body"
            name="body"
            rows={10}
            value={emailData.body}
            onChange={handleInputChange}
            className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-3 disabled:opacity-50"
            placeholder="Paste the full email content here..."
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
         <button
          type="button"
          onClick={handleClear}
          disabled={isClearDisabled}
          className="w-full sm:w-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isAnalyzeDisabled}
          className="w-full sm:w-auto sm:ml-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-900 disabled:text-cyan-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Email'}
        </button>
      </div>
    </form>
  );
};
