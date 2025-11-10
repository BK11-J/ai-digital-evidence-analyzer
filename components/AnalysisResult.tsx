
import React from 'react';
import { AnalysisReport, RedFlag, Verdict, RedFlagType } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { AtSignIcon } from './icons/AtSignIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageCircleWarningIcon } from './icons/MessageCircleWarningIcon';


const verdictConfig: { [key in Verdict]: { color: string; bgColor: string; icon: React.ReactNode } } = {
  Phishing: {
    color: 'text-red-300',
    bgColor: 'bg-red-500/20',
    icon: <ShieldExclamationIcon className="h-6 w-6" />,
  },
  Suspicious: {
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-500/20',
    icon: <AlertTriangleIcon className="h-6 w-6" />,
  },
  Legitimate: {
    color: 'text-green-300',
    bgColor: 'bg-green-500/20',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
  },
};

const flagIcons: { [key in RedFlagType]: React.ReactNode } = {
    Sender: <AtSignIcon className="h-5 w-5 text-gray-400" />,
    Content: <MessageCircleWarningIcon className="h-5 w-5 text-gray-400" />,
    URL: <LinkIcon className="h-5 w-5 text-gray-400" />,
    Urgency: <AlertTriangleIcon className="h-5 w-5 text-gray-400" />,
    Generic: <MessageCircleWarningIcon className="h-5 w-5 text-gray-400" />,
    Attachment: <LinkIcon className="h-5 w-5 text-gray-400" />,
    Other: <AlertTriangleIcon className="h-5 w-5 text-gray-400" />,
};

const RiskScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const width = `${score}%`;
  const color = score > 75 ? 'bg-red-500' : score > 40 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">Risk Score</span>
        <span className={`text-sm font-medium ${verdictConfig[score > 75 ? 'Phishing' : score > 40 ? 'Suspicious' : 'Legitimate'].color}`}>{score} / 100</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width }}></div>
      </div>
    </div>
  );
};


const RedFlagItem: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  return (
    <li className="flex items-start space-x-4 p-3 bg-gray-900/50 rounded-lg">
      <div className="flex-shrink-0 pt-1">
        {flagIcons[flag.type] || <AlertTriangleIcon className="h-5 w-5 text-gray-400" />}
      </div>
      <div>
        <h4 className="font-semibold text-gray-200">{flag.type}</h4>
        <p className="text-sm text-gray-400">{flag.description}</p>
        {flag.problematicText && (
             <p className="mt-1 text-xs text-red-400 bg-red-900/40 p-2 rounded font-mono break-all">
                <code>{flag.problematicText}</code>
             </p>
        )}
      </div>
    </li>
  );
};


export const AnalysisResult: React.FC<{ report: AnalysisReport }> = ({ report }) => {
  const config = verdictConfig[report.verdict];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`${config.bgColor} ${config.color} p-4 rounded-lg flex items-center space-x-3`}>
        {config.icon}
        <span className="font-bold text-lg">{report.verdict}</span>
      </div>
      
      <RiskScoreBar score={report.riskScore} />

      <div>
        <h3 className="font-semibold text-gray-200">Summary</h3>
        <p className="mt-1 text-gray-400 text-sm">{report.explanation}</p>
      </div>

      {report.redFlags && report.redFlags.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-200 mb-2">Detected Red Flags</h3>
          <ul className="space-y-3">
            {report.redFlags.map((flag, index) => (
              <RedFlagItem key={index} flag={flag} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
