/**
 * RescheduleNotification — Notification to Alvin About Reschedule
 * ===============================================================
 *
 * Sent to alvinwquach@gmail.com when someone requests to reschedule.
 * Shows old and new slot times and a link to review in Sanity Studio.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Button,
} from '@react-email/components'

interface RescheduleNotificationProps {
  name: string
  oldSlot: string             // Pre-formatted in America/Los_Angeles
  newSlot: string             // Pre-formatted in America/Los_Angeles
  topic: string
  studioUrl: string           // Deep link to Sanity Studio document
}

export default function RescheduleNotification({
  name,
  oldSlot,
  newSlot,
  topic,
  studioUrl,
}: RescheduleNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{name} requested to reschedule</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Reschedule Request</Text>
          <Text style={styles.text}>
            <strong>{name}</strong> wants to reschedule their meeting.
          </Text>
          <Text style={styles.row}><strong>Old slot:</strong> {oldSlot}</Text>
          <Text style={styles.row}><strong>New slot:</strong> {newSlot}</Text>
          <Text style={styles.row}><strong>Topic:</strong> {topic}</Text>

          <Button style={styles.button} href={studioUrl}>
            Review in Sanity Studio
          </Button>
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
    margin: '0 0 12px',
  },
  row: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '0',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500' as const,
    textDecoration: 'none',
    display: 'inline-block' as const,
    marginTop: '16px',
  },
}
