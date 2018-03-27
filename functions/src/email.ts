import { send } from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, html: string) {
  await send({
    from: `Coleridge Summer Fair <info@coleridge-summer-fair.org>`,
    to,
    subject,
    html
  })
  console.log('Email sent to:', to);
}