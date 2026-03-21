export interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  message: string;
}

export const initialContactState: ContactFormState = {
  status: 'idle',
  message: '',
};
