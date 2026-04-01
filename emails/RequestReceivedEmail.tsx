/**
 * RequestReceivedEmail — "Your request is pending review"
 * ========================================================
 *
 * Sent to the requester AFTER they verify their email.
 * Confirms that the request was received and explains what happens next.
 *
 * This fills the gap between the verification email and the
 * confirmation/rejection email. Without it, the requester verifies
 * their email and then hears nothing until Alvin acts.
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface RequestReceivedEmailProps {
  name: string
  formattedSlot: string        // Pre-formatted in user's timezone
  durationLabel: string        // e.g., "30 min"
  topic: string
}

export default function RequestReceivedEmail({
  name,
  formattedSlot,
  durationLabel,
  topic,
}: RequestReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your meeting request has been received — alvinquach.dev</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* AQ badge */}
          <Section style={styles.badge}>
            <Text style={styles.badgeText}>AQ</Text>
          </Section>

          <Text style={styles.heading}>Request received</Text>

          <Text style={styles.text}>
            Hi {name},
          </Text>
          <Text style={styles.text}>
            Your meeting request has been submitted and is now pending review.
            I&apos;ll get back to you within 24 hours.
          </Text>

          {/* Request details card */}
          <Section style={styles.card}>
            <Text style={styles.cardLabel}>Requested time</Text>
            <Text style={styles.cardValue}>{formattedSlot}</Text>
            <Text style={styles.cardDetail}>{durationLabel} · Google Meet</Text>
          </Section>

          <Text style={styles.topicLabel}>Your message:</Text>
          <Text style={styles.topicText}>&ldquo;{topic}&rdquo;</Text>

          {/* What happens next */}
          <Text style={styles.subheading}>What happens next?</Text>
          <Section style={styles.steps}>
            <Text style={styles.step}>
              <span style={styles.stepNumber}>1</span>
              I review your request personally
            </Text>
            <Text style={styles.step}>
              <span style={styles.stepNumber}>2</span>
              If approved, you&apos;ll receive a calendar invite with a Google Meet link
            </Text>
            <Text style={styles.step}>
              <span style={styles.stepNumber}>3</span>
              If I&apos;m unable to meet, I&apos;ll let you know with an explanation
            </Text>
          </Section>

          <Text style={styles.footer}>
            No action needed from you — just sit tight. If you have questions in the meantime,
            reply to this email or reach me at alvinwquach@gmail.com.
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
  badge: {
    backgroundColor: '#3b82f6',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center' as const,
    lineHeight: '40px',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: 'bold' as const,
    fontSize: '18px',
    margin: '0',
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
  card: {
    borderLeft: '3px solid #3b82f6',
    padding: '14px 16px',
    margin: '20px 0',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '0 6px 6px 0',
  },
  cardLabel: {
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 6px',
  },
  cardValue: {
    color: '#f1f5f9',
    fontSize: '15px',
    fontWeight: '600' as const,
    margin: '0 0 4px',
  },
  cardDetail: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '0',
  },
  topicLabel: {
    color: '#475569',
    fontSize: '12px',
    fontWeight: '500' as const,
    margin: '0 0 4px',
  },
  topicText: {
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    lineHeight: '1.5',
    margin: '0 0 24px',
  },
  subheading: {
    color: '#f1f5f9',
    fontSize: '15px',
    fontWeight: '600' as const,
    margin: '0 0 12px',
  },
  steps: {
    margin: '0 0 24px',
  },
  step: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 8px',
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    gap: '10px',
  },
  stepNumber: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '11px',
    color: '#94a3b8',
    flexShrink: 0,
  },
  footer: {
    color: '#475569',
    fontSize: '13px',
    lineHeight: '1.6',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '16px',
    marginTop: '8px',
  },
}
