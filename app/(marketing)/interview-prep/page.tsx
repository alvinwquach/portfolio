/**
 * Interview Prep Page
 * ====================
 * Knowledge base for interview preparation - shows how I think through problems.
 */

import { fetchGraphQL } from '@/lib/graphql/client';
import { InterviewPrepClient } from './InterviewPrepClient';

export const metadata = {
  title: 'How I Think Through Problems',
  description: 'Technical interview responses demonstrating problem-solving approach, STAR format answers, and depth across React, Next.js, system design, and behavioral topics.',
};

interface InterviewQuestion {
  _id: string;
  question: string;
  category: string;
  tags: string[];
  roleType: string[];
  isStarred: boolean;
  confidenceLevel: number;
  answer: any[];
  keyPoints: string[];
  projectReferences: {
    _id: string;
    name: string;
    slug: { current: string };
  }[];
  experienceReferences: {
    _id: string;
    company: string;
    role: string;
  }[];
  followUpQuestions: string[];
  redFlags: string[];
  difficulty: string;
}

async function getInterviewQuestions(): Promise<InterviewQuestion[]> {
  const data = await fetchGraphQL<{ interviewQuestions: InterviewQuestion[] }>(
    `query GetInterviewQuestions {
      interviewQuestions {
        _id
        question
        category
        tags
        roleType
        isStarred
        confidenceLevel
        answer
        keyPoints
        projectReferences {
          _id
          name
          slug { current }
        }
        experienceReferences {
          _id
          company
          role
        }
        followUpQuestions
        redFlags
        difficulty
      }
    }`,
    {},
    { revalidate: 3600, tags: ['interviewQuestions'] }
  );
  return data.interviewQuestions || [];
}

export default async function InterviewPrepPage() {
  const questions = await getInterviewQuestions();
  return <InterviewPrepClient questions={questions} />;
}
