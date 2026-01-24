import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export type EmailStatus = 'pending' | 'approved' | 'rejected' | 'documents_needed' | 'in_review' | 'offers_ready'

const STATUS_MESSAGES: Record<EmailStatus, { subject: string; heading: string; message: string }> = {
    pending: {
        subject: 'Application Received',
        heading: 'We have received your application',
        message: 'Your mortgage application is being reviewed. We will update you shortly.'
    },
    in_review: {
        subject: 'Application Under Review',
        heading: 'Your application is under review',
        message: 'Our team is currently reviewing your mortgage application. You will hear from us soon.'
    },
    documents_needed: {
        subject: 'Additional Documents Required',
        heading: 'We need additional documents',
        message: 'To proceed with your application, please upload the requested documents in your dashboard.'
    },
    offers_ready: {
        subject: 'Your Mortgage Offers Are Ready!',
        heading: 'Great news! Your offers are ready',
        message: 'We have matched you with lenders. View your personalized mortgage offers in your dashboard.'
    },
    approved: {
        subject: 'Congratulations! Application Approved',
        heading: 'Your application has been approved!',
        message: 'Congratulations! Your mortgage application has been approved. Next steps will be provided in your dashboard.'
    },
    rejected: {
        subject: 'Application Status Update',
        heading: 'Application Update',
        message: 'We regret to inform you that we were unable to proceed with your application at this time.'
    }
}

export async function sendStatusUpdateEmail({
    to,
    name,
    status,
    applicationId,
}: {
    to: string
    name: string
    status: EmailStatus
    applicationId: string
}) {
    const statusInfo = STATUS_MESSAGES[status]
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://lumina.finance'}/dashboard`

    try {
        await resend.emails.send({
            from: 'Lumina <noreply@lumina.finance>',
            to,
            subject: statusInfo.subject,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Lumina</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Hello ${name},
                            </h2>
                            
                            <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                                <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 18px; font-weight: 600;">
                                    ${statusInfo.heading}
                                </h3>
                                <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                                    ${statusInfo.message}
                                </p>
                            </div>
                            
                            <p style="margin: 20px 0; color: #6b7280; font-size: 14px;">
                                <strong>Application ID:</strong> #${applicationId.slice(0, 8)}
                            </p>
                            
                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #111827; border-radius: 8px; text-align: center;">
                                        <a href="${dashboardUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                                            View Dashboard →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                                If you have any questions, simply reply to this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} Lumina Financial Technologies. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                AI-Powered Mortgage Platform | Simplifying Home Financing
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to send status update email:', error)
        return { success: false, error }
    }
}
