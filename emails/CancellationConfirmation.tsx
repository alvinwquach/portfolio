/**
 * CancellationConfirmation — Meeting Cancelled Template
 * =====================================================
 *
 * Sent to the requester when they cancel their confirmed meeting.
 * Simple confirmation with a link to re-schedule if they change their mind.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface CancellationConfirmationProps {
  formattedDate: string     // The cancelled meeting date (user's timezone)
  scheduleUrl: string       // Link to /schedule to book again
}

export default function CancellationConfirmation({
  formattedDate,
  scheduleUrl,
}: CancellationConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Meeting cancelled — {formattedDate}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Meeting Cancelled</Text>
          <Text style={styles.text}>
            Your meeting scheduled for <strong>{formattedDate}</strong> has been cancelled.
          </Text>
          <Text style={styles.text}>
            If you&apos;d like to find another time, you&apos;re welcome to{' '}
            <Link href={scheduleUrl} style={styles.link}>
              submit a new request
            </Link>.
          </Text>
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
  text: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 12px',
  },
  link: {
    color: '#3b82f6',
  },
}
