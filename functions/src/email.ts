import { send } from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, text: string) {
  await send({
    from: `Coleridge Summer Fair <info@coleridge-summer-fair.org>`,
    to,
    subject,
    text
  })
  console.log('Email sent to:', to);
}