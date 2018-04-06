import { auth, Event } from 'firebase-functions';
import { sendEmail } from './email';

export const sendWelcomeEmail = auth.user()
  .onCreate(async (event: Event<any>) => {
    const user = event.data;
    await sendEmail(user.email, `Welcome to the Coleridge Summer Fair!`, `Hi ${user.displayName || ''}!\nWelcome to the Coleridge Summer Fair.`);
  });