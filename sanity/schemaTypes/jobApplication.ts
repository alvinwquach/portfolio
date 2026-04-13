import { defineField, defineType } from 'sanity'

const STATUS_OPTIONS = [
  { title: 'Saved', value: 'saved' },
  { title: 'Applied', value: 'applied' },
  { title: 'Phone Screen', value: 'phone-screen' },
  { title: 'Technical', value: 'technical' },
  { title: 'Onsite', value: 'onsite' },
  { title: 'Offer', value: 'offer' },
  { title: 'Rejected', value: 'rejected' },
  { title: 'Ghosted', value: 'ghosted' },
  { title: 'Withdrawn', value: 'withdrawn' },
]

const STATUS_EMOJI: Record<string, string> = {
  saved: '💾',
  applied: '📨',
  'phone-screen': '📞',
  technical: '💻',
  onsite: '🏢',
  offer: '🎉',
  rejected: '❌',
  ghosted: '👻',
  withdrawn: '🚪',
}

const INTERVIEW_TYPE_OPTIONS = [
  { title: 'Phone Screen', value: 'phone-screen' },
  { title: 'Technical', value: 'technical' },
  { title: 'Behavioral', value: 'behavioral' },
  { title: 'System Design', value: 'system-design' },
  { title: 'Take Home', value: 'take-home' },
  { title: 'Onsite', value: 'onsite' },
  { title: 'Panel', value: 'panel' },
  { title: 'Final Round', value: 'final-round' },
  { title: 'Other', value: 'other' },
]

const SOURCE_OPTIONS = [
  { title: 'LinkedIn', value: 'linkedin' },
  { title: 'Company Site', value: 'company-site' },
  { title: 'Referral', value: 'referral' },
  { title: 'Indeed', value: 'indeed' },
  { title: 'AngelList', value: 'angellist' },
  { title: 'Other', value: 'other' },
]

const REJECTION_REASON_OPTIONS = [
  { title: 'No Response', value: 'no-response' },
  { title: 'After Screen', value: 'after-screen' },
  { title: 'After Technical', value: 'after-technical' },
  { title: 'After Onsite', value: 'after-onsite' },
  { title: 'Compensation', value: 'compensation' },
  { title: 'Role Filled', value: 'role-filled' },
  { title: 'Other', value: 'other' },
]

export const jobApplication = defineType({
  name: 'jobApplication',
  title: 'Job Application',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobUrl',
      title: 'Job URL',
      type: 'url',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: STATUS_OPTIONS },
      initialValue: 'saved',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateApplied',
      title: 'Date Applied',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'salaryRange',
      title: 'Salary Range',
      type: 'object',
      fields: [
        defineField({ name: 'min', title: 'Min', type: 'number' }),
        defineField({ name: 'max', title: 'Max', type: 'number' }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'USD',
        }),
      ],
    }),
    defineField({
      name: 'interviewDates',
      title: 'Interview Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: { list: INTERVIEW_TYPE_OPTIONS },
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
            }),
            defineField({
              name: 'interviewer',
              title: 'Interviewer',
              type: 'string',
            }),
            defineField({
              name: 'gcalEventId',
              title: 'Google Calendar Event ID',
              type: 'string',
              readOnly: true,
            }),
          ],
          preview: {
            select: { date: 'date', type: 'type', interviewer: 'interviewer' },
            prepare({ date, type, interviewer }) {
              const label = type
                ? type.replace('-', ' ')
                : 'Interview'
              const sub = [
                date ? new Date(date).toLocaleDateString() : 'No date',
                interviewer,
              ]
                .filter(Boolean)
                .join(' — ')
              return { title: label, subtitle: sub }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'contacts',
      title: 'Contacts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
            defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
          ],
          preview: {
            select: { name: 'name', role: 'role' },
            prepare({ name, role }) {
              return { title: name || 'Contact', subtitle: role }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      options: { rows: 4 } as Record<string, unknown>,
    }),
    defineField({
      name: 'nextStep',
      title: 'Next Step',
      type: 'string',
    }),
    defineField({
      name: 'nextStepDate',
      title: 'Next Step Date',
      type: 'date',
    }),
    defineField({
      name: 'referral',
      title: 'Referral',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: SOURCE_OPTIONS },
    }),
    defineField({
      name: 'rejectionReason',
      title: 'Rejection Reason',
      type: 'string',
      options: { list: REJECTION_REASON_OPTIONS },
      hidden: ({ parent }) => parent?.status !== 'rejected',
    }),
    defineField({
      name: 'compensation',
      title: 'Compensation Details',
      type: 'object',
      hidden: ({ parent }) => parent?.status !== 'offer',
      fields: [
        defineField({ name: 'baseSalary', title: 'Base Salary', type: 'number' }),
        defineField({ name: 'equity', title: 'Equity', type: 'string' }),
        defineField({ name: 'bonus', title: 'Bonus', type: 'string' }),
        defineField({ name: 'notes', title: 'Notes', type: 'text' }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Date Applied (Newest)',
      name: 'dateAppliedDesc',
      by: [{ field: 'dateApplied', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Company (A-Z)',
      name: 'companyAsc',
      by: [{ field: 'company', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      company: 'company',
      role: 'role',
      status: 'status',
    },
    prepare({ company, role, status }) {
      const emoji = STATUS_EMOJI[status] || '📄'
      return {
        title: `${emoji} ${company}`,
        subtitle: role,
      }
    },
  },
})
