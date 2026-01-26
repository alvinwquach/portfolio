/**
 * GraphQL to Client Hero Section
 * ===============================
 * Shows the journey: GraphQL Schema → Query → Client View
 * Demonstrates how Sanity + GraphQL powers the meal plan system
 * for Bring The Shreds without any traditional backend.
 *
 * PERFORMANCE: Uses lightweight syntax highlighting instead of Monaco Editor
 * to reduce bundle size by ~1MB.
 */

'use client';

import * as React from 'react';
import { ArrowRight, Check, Users, ChevronRight, Database } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/gsap/animations/ScrollReveal';

/**
 * Lightweight Code Block with syntax highlighting
 * Replaces Monaco Editor (~1MB) with simple CSS-based highlighting (~5KB)
 */
function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: 'typescript' | 'graphql' | 'tsx';
  className?: string;
}) {
  const highlighted = React.useMemo(() => highlightCode(code, language), [code, language]);

  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <pre className="h-[320px] overflow-auto bg-[#1e1e1e] p-4 text-sm font-mono leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

/**
 * Simple syntax highlighter - cached per code string
 */
function highlightCode(code: string, language: string): string {
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments
  html = html.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    '<span class="text-[#6A9955]">$1</span>'
  );

  // Strings
  html = html.replace(
    /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g,
    '<span class="text-[#CE9178]">$&</span>'
  );

  // Keywords
  const keywords = language === 'graphql'
    ? ['query', 'mutation', 'subscription', 'fragment', 'type', 'input', 'enum', 'scalar', 'interface', 'union', 'extend']
    : ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'async', 'await', 'default', 'extends', 'implements'];

  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    html = html.replace(regex, '<span class="text-[#569CD6]">$1</span>');
  });

  // Types and special values
  html = html.replace(
    /\b(string|number|boolean|null|undefined|true|false|String|Int|Float|Boolean|ID)\b/g,
    '<span class="text-[#4EC9B0]">$1</span>'
  );

  // Function calls and properties
  html = html.replace(
    /(\w+)(?=\s*\()/g,
    '<span class="text-[#DCDCAA]">$1</span>'
  );

  // Object keys (before colons)
  html = html.replace(
    /(\w+)(?=\s*:)/g,
    '<span class="text-[#9CDCFE]">$1</span>'
  );

  return html;
}

/**
 * Sanity Schema - the TypeScript code that defines the data model
 */
const sanitySchemaCode = `// schemaTypes/mealPlanRequest.ts
import { defineType, defineField } from 'sanity'

export const mealPlanRequest = defineType({
  name: 'mealPlanRequest',
  title: 'Meal Plan Request',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      type: 'reference',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'goal',
      type: 'string',
      options: {
        list: ['Lose Weight', 'Build Muscle', 'Maintain', 'Balanced'],
      },
    }),
    defineField({
      name: 'activityLevel',
      type: 'string',
      options: {
        list: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'],
      },
    }),
    defineField({
      name: 'dietaryType',
      type: 'string',
      options: {
        list: ['General', 'Keto', 'Vegetarian', 'Vegan', 'Gluten-Free'],
      },
    }),
    defineField({
      name: 'allergies',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'favoriteFoods',
      type: 'text',
    }),
    defineField({
      name: 'targetCalories',
      type: 'number',
    }),
    defineField({
      name: 'macros',
      type: 'object',
      fields: [
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fats', type: 'number' },
      ],
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: ['pending', 'in_progress', 'delivered'],
      },
    }),
  ],
})`;

/**
 * GraphQL Query - the actual query structure
 */
const graphqlQueryCode = `query GetClientMealPlan($clientId: ID!) {
  mealPlanRequest(clientId: $clientId) {
    id
    client {
      name
      email
    }
    goal
    activityLevel
    dietaryType
    allergies
    favoriteFoods
    targetCalories
    macros {
      protein
      carbs
      fats
    }
    status
    mealPlan {
      week
      days {
        date
        meals {
          type
          name
          calories
          macros {
            protein
            carbs
            fats
          }
        }
      }
    }
  }
}`;

/**
 * React Component - how the data is consumed
 */
const reactComponentCode = `// MealPlanDashboard.tsx
import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '@/lib/graphql'

export function MealPlanDashboard({ clientId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['mealPlan', clientId],
    queryFn: () => graphqlClient.request(
      GET_CLIENT_MEAL_PLAN,
      { clientId }
    ),
  })

  if (isLoading) return <Skeleton />

  const { mealPlanRequest } = data

  return (
    <div className="space-y-6">
      <GoalCard goal={mealPlanRequest.goal} />
      <MacroProgress macros={mealPlanRequest.macros} />
      <WeeklyMealGrid
        days={mealPlanRequest.mealPlan.days}
      />
    </div>
  )
}`;

type Tab = 'schema' | 'query' | 'usage';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'schema',
    label: 'Schema',
    icon: <Database className="w-4 h-4" />,
  },
  {
    id: 'query',
    label: 'Query',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
  {
    id: 'usage',
    label: 'Usage',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L1 21h22L12 2zm0 3.83L19.13 19H4.87L12 5.83zM11 16h2v2h-2zm0-6h2v4h-2z" />
      </svg>
    ),
  },
];

const codeForTab: Record<Tab, { code: string; language: 'typescript' | 'graphql' | 'tsx' }> = {
  schema: { code: sanitySchemaCode, language: 'typescript' },
  query: { code: graphqlQueryCode, language: 'graphql' },
  usage: { code: reactComponentCode, language: 'tsx' },
};

export function SanityStudioHero() {
  const [activeTab, setActiveTab] = React.useState<Tab>('schema');

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              From Schema to Screen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how Sanity's structured content flows through GraphQL to power
              a real fitness coaching platform — no traditional backend required.
            </p>
          </div>
        </ScrollReveal>

        {/* Code Demo */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-border/50 bg-muted/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-foreground bg-background border-b-2 border-primary -mb-px'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <CodeBlock
              code={codeForTab[activeTab].code}
              language={codeForTab[activeTab].language}
            />
          </div>
        </ScrollReveal>

        {/* Flow Diagram */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border/50">
              <Database className="w-5 h-5 text-primary" />
              <span className="font-medium">Sanity CMS</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border/50">
              <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <span className="font-medium">GraphQL API</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border/50">
              <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="font-medium">React App</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Benefits */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Type-Safe End to End',
                description:
                  'Schema definitions generate TypeScript types that flow through the entire stack.',
              },
              {
                title: 'No Backend Servers',
                description:
                  'Sanity handles storage, auth, and real-time updates. GraphQL is the only API.',
              },
              {
                title: 'Real-Time Preview',
                description:
                  'Content editors see changes instantly with Sanity\'s live preview integration.',
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="p-5 rounded-lg border border-border/50 bg-card/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">{benefit.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/projects/bring-the-shreds"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              See Full Case Study
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
