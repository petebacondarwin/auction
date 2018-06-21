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

export function getTableStyling() {
  return `<style>
  table { border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top; }
  tr { text-align: left; vertical-align: top; }
  th, td { border: solid 1px black; padding: 2px }
</style>`
}

export function getFooter() {
  return `<p class="footer"><small>
  You are receiving this email because you ticked the "Notify me, by email, about my bids" checkbox when you submitted the bid.<br/>
  If you do not wish to receive further emails then please <a href="https://coleridge-summer-fair.org/profile">update your profile</a>, contact us by email, <a href="mailto:auction@coleridge-summer-fair.org?subject=Do not notify me">auction@coleridge-summer-fair.org</a> or phone, 07957157280</em>
</small></p>`
}