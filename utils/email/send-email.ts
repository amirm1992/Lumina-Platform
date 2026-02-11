import { Resend } from 'resend'
import type { ApplicationStatus } from '@/types/database'

// ─── Resend client (lazy init) ───────────────────────────────────────────────

let resendClient: Resend | null = null

function getResendClient() {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
            console.warn('RESEND_API_KEY not configured - email sending disabled')
            return null
        }
        resendClient = new Resend(apiKey)
    }
    return resendClient
}

// ─── Config helpers ──────────────────────────────────────────────────────────

function getFrom(): string {
    return process.env.EMAIL_FROM || 'Lumina <noreply@golumina.net>'
}

function getReplyTo(): string | undefined {
    return process.env.EMAIL_REPLY_TO || undefined
}

function getAdminEmail(): string {
    return process.env.ADMIN_NOTIFICATION_EMAIL || 'support@golumina.net'
}

function getDashboardUrl(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/dashboard`
}

function getDocHubUrl(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/dochub`
}

function getAdminAppUrl(applicationId: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/admin/applications/${applicationId}`
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Low-level send wrapper — all emails go through here */
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const resend = getResendClient()
    if (!resend) {
        console.warn('Email not sent - Resend not configured')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        await resend.emails.send({
            from: getFrom(),
            replyTo: getReplyTo(),
            to,
            subject,
            html,
        })
        return { success: true }
    } catch (error) {
        console.error(`Failed to send email "${subject}" to ${to}:`, error)
        return { success: false, error }
    }
}

// ─── Shared HTML layout ─────────────────────────────────────────────────────

function emailLayout({ heading, body, ctaUrl, ctaLabel }: {
    heading: string
    body: string
    ctaUrl?: string
    ctaLabel?: string
}): string {
    const ctaBlock = ctaUrl && ctaLabel ? `
        <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
                <td style="background-color: #111827; border-radius: 8px; text-align: center;">
                    <a href="${ctaUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                        ${ctaLabel}
                    </a>
                </td>
            </tr>
        </table>` : ''

    return `<!DOCTYPE html>
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
                                ${heading}
                            </h2>
                            ${body}
                            ${ctaBlock}
                            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                                If you have any questions, simply reply to this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} Lumina Financial Technologies. All rights reserved.
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
</html>`
}

// ═════════════════════════════════════════════════════════════════════════════
// CLIENT-FACING EMAILS
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1. Status update (existing, refactored) ────────────────────────────────

const STATUS_MESSAGES: Partial<Record<ApplicationStatus, { subject: string; heading: string; message: string }>> = {
    pending: {
        subject: 'Application Received',
        heading: 'We have received your application',
        message: 'Your mortgage application is being reviewed. We will update you shortly.',
    },
    in_review: {
        subject: 'Application Under Review',
        heading: 'Your application is under review',
        message: 'Our team is currently reviewing your mortgage application. You will hear from us soon.',
    },
    approved: {
        subject: 'Congratulations! Application Approved',
        heading: 'Your application has been approved!',
        message: 'Congratulations! Your mortgage application has been approved. Next steps will be provided in your dashboard.',
    },
    offers_ready: {
        subject: 'Your Mortgage Offers Are Ready!',
        heading: 'Great news! Your offers are ready',
        message: 'We have matched you with lenders. View your personalized mortgage offers in your dashboard.',
    },
    completed: {
        subject: 'Application Complete',
        heading: 'Your application is complete',
        message: 'Your mortgage application process is now complete. Check your dashboard for details.',
    },
    denied: {
        subject: 'Application Status Update',
        heading: 'Application Update',
        message: 'We regret to inform you that we were unable to proceed with your application at this time.',
    },
}

export async function sendStatusUpdateEmail({
    to, name, status, applicationId,
}: {
    to: string; name: string; status: ApplicationStatus; applicationId: string
}) {
    const statusInfo = STATUS_MESSAGES[status]
    if (!statusInfo) {
        console.warn(`No email template for status: ${status}`)
        return { success: false, error: `No email template for status: ${status}` }
    }

    const safeName = escapeHtml(name)
    return sendEmail({
        to,
        subject: statusInfo.subject,
        html: emailLayout({
            heading: `Hello ${safeName},`,
            body: `
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
                </p>`,
            ctaUrl: getDashboardUrl(),
            ctaLabel: 'View Dashboard &rarr;',
        }),
    })
}

// ─── 2. Application received (client confirmation) ──────────────────────────

export async function sendApplicationReceivedEmail({
    to, name, applicationId,
}: {
    to: string; name: string; applicationId: string
}) {
    const safeName = escapeHtml(name)
    return sendEmail({
        to,
        subject: 'Application Received — Lumina',
        html: emailLayout({
            heading: `Thank you, ${safeName}!`,
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    We've received your mortgage application and our team will begin reviewing it shortly.
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        <strong>Application ID:</strong> #${applicationId.slice(0, 8)}<br>
                        <strong>Status:</strong> Pending Review
                    </p>
                </div>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    You can track your application status anytime from your dashboard. We'll also email you when there's an update.
                </p>`,
            ctaUrl: getDashboardUrl(),
            ctaLabel: 'View Your Dashboard &rarr;',
        }),
    })
}

// ─── 3. Document rejected — please re-upload ────────────────────────────────

export async function sendDocumentRejectedEmail({
    to, name, documentName, category, reason,
}: {
    to: string; name: string; documentName: string; category: string; reason?: string
}) {
    const safeName = escapeHtml(name)
    const safeDocName = escapeHtml(documentName)
    const safeCategory = escapeHtml(category)
    const safeReason = reason ? escapeHtml(reason) : ''

    return sendEmail({
        to,
        subject: 'Action Needed: Please Re-upload Document — Lumina',
        html: emailLayout({
            heading: `Hi ${safeName},`,
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    A document you uploaded needs to be re-submitted.
                </p>
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px;">
                        <strong>Document:</strong> ${safeDocName}
                    </p>
                    <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px;">
                        <strong>Category:</strong> ${safeCategory}
                    </p>
                    ${safeReason ? `<p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Reason:</strong> ${safeReason}</p>` : ''}
                </div>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Please log in to your Document Hub and upload a new version at your earliest convenience.
                </p>`,
            ctaUrl: getDocHubUrl(),
            ctaLabel: 'Go to Document Hub &rarr;',
        }),
    })
}

// ─── 4. Document request — additional docs needed ───────────────────────────

export async function sendDocumentRequestEmail({
    to, name, title, instructions,
}: {
    to: string; name: string; title: string; instructions?: string
}) {
    const safeName = escapeHtml(name)
    const safeTitle = escapeHtml(title)
    const safeInstructions = instructions ? escapeHtml(instructions) : ''

    return sendEmail({
        to,
        subject: 'Additional Documents Requested — Lumina',
        html: emailLayout({
            heading: `Hi ${safeName},`,
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    Our underwriting team has requested an additional document for your application.
                </p>
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;">
                        <strong>Requested:</strong> ${safeTitle}
                    </p>
                    ${safeInstructions ? `<p style="margin: 0; color: #1e40af; font-size: 14px;"><strong>Instructions:</strong> ${safeInstructions}</p>` : ''}
                </div>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Please upload this document through your Document Hub as soon as possible to avoid delays.
                </p>`,
            ctaUrl: getDocHubUrl(),
            ctaLabel: 'Upload Documents &rarr;',
        }),
    })
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN-FACING EMAILS
// ═════════════════════════════════════════════════════════════════════════════

// ─── 5. Admin: new application submitted ────────────────────────────────────

export async function sendAdminNewApplicationEmail({
    applicantName, applicantEmail, applicationId, productType, loanAmount,
}: {
    applicantName: string; applicantEmail: string; applicationId: string; productType?: string; loanAmount?: number
}) {
    const safeName = escapeHtml(applicantName)
    const safeEmail = escapeHtml(applicantEmail)
    const safeProduct = productType ? escapeHtml(productType) : 'N/A'
    const formattedLoan = loanAmount ? `$${loanAmount.toLocaleString()}` : 'N/A'

    return sendEmail({
        to: getAdminEmail(),
        subject: `New Application: ${safeName} — Lumina`,
        html: emailLayout({
            heading: 'New Application Submitted',
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    A new mortgage application has been submitted and is ready for review.
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Applicant:</strong> ${safeName}</p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Email:</strong> ${safeEmail}</p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Product:</strong> ${safeProduct}</p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Loan Amount:</strong> ${formattedLoan}</p>
                    <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Application ID:</strong> #${applicationId.slice(0, 8)}</p>
                </div>`,
            ctaUrl: getAdminAppUrl(applicationId),
            ctaLabel: 'Review Application &rarr;',
        }),
    })
}

// ─── 6. Admin: document uploaded by client ──────────────────────────────────

export async function sendAdminDocumentUploadedEmail({
    uploaderName, uploaderEmail, documentName, category, applicationId,
}: {
    uploaderName: string; uploaderEmail?: string; documentName: string; category: string; applicationId?: string | null
}) {
    const safeName = escapeHtml(uploaderName)
    const safeEmail = uploaderEmail ? escapeHtml(uploaderEmail) : ''
    const safeDocName = escapeHtml(documentName)
    const safeCategory = escapeHtml(category)

    const ctaUrl = applicationId ? getAdminAppUrl(applicationId) : `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/admin`

    return sendEmail({
        to: getAdminEmail(),
        subject: `Document Uploaded: ${safeDocName} — ${safeName}`,
        html: emailLayout({
            heading: 'New Document Uploaded',
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    A client has uploaded a new document for review.
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Uploaded by:</strong> ${safeName}${safeEmail ? ` (${safeEmail})` : ''}</p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>File:</strong> ${safeDocName}</p>
                    <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Category:</strong> ${safeCategory}</p>
                </div>`,
            ctaUrl,
            ctaLabel: 'Review Document &rarr;',
        }),
    })
}

// ─── 7. Admin: new message from client ──────────────────────────────────────

export async function sendAdminNewMessageEmail({
    senderName, senderEmail, subject, preview, threadId,
}: {
    senderName: string; senderEmail: string; subject: string; preview: string; threadId: string
}) {
    const safeName = escapeHtml(senderName)
    const safeEmail = escapeHtml(senderEmail)
    const safeSubject = escapeHtml(subject)
    const safePreview = escapeHtml(preview)

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/admin`

    return sendEmail({
        to: getAdminEmail(),
        subject: `New Message: ${safeSubject} — ${safeName}`,
        html: emailLayout({
            heading: 'New Client Message',
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    A client has sent a new message.
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>From:</strong> ${safeName}${safeEmail ? ` (${safeEmail})` : ''}</p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; font-style: italic;">${safePreview}${preview.length >= 200 ? '...' : ''}</p>
                </div>`,
            ctaUrl: adminUrl,
            ctaLabel: 'View in Admin &rarr;',
        }),
    })
}

// ─── 8. Client: admin replied to your message ───────────────────────────────

export async function sendClientMessageReplyEmail({
    to, name, subject, preview,
}: {
    to: string; name: string; subject: string; preview: string
}) {
    const safeName = escapeHtml(name)
    const safeSubject = escapeHtml(subject)
    const safePreview = escapeHtml(preview)
    const messagesUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://golumina.net'}/messages`

    return sendEmail({
        to,
        subject: `New Reply: ${safeSubject} — Lumina`,
        html: emailLayout({
            heading: `Hi ${safeName},`,
            body: `
                <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    You have a new reply to your message.
                </p>
                <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; font-style: italic;">${safePreview}${preview.length >= 200 ? '...' : ''}</p>
                </div>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Log in to your message center to view the full reply and respond.
                </p>`,
            ctaUrl: messagesUrl,
            ctaLabel: 'View Messages &rarr;',
        }),
    })
}
