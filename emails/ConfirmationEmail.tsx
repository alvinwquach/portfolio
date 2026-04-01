/**
 * ConfirmationEmail — Meeting Confirmed Template
 * ===============================================
 *
 * Sent to the requester when Alvin approves their booking.
 * Includes: meeting details, Google Meet link, .ics download,
 * and cancel/reschedule links.
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
  Button,
  Hr,
} from '@react-email/components'

interface ConfirmationEmailProps {
  name: string
  formattedDate: string       // Pre-formatted in user's timezone
  durationMinutes: number
  meetLink?: string           // Google Meet URL (may be empty if gcal failed)
  icsUrl: string              // Link to download .ics file
  rescheduleUrl: string       // Reschedule link with JWT
  cancelUrl: string           // Cancel link with JWT
}

export default function ConfirmationEmail({
  name,
  formattedDate,
  durationMinutes,
  meetLink,
  icsUrl,
  rescheduleUrl,
  cancelUrl,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your meeting with Alvin Quach is confirmed</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Your meeting is confirmed ✓</Text>

          {/* Meeting details card with blue left border */}
          <Section style={styles.card}>
            <Text style={styles.cardDate}>{formattedDate}</Text>
            <Text style={styles.cardDetail}>{durationMinutes} minutes</Text>
            {meetLink && (
              <Text style={styles.cardDetail}>
                Google Meet:{' '}
                <Link href={meetLink} style={styles.link}>
                  {meetLink}
                </Link>
              </Text>
            )}
          </Section>

          {/* Calendar links */}
          {meetLink ? (
            <Section style={styles.calendarSection}>
              <Text style={styles.calendarLabel}>Add to calendar:</Text>
              <Link href={icsUrl} style={styles.link}>
                Download .ics file
              </Link>
            </Section>
          ) : (
            <Text style={styles.warning}>
              Calendar invite will be sent separately.
            </Text>
          )}

          <Hr style={styles.divider} />

          {/* Action links — small, at the bottom */}
          <Text style={styles.actionText}>
            Need to reschedule?{' '}
            <Link href={rescheduleUrl} style={styles.link}>
              Request a new time
            </Link>
          </Text>
          <Text style={styles.actionText}>
            Can&apos;t make it?{' '}
            <Link href={cancelUrl} style={styles.link}>
              Cancel this meeting
            </Link>
          </Text>
          <Text style={styles.actionNote}>These links expire in 7 days.</Text>

          <Text style={styles.signoff}>Looking forward to it. — Alvin</Text>
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
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '24px',
  },
  heading: {
    color: '#f1f5f9',
    fontSize: '20px',
    fontWeight: '600' as const,
    margin: '0 0 16px',
  },
  card: {
    borderLeft: '3px solid #3b82f6',
    padding: '16px',
    margin: '16px 0',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '0 6px 6px 0',
  },
  cardDate: {
    color: '#f1f5f9',
    fontWeight: '600' as const,
    fontSize: '14px',
    margin: '0 0 8px',
  },
  cardDetail: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '0 0 4px',
  },
  calendarSection: {
    margin: '16px 0',
  },
  calendarLabel: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600' as const,
    margin: '0 0 4px',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  warning: {
    color: '#f59e0b',
    fontSize: '13px',
  },
  divider: {
    borderColor: 'rgba(48, 54, 61, 0.7)',
    margin: '24px 0',
  },
  actionText: {
    color: '#475569',
    fontSize: '12px',
    margin: '0 0 4px',
  },
  actionNote: {
    color: '#475569',
    fontSize: '11px',
    margin: '8px 0 0',
  },
  signoff: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '24px',
  },
}
