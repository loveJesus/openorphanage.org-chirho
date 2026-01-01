// For God so loved the world that He gave His only begotten Son...

// Email configuration using 2SMTP relay
// Addresses use .fe extension: noreply.fe@openorphanage.org

interface EmailOptionsChirho {
	toChirho: string | string[];
	subjectChirho: string;
	textChirho?: string;
	htmlChirho?: string;
	fromChirho?: string;
	replyToChirho?: string;
}

interface EmailResultChirho {
	successChirho: boolean;
	messageIdChirho?: string;
	errorChirho?: string;
}

// 2SMTP API endpoint
const SMTP_API_ENDPOINT_CHIRHO = 'https://api.2smtp.com/v1/email/send';

/**
 * Send email via 2SMTP relay
 */
export async function sendEmailChirho(
	apiKeyChirho: string,
	optionsChirho: EmailOptionsChirho,
	defaultFromChirho: string = 'noreply.fe@openorphanage.org'
): Promise<EmailResultChirho> {
	try {
		const recipientsChirho = Array.isArray(optionsChirho.toChirho)
			? optionsChirho.toChirho
			: [optionsChirho.toChirho];

		const responseChirho = await fetch(SMTP_API_ENDPOINT_CHIRHO, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKeyChirho}`
			},
			body: JSON.stringify({
				from: optionsChirho.fromChirho || defaultFromChirho,
				to: recipientsChirho,
				subject: optionsChirho.subjectChirho,
				text: optionsChirho.textChirho,
				html: optionsChirho.htmlChirho,
				reply_to: optionsChirho.replyToChirho
			})
		});

		if (!responseChirho.ok) {
			const errorDataChirho = await responseChirho.text();
			console.error('2SMTP API Error:', errorDataChirho);
			return {
				successChirho: false,
				errorChirho: `Email sending failed: ${responseChirho.status}`
			};
		}

		const resultChirho = await responseChirho.json() as { message_id?: string };

		return {
			successChirho: true,
			messageIdChirho: resultChirho.message_id
		};
	} catch (errorChirho) {
		console.error('Email sending error:', errorChirho);
		return {
			successChirho: false,
			errorChirho: errorChirho instanceof Error ? errorChirho.message : 'Unknown error'
		};
	}
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const EMAIL_FOOTER_CHIRHO = `
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
<p style="color: #6b7280; font-size: 12px;">
  OpenOrphanage.org — Transparent Global Orphan Care<br>
  "Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction." — James 1:27
</p>
<p style="color: #9ca3af; font-size: 11px;">
  JESUS CHRIST IS LORD
</p>
`;

/**
 * Welcome email for new users
 */
export function createWelcomeEmailChirho(nameChirho: string): { subjectChirho: string; htmlChirho: string; textChirho: string } {
	return {
		subjectChirho: 'Welcome to OpenOrphanage — In Jesus\' Name',
		htmlChirho: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #f43f5e;">Welcome to OpenOrphanage, ${nameChirho}!</h1>
				<p>Thank you for joining our mission to serve orphans around the world with transparency and love.</p>
				<p>At OpenOrphanage, we believe in:</p>
				<ul>
					<li><strong>Radical Transparency</strong> — Every donation tracked, every need visible</li>
					<li><strong>Child Safety</strong> — Privacy and protection are paramount</li>
					<li><strong>The Complete Journey</strong> — From care to career, walking with children to flourishing</li>
				</ul>
				<p><a href="https://openorphanage.org/dashboard-chirho" style="background: linear-gradient(to right, #f43f5e, #14b8a6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Go to Dashboard</a></p>
				<p>May God bless you richly.</p>
				${EMAIL_FOOTER_CHIRHO}
			</div>
		`,
		textChirho: `
Welcome to OpenOrphanage, ${nameChirho}!

Thank you for joining our mission to serve orphans around the world with transparency and love.

At OpenOrphanage, we believe in:
- Radical Transparency — Every donation tracked, every need visible
- Child Safety — Privacy and protection are paramount
- The Complete Journey — From care to career, walking with children to flourishing

Visit your dashboard: https://openorphanage.org/dashboard-chirho

May God bless you richly.

---
OpenOrphanage.org — Transparent Global Orphan Care
JESUS CHRIST IS LORD
		`
	};
}

/**
 * Safety concern notification to admins
 */
export function createSafetyConcernEmailChirho(
	feedbackIdChirho: string,
	contentChirho: string,
	anonymousChirho: boolean,
	userEmailChirho?: string
): { subjectChirho: string; htmlChirho: string; textChirho: string } {
	return {
		subjectChirho: '🚨 URGENT: Safety Concern Reported — OpenOrphanage',
		htmlChirho: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
					<h1 style="color: #dc2626; margin: 0 0 8px 0;">🚨 Safety Concern Reported</h1>
					<p style="color: #991b1b; margin: 0;">Immediate attention required</p>
				</div>

				<p><strong>Feedback ID:</strong> ${feedbackIdChirho}</p>
				<p><strong>Reporter:</strong> ${anonymousChirho ? 'Anonymous' : (userEmailChirho || 'Unknown')}</p>

				<div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
					<h3 style="margin-top: 0;">Reported Content:</h3>
					<p style="white-space: pre-wrap;">${contentChirho}</p>
				</div>

				<p><a href="https://openorphanage.org/admin-chirho/feedback-chirho/${feedbackIdChirho}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Review Now</a></p>

				${EMAIL_FOOTER_CHIRHO}
			</div>
		`,
		textChirho: `
🚨 SAFETY CONCERN REPORTED — URGENT

Feedback ID: ${feedbackIdChirho}
Reporter: ${anonymousChirho ? 'Anonymous' : (userEmailChirho || 'Unknown')}

Reported Content:
${contentChirho}

Review at: https://openorphanage.org/admin-chirho/feedback-chirho/${feedbackIdChirho}

---
OpenOrphanage.org
JESUS CHRIST IS LORD
		`
	};
}

/**
 * Feedback confirmation email
 */
export function createFeedbackConfirmationEmailChirho(
	feedbackIdChirho: string,
	categoryChirho: string
): { subjectChirho: string; htmlChirho: string; textChirho: string } {
	return {
		subjectChirho: 'Thank you for your feedback — OpenOrphanage',
		htmlChirho: `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #14b8a6;">Thank You for Your Feedback!</h1>
				<p>We've received your ${categoryChirho.replace('_', ' ')} feedback and will review it carefully.</p>
				<p><strong>Reference ID:</strong> ${feedbackIdChirho}</p>
				<p>Your input helps us serve orphans better. Thank you for being part of this mission.</p>
				${EMAIL_FOOTER_CHIRHO}
			</div>
		`,
		textChirho: `
Thank You for Your Feedback!

We've received your ${categoryChirho.replace('_', ' ')} feedback and will review it carefully.

Reference ID: ${feedbackIdChirho}

Your input helps us serve orphans better. Thank you for being part of this mission.

---
OpenOrphanage.org
JESUS CHRIST IS LORD
		`
	};
}

// =============================================================================
// MAILU API INTEGRATION (for mailbox management)
// =============================================================================

const MAILU_API_ENDPOINT_CHIRHO = 'https://mailer-aleluya.xjes.us/api-aleluya/v1';

interface MailuResultChirho {
	successChirho: boolean;
	dataChirho?: unknown;
	errorChirho?: string;
}

/**
 * Create a new mailbox in Mailu
 */
export async function createMailboxChirho(
	mailuTokenChirho: string,
	emailChirho: string,
	passwordChirho: string,
	displayNameChirho: string
): Promise<MailuResultChirho> {
	try {
		const [localPartChirho, domainChirho] = emailChirho.split('@');

		const responseChirho = await fetch(`${MAILU_API_ENDPOINT_CHIRHO}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${mailuTokenChirho}`
			},
			body: JSON.stringify({
				email: emailChirho,
				raw_password: passwordChirho,
				displayed_name: displayNameChirho,
				domain: domainChirho,
				localpart: localPartChirho,
				enabled: true
			})
		});

		if (!responseChirho.ok) {
			const errorChirho = await responseChirho.text();
			return { successChirho: false, errorChirho };
		}

		const dataChirho = await responseChirho.json();
		return { successChirho: true, dataChirho };
	} catch (errorChirho) {
		return {
			successChirho: false,
			errorChirho: errorChirho instanceof Error ? errorChirho.message : 'Unknown error'
		};
	}
}
