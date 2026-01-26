/**
 * Contact Form Component
 * ======================
 * Client component for sending contact messages via GraphQL mutation
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { sendContactMessage } from '@/lib/graphql/queries';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: '',
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: 'submitting', message: '' });

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Client-side validation
    if (!name || !email || !message) {
      setFormState({
        status: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      const result = await sendContactMessage({
        name,
        email,
        subject: subject || undefined,
        message,
      });

      if (result.success) {
        setFormState({
          status: 'success',
          message: result.message || 'Message sent successfully!',
        });
        // Reset form
        (event.target as HTMLFormElement).reset();
      } else {
        setFormState({
          status: 'error',
          message: result.message || 'Failed to send message.',
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormState({
        status: 'error',
        message: 'An error occurred. Please try again later.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-coral">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          disabled={formState.status === 'submitting'}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-coral">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          disabled={formState.status === 'submitting'}
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          disabled={formState.status === 'submitting'}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-coral">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project or opportunity..."
          rows={6}
          required
          disabled={formState.status === 'submitting'}
        />
      </div>

      {/* Status Messages */}
      {formState.status === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>{formState.message}</p>
        </div>
      )}

      {formState.status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-coral/10 border border-coral/20 rounded-lg text-coral">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{formState.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="gold"
        className="w-full"
        disabled={formState.status === 'submitting'}
      >
        {formState.status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
}
