import { defineField, defineType } from "sanity";

/**
 * Feedback Schema
 * ===============
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema stores feedback you've received throughout your career—
 * from code reviews, project retrospectives, interviews, and mentors.
 *
 * Think of it as your personal "feedback journal" that helps you track
 * your growth and learning over time.
 *
 * WHY TRACK FEEDBACK?
 * -------------------
 * In interviews, especially behavioral ones, you'll be asked questions like:
 *   - "Tell me about a time you received constructive criticism"
 *   - "How do you handle feedback?"
 *   - "What's the most valuable thing a mentor taught you?"
 *
 * Having documented feedback with your reflections makes these answers
 * specific and memorable rather than vague and generic.
 *
 * REAL-WORLD INTERVIEW EXAMPLE:
 * -----------------------------
 * Interviewer: "Tell me about a time you received difficult feedback."
 *
 * Without this system: "Um, once a code review said my code was messy..."
 *
 * With this system: "In my last project, a senior engineer pointed out
 * that my React component had 15 useEffects, creating a 'cascade problem.'
 * She suggested using custom hooks to group related state logic.
 * I refactored using 3 custom hooks, reducing the file from 400 to 150 lines.
 * I documented this as a learning in my knowledge base."
 *
 * THE GROWTH MINDSET CONNECTION:
 * ------------------------------
 * This schema embodies growth mindset—the belief that abilities can be
 * developed through dedication and hard work. By tracking feedback:
 *
 *   1. You normalize receiving criticism (everyone gets it!)
 *   2. You create a system for acting on feedback
 *   3. You can show PROGRESS over time
 *   4. You demonstrate self-awareness
 *
 * HOW FEEDBACK RELATES TO OTHER CONTENT:
 * --------------------------------------
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │                      FEEDBACK                               │
 * │  "Code review: Split large component into smaller ones"     │
 * └───────────────────────────┬─────────────────────────────────┘
 *                             │
 *                             ▼
 *    ┌─────────────────────────────────────────────────────────┐
 *    │                       PROJECT                            │
 *    │  The project where you received this feedback            │
 *    │  (e.g., "E-commerce Dashboard")                          │
 *    └─────────────────────────────────────────────────────────┘
 *                             │
 *                             ▼
 *    ┌─────────────────────────────────────────────────────────┐
 *    │                   KNOWLEDGE NODE                         │
 *    │  Blog post: "Lessons from Code Review: Component Design" │
 *    │  (Transform feedback into shareable knowledge)           │
 *    └─────────────────────────────────────────────────────────┘
 *
 * FIELD EXPLANATIONS:
 * -------------------
 *
 * title: Short summary of the feedback
 *   - "PR Review: Improve Error Handling"
 *   - "1:1 Feedback: Communication Skills"
 *   - "Post-Interview: System Design Gaps"
 *
 * slug: URL-friendly identifier
 *   - Used for: /feedback/pr-review-improve-error-handling
 *   - Auto-generated from title
 *
 * source: Who gave the feedback?
 *   - Can be a name: "Sarah (Tech Lead)"
 *   - Or a role: "Senior Engineer"
 *   - Or anonymous: "Code Reviewer"
 *   - Helps you remember context
 *
 * feedbackType: What kind of feedback?
 *   - code-review: PR review, code walkthrough
 *   - project: Sprint retrospective, project post-mortem
 *   - interview: Post-interview feedback (very valuable!)
 *   - peer: Peer review, 360 feedback
 *   - user: User testing, customer feedback
 *   - mentor: 1:1 advice, career guidance
 *
 * sentiment: The nature of the feedback
 *   - positive: Praise, recognition, strengths
 *   - constructive: Areas for improvement, suggestions
 *   - mixed: Both positive and constructive elements
 *
 * content: The full feedback (rich text)
 *   - Copy/paste the actual feedback
 *   - Include quotes when possible
 *   - Supports formatting for readability
 *
 * keyPoints: Bullet point summary
 *   - Quick reference for interviews
 *   - Example: ["Improve variable naming",
 *               "Add more comments",
 *               "Good test coverage though!"]
 *
 * actionItems: What you'll do about it
 *   - Each item has: action (what to do) + completed (did you do it?)
 *   - Example: { action: "Read 'Clean Code' chapter on naming", completed: true }
 *   - Shows you take feedback seriously
 *
 * reflection: YOUR thoughts on the feedback
 *   - What did you learn?
 *   - Do you agree or disagree?
 *   - How will this change your approach?
 *   - This is GOLD for interviews!
 *
 * relatedProject: Which project was this about?
 *   - Reference to a Project document
 *   - Connects feedback to context
 *
 * date: When you received the feedback
 *   - Helps track progress over time
 *   - "I got this feedback in January, by March I had improved"
 *
 * visibility: Public or private?
 *   - public: Show on portfolio (for positive testimonials)
 *   - private: Keep for personal reference (for growth areas)
 *   - Default is private for safety
 *
 * GROQ QUERY EXAMPLES:
 * --------------------
 *
 * // Get all constructive feedback (for personal review)
 * *[_type == "feedback" && sentiment == "constructive"] | order(date desc) {
 *   title,
 *   source,
 *   keyPoints,
 *   reflection,
 *   "actionItemsComplete": count(actionItems[completed == true]),
 *   "actionItemsTotal": count(actionItems)
 * }
 *
 * // Get public positive feedback (for portfolio testimonials)
 * *[_type == "feedback" && sentiment == "positive" && visibility == "public"] {
 *   content,
 *   source,
 *   "projectName": relatedProject->title
 * }
 *
 * // Get feedback by type for interview prep
 * *[_type == "feedback" && feedbackType == "code-review"] | order(date desc) [0...5] {
 *   title,
 *   keyPoints,
 *   reflection
 * }
 *
 * // Get feedback timeline for a specific project
 * *[_type == "feedback" && relatedProject._ref == $projectId] | order(date asc) {
 *   date,
 *   title,
 *   sentiment,
 *   keyPoints
 * }
 *
 * // Count feedback by type and sentiment (for personal analytics)
 * {
 *   "byType": *[_type == "feedback"] {
 *     feedbackType,
 *     sentiment
 *   },
 *   "totalPositive": count(*[_type == "feedback" && sentiment == "positive"]),
 *   "totalConstructive": count(*[_type == "feedback" && sentiment == "constructive"])
 * }
 *
 * INTERVIEW VALUE:
 * ----------------
 * Feedback documentation demonstrates:
 *   1. Self-awareness and humility
 *   2. Growth mindset (learning from criticism)
 *   3. Ability to receive and act on feedback
 *   4. Thoughtful reflection on experiences
 *   5. Continuous improvement mindset
 *
 * PSEUDOCODE FOR RENDERING FEEDBACK:
 * ----------------------------------
 *
 * function renderFeedbackCard(feedback):
 *   sentimentColors = {
 *     positive: "green",
 *     constructive: "orange",
 *     mixed: "blue"
 *   }
 *
 *   sentimentEmojis = {
 *     positive: "👍",
 *     constructive: "🔧",
 *     mixed: "🤔"
 *   }
 *
 *   return (
 *     <Card borderColor={sentimentColors[feedback.sentiment]}>
 *       <Header>
 *         <Title>{feedback.title}</Title>
 *         <Badge>{feedback.feedbackType}</Badge>
 *         <Emoji>{sentimentEmojis[feedback.sentiment]}</Emoji>
 *       </Header>
 *
 *       <Meta>
 *         <Source>From: {feedback.source}</Source>
 *         <Date>{formatDate(feedback.date)}</Date>
 *         if feedback.relatedProject:
 *           <ProjectLink>{feedback.relatedProject.title}</ProjectLink>
 *       </Meta>
 *
 *       if feedback.keyPoints:
 *         <KeyPointsList>
 *           for point in feedback.keyPoints:
 *             <KeyPoint>{point}</KeyPoint>
 *         </KeyPointsList>
 *
 *       if feedback.reflection:
 *         <ReflectionBox>
 *           <Label>My Reflection:</Label>
 *           <Text>{feedback.reflection}</Text>
 *         </ReflectionBox>
 *
 *       if feedback.actionItems:
 *         <ActionItemsList>
 *           for item in feedback.actionItems:
 *             <ActionItem completed={item.completed}>
 *               {item.action}
 *             </ActionItem>
 *         </ActionItemsList>
 *     </Card>
 *   )
 *
 * TIPS FOR COLLECTING FEEDBACK:
 * -----------------------------
 * 1. Ask for feedback after every code review
 * 2. Save interview rejection emails (they often have feedback)
 * 3. Note mentor advice from 1:1s
 * 4. Document retrospective learnings
 * 5. Save user feedback from demos/testing
 *
 * RELATED FILES:
 * --------------
 * - sanity/schemaTypes/project.ts: Projects feedback relates to
 * - sanity/schemaTypes/knowledgeNode.ts: Turn feedback into blog posts
 * - sanity/schemaTypes/experience.ts: Career timeline for context
 *
 * DOCUMENTATION:
 * --------------
 * - Sanity Schema Types: https://www.sanity.io/docs/schema-types
 * - Portable Text (for content field): https://www.sanity.io/docs/block-type
 */
export const feedback = defineType({
  name: "feedback",
  title: "Feedback",
  type: "document",
  icon: () => "💬",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Who gave the feedback? (name or role)",
    }),
    defineField({
      name: "feedbackType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Code Review", value: "code-review" },
          { title: "Project Feedback", value: "project" },
          { title: "Interview Feedback", value: "interview" },
          { title: "Peer Review", value: "peer" },
          { title: "User Feedback", value: "user" },
          { title: "Mentor Advice", value: "mentor" },
        ],
      },
    }),
    defineField({
      name: "sentiment",
      title: "Sentiment",
      type: "string",
      options: {
        list: [
          { title: "Positive", value: "positive" },
          { title: "Constructive", value: "constructive" },
          { title: "Mixed", value: "mixed" },
        ],
      },
    }),
    defineField({
      name: "content",
      title: "Feedback Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "keyPoints",
      title: "Key Points",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "actionItems",
      title: "Action Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "action", type: "string", title: "Action" },
            { name: "completed", type: "boolean", title: "Completed" },
          ],
        },
      ],
    }),
    defineField({
      name: "reflection",
      title: "My Reflection",
      type: "text",
      rows: 3,
      description: "What did you learn from this feedback?",
    }),
    defineField({
      name: "relatedProject",
      title: "Related Project",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "date",
      title: "Date Received",
      type: "date",
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      options: {
        list: [
          { title: "Public", value: "public" },
          { title: "Private", value: "private" },
        ],
      },
      initialValue: "private",
    }),
  ],
  preview: {
    select: { title: "title", source: "source", type: "feedbackType", sentiment: "sentiment" },
    prepare({ title, source, type, sentiment }) {
      const sentimentEmoji: Record<string, string> = {
        positive: "👍",
        constructive: "🔧",
        mixed: "🤔",
      };
      return {
        title,
        subtitle: `${source || "Anonymous"} • ${type || "feedback"} ${sentimentEmoji[sentiment] || ""}`,
      };
    },
  },
});
