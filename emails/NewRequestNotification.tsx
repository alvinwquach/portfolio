/**
 * NewRequestNotification — Notification to Alvin About New Request
 * ================================================================
 *
 * Sent to alvinwquach@gmail.com when a new booking request is verified
 * (status transitions to pending_approval). Shows all requester details
 * and a deep link to the Sanity Studio document.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
  Button,
} from '@react-email/components'

interface NewRequestNotificationProps {
  name: string
  email: string
  company?: string
  role?: string
  topic: string
  formattedSlot: string        // Pre-formatted in America/Los_Angeles
  isPrivateLink: boolean
  studioUrl: string            // Deep link to Sanity Studio document
}

export default function NewRequestNotification({
  name,
  email,
  company,
  role,
  topic,
  formattedSlot,
  isPrivateLink,
  studioUrl,
}: NewRequestNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New meeting request from {name}{company ? ` (${company})` : ''}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>New Meeting Request</Text>

          {/* Details table — using nested Text for email compatibility */}
          <Text style={styles.row}><strong>Name:</strong> {name}</Text>
          <Text style={styles.row}><strong>Email:</strong> {email}</Text>
          {company && <Text style={styles.row}><strong>Company:</strong> {company}</Text>}
          {role && <Text style={styles.row}><strong>Role:</strong> {role}</Text>}
          <Text style={styles.row}><strong>Topic:</strong> {topic}</Text>
          <Text style={styles.row}><strong>Slot:</strong> {formattedSlot} PT</Text>
          <Text style={styles.row}>
            <strong>Type:</strong> {isPrivateLink ? '🔗 Private Link' : '🌐 Public'}
          </Text>

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
