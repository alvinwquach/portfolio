/**
 * RescheduleConfirmation — Reschedule Approved Template
 * =====================================================
 *
 * Sent to the requester when Alvin approves their rescheduled meeting.
 * Same structure as ConfirmationEmail but with a "Reschedule confirmed"
 * header and a note showing the previous slot.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface RescheduleConfirmationProps {
  name: string
  newFormattedDate: string     // New meeting time in user's timezone
  previousFormattedDate: string // Old meeting time in user's timezone
  durationMinutes: number
  meetLink?: string
  icsUrl: string
  rescheduleUrl: string
  cancelUrl: string
}

export default function RescheduleConfirmation({
  name,
  newFormattedDate,
  previousFormattedDate,
  durationMinutes,
  meetLink,
  icsUrl,
  rescheduleUrl,
  cancelUrl,
}: RescheduleConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Reschedule confirmed — {newFormattedDate} with Alvin Quach</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Reschedule confirmed ✓</Text>

          <Section style={styles.card}>
            <Text style={styles.cardDate}>{newFormattedDate}</Text>
            <Text style={styles.cardDetail}>{durationMinutes} minutes</Text>
            {meetLink && (
              <Text style={styles.cardDetail}>
                Google Meet:{' '}
                <Link href={meetLink} style={styles.link}>{meetLink}</Link>
              </Text>
            )}
          </Section>

          <Text style={styles.previousSlot}>
            Previous slot: {previousFormattedDate}
          </Text>

          {meetLink && (
            <Section style={styles.calendarSection}>
              <Text style={styles.calendarLabel}>Add to calendar:</Text>
              <Link href={icsUrl} style={styles.link}>Download .ics file</Link>
            </Section>
          )}

          <Hr style={styles.divider} />

          <Text style={styles.actionText}>
            Need to reschedule again?{' '}
            <Link href={rescheduleUrl} style={styles.link}>Request a new time</Link>
          </Text>
          <Text style={styles.actionText}>
            Can&apos;t make it?{' '}
            <Link href={cancelUrl} style={styles.link}>Cancel this meeting</Link>
          </Text>
          <Text style={styles.actionNote}>These links expire in 7 days.</Text>

          <Text style={styles.signoff}>See you then! — Alvin</Text>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: '#07090d',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: '0',
  },
  container: { maxWidth: '480px', margin: '0 auto', padding: '24px' },
  heading: { color: '#f1f5f9', fontSize: '20px', fontWeight: '600' as const, margin: '0 0 16px' },
  card: {
    borderLeft: '3px solid #3b82f6',
    padding: '16px',
    margin: '16px 0',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '0 6px 6px 0',
  },
  cardDate: { color: '#f1f5f9', fontWeight: '600' as const, fontSize: '14px', margin: '0 0 8px' },
  cardDetail: { color: '#94a3b8', fontSize: '13px', margin: '0 0 4px' },
  previousSlot: { color: '#475569', fontSize: '12px', margin: '0 0 16px' },
  calendarSection: { margin: '16px 0' },
  calendarLabel: { color: '#94a3b8', fontSize: '13px', fontWeight: '600' as const, margin: '0 0 4px' },
  link: { color: '#3b82f6', textDecoration: 'none' },
  divider: { borderColor: 'rgba(48, 54, 61, 0.7)', margin: '24px 0' },
  actionText: { color: '#475569', fontSize: '12px', margin: '0 0 4px' },
  actionNote: { color: '#475569', fontSize: '11px', margin: '8px 0 0' },
  signoff: { color: '#94a3b8', fontSize: '14px', marginTop: '24px' },
}
