
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisReport } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      enum: ['Phishing', 'Suspicious', 'Legitimate'],
      description: 'The final classification of the email.',
    },
    riskScore: {
      type: Type.INTEGER,
      description: 'A numerical risk score from 0 (safe) to 100 (highly malicious).',
    },
    explanation: {
      type: Type.STRING,
      description: 'A concise, one to two sentence summary of the reasoning behind the verdict.',
    },
    redFlags: {
      type: Type.ARRAY,
      description: 'A list of specific red flags found in the email.',
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ['Sender', 'Content', 'URL', 'Urgency', 'Generic', 'Attachment', 'Other'],
            description: 'The category of the red flag.',
          },
          description: {
            type: Type.STRING,
            description: 'A detailed explanation of why this is a red flag.',
          },
          problematicText: {
            type: Type.STRING,
            description: 'The exact phrase, URL, or detail from the email that is suspicious.',
          },
        },
        required: ['type', 'description', 'problematicText'],
      },
    },
  },
  required: ['verdict', 'riskScore', 'explanation', 'redFlags'],
};

export async function analyzeEmailForPhishing(sender: string, subject: string, body: string): Promise<AnalysisReport> {
  const prompt = `
    Analyze the following email content for signs of phishing. Provide a detailed report.

    Email Sender: "${sender || 'Not provided'}"
    Email Subject: "${subject || 'Not provided'}"

    Email Body:
    ---
    ${body}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.1,
        },
    });

    const jsonText = response.text.trim();
    // It's good practice to validate the parsed object, but we trust the schema here.
    const report = JSON.parse(jsonText) as AnalysisReport;
    return report;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI model.");
  }
}
