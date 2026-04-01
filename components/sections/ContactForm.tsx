'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact } from '@/app/actions/contact';
import { initialContactState } from '@/app/actions/contact.types';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  color: 'var(--ds-text)',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: 6,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        padding: '10px 16px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: pending ? 'rgba(59,130,246,0.5)' : '#3b82f6',
        color: 'white',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
      className="hover:opacity-85 transition-opacity"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label htmlFor="name" style={labelStyle}>Name <span style={{ color: '#ef4444' }}>*</span></label>
        <input id="name" name="name" type="text" placeholder="Your name" required disabled={isPending} style={inputStyle} className="focus:border-[rgba(59,130,246,0.4)]" />
      </div>

      <div>
        <label htmlFor="email" style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
        <input id="email" name="email" type="email" placeholder="your.email@example.com" required disabled={isPending} style={inputStyle} className="focus:border-[rgba(59,130,246,0.4)]" />
      </div>

      <div>
        <label htmlFor="subject" style={labelStyle}>Subject</label>
        <input id="subject" name="subject" type="text" placeholder="What's this about?" disabled={isPending} style={inputStyle} className="focus:border-[rgba(59,130,246,0.4)]" />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message <span style={{ color: '#ef4444' }}>*</span></label>
        <textarea id="message" name="message" placeholder="Tell me about your project or opportunity..." rows={5} required disabled={isPending}
          style={{ ...inputStyle, resize: 'vertical' }} className="focus:border-[rgba(59,130,246,0.4)]" />
      </div>

      {state.status === 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 13 }}>
          <CheckCircle size={16} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0 }}>{state.message}</p>
        </div>
      )}

      {state.status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 13 }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0 }}>{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
