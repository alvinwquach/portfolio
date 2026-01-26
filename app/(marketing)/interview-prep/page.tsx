/**
 * Interview Prep Page
 * ====================
 * Knowledge base for interview preparation - shows how I think through problems.
 * For recruiters: See depth of understanding and decision-making.
 * For me: Quick reference before interviews.
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

  return (
    <div className="py-24">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How I Think Through Problems
          </h1>
          <p className="text-lg text-muted-foreground">
            Technical depth isn&apos;t just knowing the answer — it&apos;s knowing <em>why</em>.
            Here&apos;s how I approach common interview topics, with real examples from
            systems I&apos;ve built.
          </p>
        </div>

        {/* Interactive Client Component */}
        <InterviewPrepClient questions={questions} />
      </div>
    </div>
  );
}
