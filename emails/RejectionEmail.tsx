/**
 * RejectionEmail — Warm Rejection Template
 * =========================================
 *
 * Sent to the requester when Alvin declines their meeting request.
 * The tone is deliberately warm and personal — not template-feeling.
 * No CTA button, just text with inline links.
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

interface RejectionEmailProps {
  name: string
  rejectionReason?: string
}

export default function RejectionEmail({
  name,
  rejectionReason,
}: RejectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Re: Your meeting request — alvinquach.dev</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.text}>Hi {name},</Text>
          <Text style={styles.text}>
            Thanks for reaching out — I appreciate you taking the time.
          </Text>
          {rejectionReason ? (
            <Text style={styles.text}>
              I&apos;m going to pass for now: {rejectionReason}
            </Text>
          ) : (
            <Text style={styles.text}>
              Unfortunately I&apos;m not able to connect at this time.
            </Text>
          )}
          <Text style={styles.text}>
            Feel free to reach out directly at{' '}
            <Link href="mailto:alvinwquach@gmail.com" style={styles.link}>
              alvinwquach@gmail.com
            </Link>{' '}
            or connect with me on{' '}
            <Link href="https://linkedin.com/in/alvinwquach" style={styles.link}>
              LinkedIn
            </Link>.
          </Text>
          <Text style={styles.signoff}>Best,{'\n'}Alvin</Text>
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
  text: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '0 0 12px',
  },
  link: {
    color: '#3b82f6',
  },
  signoff: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '16px',
    whiteSpace: 'pre-line' as const,
  },
}
