/**
 * VerifyEmail — Email Verification Template
 * ==========================================
 *
 * WHAT IS REACT EMAIL?
 * --------------------
 * React Email lets you build email templates using React components
 * instead of raw HTML strings. Benefits:
 *   - Type-safe props
 *   - Component reuse
 *   - Preview in browser with `email dev`
 *   - Auto-generates plain text fallback
 *
 * HOW TO USE:
 * -----------
 *   import { render } from '@react-email/render'
 *   import VerifyEmail from '@/emails/VerifyEmail'
 *
 *   const html = await render(
 *     <VerifyEmail name="Jane" verifyUrl="https://..." />
 *   )
 *
 *   await resend.emails.send({ html, ... })
 *
 * EMAIL HTML LIMITATIONS:
 * -----------------------
 * Email clients (Gmail, Outlook, Apple Mail) use VERY limited HTML
 * rendering engines. Many CSS features don't work:
 *   - No flexbox (use tables instead)
 *   - No CSS grid
 *   - No CSS variables
 *   - Limited media queries (no @supports)
 *   - Must inline all styles
 *
 * React Email handles most of this automatically with its components
 * (Container, Section, Row, Column, etc.).
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
} from '@react-email/components'

interface VerifyEmailProps {
  name: string
  verifyUrl: string
}

export default function VerifyEmail({ name, verifyUrl }: VerifyEmailProps) {
  return (
    <Html>
      {/* Head: where you'd put <style> tags for email CSS */}
      <Head />
      {/* Preview: the text shown in inbox before opening the email
          (like a preview snippet next to the subject line) */}
      <Preview>Verify your meeting request with Alvin Quach</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* AQ monogram badge */}
          <Section style={styles.badge}>
            <Text style={styles.badgeText}>AQ</Text>
          </Section>

          <Text style={styles.heading}>Verify your meeting request</Text>

          <Text style={styles.text}>
            Hi {name},
          </Text>
          <Text style={styles.text}>
            You requested a meeting with Alvin Quach.
            Click below to verify your email and submit your request.
          </Text>
          <Text style={styles.textBold}>
            This link expires in 1 hour.
          </Text>

          {/* CTA Button — the verification link */}
          <Section style={styles.buttonContainer}>
            <Button style={styles.button} href={verifyUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={styles.footer}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

/**
 * Inline styles for email compatibility.
 *
 * WHY INLINE STYLES?
 * Email clients strip <style> tags or ignore external stylesheets.
 * Inline styles are the only reliable way to style emails.
 * React Email inlines these automatically when rendering.
 */
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
  textBold: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    fontWeight: '600' as const,
    margin: '0 0 16px',
  },
  buttonContainer: {
    margin: '16px 0',
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
  },
  footer: {
    color: '#475569',
    fontSize: '12px',
    marginTop: '24px',
  },
}
