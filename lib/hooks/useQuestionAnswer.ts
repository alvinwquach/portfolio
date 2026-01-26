/**
 * useQuestionAnswer Hook
 * ======================
 * Lazy-loads question answers on demand
 */

'use client';

import { useState, useEffect } from 'react';

interface QuestionAnswer {
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
}

interface UseQuestionAnswerOptions {
  questionId: string | null;
  enabled?: boolean;
}

interface UseQuestionAnswerReturn {
  data: QuestionAnswer | null;
  isLoading: boolean;
  error: Error | null;
}

const ANSWER_QUERY = `
  query GetQuestionAnswer($id: ID!) {
    interviewQuestion(id: $id) {
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
    }
  }
`;

// Cache for already-loaded answers
const answerCache = new Map<string, QuestionAnswer>();

export function useQuestionAnswer({
  questionId,
  enabled = true,
}: UseQuestionAnswerOptions): UseQuestionAnswerReturn {
  const [data, setData] = useState<QuestionAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId || !enabled) {
      setData(null);
      return;
    }

    // Check cache first
    const cached = answerCache.get(questionId);
    if (cached) {
      setData(cached);
      return;
    }

    // Fetch from API
    const fetchAnswer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: ANSWER_QUERY,
            variables: { id: questionId },
          }),
        });

        const json = await response.json();

        if (json.errors) {
          throw new Error(json.errors[0]?.message || 'Failed to load answer');
        }

        const answerData = json.data?.interviewQuestion as QuestionAnswer;
        if (answerData) {
          answerCache.set(questionId, answerData);
          setData(answerData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswer();
  }, [questionId, enabled]);

  return { data, isLoading, error };
}

// Utility to preload an answer
export function preloadQuestionAnswer(questionId: string): void {
  if (answerCache.has(questionId)) return;

  fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ANSWER_QUERY,
      variables: { id: questionId },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      const answerData = json.data?.interviewQuestion as QuestionAnswer;
      if (answerData) {
        answerCache.set(questionId, answerData);
      }
    })
    .catch(() => {
      // Silently fail preload
    });
}

// Clear the cache (useful for testing or after data changes)
export function clearAnswerCache(): void {
  answerCache.clear();
}
