'use server';

import { sendContactMessage } from '@/lib/graphql/queries';
import type { ContactFormState } from './contact.types';

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all required fields.' };
  }

  try {
    const result = await sendContactMessage({
      name,
      email,
      subject: subject || undefined,
      message,
    });

    if (result.success) {
      return {
        status: 'success',
        message: result.message || 'Message sent successfully!',
      };
    }

    return {
      status: 'error',
      message: result.message || 'Failed to send message.',
    };
  } catch {
    return {
      status: 'error',
      message: 'An error occurred. Please try again later.',
    };
  }
}
