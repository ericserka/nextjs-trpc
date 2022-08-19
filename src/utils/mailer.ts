import { compile } from 'handlebars'
import nodemailer from 'nodemailer'
import { throwGenericError } from './errors'

export const sendEmail = async ({
  to,
  subject,
  html,
  htmlInput,
  attachments,
  cc,
}: {
  to: string
  subject: string
  html: string
  htmlInput?: object
  attachments?: {
    filename: string
    path: string
  }[]
  cc?: string
}) => {
  try {
    const testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    const emailReceived = await transporter.sendMail({
      from: '"John Doe" <j.doe@email.com>',
      to,
      subject,
      html: htmlInput ? compile(html)(htmlInput) : html,
      attachments,
      cc,
    })

    // As we are using test smtp, this url simulates the email that would be sent
    console.log(
      `Email Preview URL: ${nodemailer.getTestMessageUrl(emailReceived)}`
    )
  } catch (e) {
    throwGenericError()
  }
}
