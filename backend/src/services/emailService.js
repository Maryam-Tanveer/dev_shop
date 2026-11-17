import nodemailer from 'nodemailer'

let transporter = null

/**
 * Initialize email transporter (SMTP or Ethereal test account in development)
 */
const getTransporter = async () => {
  if (transporter) return transporter

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = Number(process.env.SMTP_PORT) || 465

  if (smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    console.log(`[EMAIL] SMTP Transporter connected via ${smtpHost}:${smtpPort} as ${smtpUser}`)
  } else {
    // Development fallback using Ethereal test credentials
    console.warn('[EMAIL NOTICE] To send real emails, set SMTP_USER and SMTP_PASS in backend/.env.')
    try {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
      console.log(`[EMAIL] Dev Ethereal test transporter initialized (${testAccount.user})`)
    } catch {
      // Fallback: dummy mock transporter
      transporter = {
        sendMail: async (opts) => {
          console.log(`[EMAIL MOCK DISPATCH] To: ${opts.to} | Subject: ${opts.subject}`)
          return { messageId: `mock_${Date.now()}` }
        },
      }
    }
  }

  return transporter
}

/**
 * Generate luxury streetwear HTML template for Order Confirmation & Invoice
 */
const renderOrderInvoiceHtml = (order) => {
  const itemsHtml = (order.items || [])
    .map((item) => {
      const img = item.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80'
      const price = Number(item.price || 0).toFixed(2)
      const qty = item.quantity || 1
      const lineTotal = (Number(item.price || 0) * qty).toFixed(2)

      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #262626;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="70" valign="top">
                  <img src="${img}" alt="${item.title}" width="60" height="60" style="border-radius: 8px; object-fit: cover; display: block; border: 1px solid #333;" />
                </td>
                <td valign="middle" style="padding-left: 12px;">
                  <div style="font-size: 14px; font-weight: 700; color: #ffffff; line-height: 1.3;">${item.title}</div>
                  <div style="font-size: 12px; color: #a3a3a3; margin-top: 4px;">
                    ${item.size ? `Size: <strong style="color:#ffffff;">${item.size}</strong> &bull; ` : ''}
                    ${item.colorway ? `Color: <strong style="color:#ffffff;">${item.colorway}</strong> &bull; ` : ''}
                    Qty: <strong style="color:#ffffff;">${qty}</strong>
                  </div>
                </td>
                <td width="90" align="right" valign="middle">
                  <div style="font-size: 14px; font-weight: 800; color: #ffffff;">$${lineTotal}</div>
                  <div style="font-size: 11px; color: #737373;">$${price} each</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    })
    .join('')

  const addr = order.shippingAddress || {}
  const addressString = [
    `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
    addr.address,
    addr.apartment,
    `${addr.city || ''}${addr.state ? `, ${addr.state}` : ''} ${addr.zipCode || ''}`.trim(),
    addr.country || 'United States',
  ]
    .filter(Boolean)
    .join('<br />')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Receipt #${order.orderNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0d0d0d; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #171717; border-radius: 18px; overflow: hidden; border: 1px solid #262626; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                
                <!-- Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 100%); padding: 32px 36px; border-bottom: 2px solid #c81d25;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">
                            DEV<span style="color: #c81d25;">SHOP</span>
                          </div>
                          <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.25em; color: #a3a3a3; text-transform: uppercase; margin-top: 4px;">
                            Vault Allocation & Authentic Streetwear
                          </div>
                        </td>
                        <td align="right">
                          <span style="background-color: #262626; color: #22c55e; border: 1px solid #16a34a; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 20px; text-transform: uppercase;">
                            &bull; Confirmed
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px;">
                    <!-- Headline -->
                    <div style="font-size: 22px; font-weight: 900; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.02em;">
                      Your Drop Order is Secured.
                    </div>
                    <div style="font-size: 14px; color: #a3a3a3; line-height: 1.5; margin-bottom: 24px;">
                      Thank you for your order! Your limited-edition allocation has been registered in the Dev Shop Vault. Our authenticators are preparing physical inspection and armored courier dispatch.
                    </div>

                    <!-- Meta Details Box -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0f0f0f; border: 1px solid #262626; border-radius: 12px; margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 16px 20px; border-right: 1px solid #262626;" width="50%">
                          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #737373; letter-spacing: 0.15em;">Order Number</div>
                          <div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 4px; font-family: monospace;">${order.orderNumber}</div>
                        </td>
                        <td style="padding: 16px 20px;" width="50%">
                          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #737373; letter-spacing: 0.15em;">Date Placed</div>
                          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 4px;">
                            ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Items Table -->
                    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #c81d25; margin-bottom: 12px;">
                      Secured Allocations
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                      ${itemsHtml}
                    </table>

                    <!-- Financial Breakdown Table -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0f0f0f; border-radius: 12px; padding: 18px 20px; border: 1px solid #262626; margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #a3a3a3;">Subtotal</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                          $${Number(order.subtotal || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #a3a3a3;">Tamper-Proof Courier Shipping</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #22c55e;">
                          ${Number(order.shippingCost || 0) > 0 ? `$${Number(order.shippingCost).toFixed(2)}` : 'FREE'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #a3a3a3;">Estimated State & Local Tax</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                          $${Number(order.tax || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #262626; padding-top: 12px; margin-top: 6px;"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 16px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">Total Paid</td>
                        <td align="right" style="font-size: 18px; font-weight: 900; color: #c81d25;">
                          $${Number(order.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </table>

                    <!-- Shipping Address & Delivery Method -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 28px;">
                      <tr>
                        <td valign="top" width="50%" style="padding-right: 12px;">
                          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #737373; margin-bottom: 8px;">
                            Delivery Destination
                          </div>
                          <div style="font-size: 13px; color: #d4d4d4; line-height: 1.5;">
                            ${addressString || 'Standard Dispatch Destination'}
                          </div>
                        </td>
                        <td valign="top" width="50%" style="padding-left: 12px;">
                          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #737373; margin-bottom: 8px;">
                            Verification Guarantee
                          </div>
                          <div style="font-size: 13px; color: #d4d4d4; line-height: 1.5;">
                            &bull; NFC Authenticity Tag Included<br />
                            &bull; 100% Deadstock Verified<br />
                            &bull; Armored Tracked Dispatch
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-top: 8px;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account" style="display: inline-block; background-color: #c81d25; color: #ffffff; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; padding: 14px 32px; border-radius: 30px;">
                            View Order in Vault &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f0f0f; padding: 24px 36px; border-top: 1px solid #262626; text-align: center;">
                    <div style="font-size: 11px; color: #737373; line-height: 1.6;">
                      Questions about this drop allocation? Reach our VIP drop desk at <a href="mailto:support@devshop.io" style="color: #a3a3a3; text-decoration: underline;">support@devshop.io</a><br />
                      &copy; ${new Date().getFullYear()} Dev Shop Vault Inc. All rights reserved.
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

/**
 * Send Order Receipt Email
 */
export const sendOrderReceiptEmail = async (order) => {
  const recipient = order.userEmail || order.email
  if (!recipient) {
    console.warn('[EMAIL WARNING] Cannot send receipt: No recipient email provided.')
    return { success: false, error: 'Recipient email missing' }
  }

  try {
    const mailer = await getTransporter()
    const fromAddress = process.env.EMAIL_FROM || '"Dev Shop Vault" <receipts@devshop.io>'

    const mailOptions = {
      from: fromAddress,
      to: recipient,
      subject: `Order Confirmed: ${order.orderNumber} - Dev Shop Vault`,
      html: renderOrderInvoiceHtml(order),
    }

    const info = await mailer.sendMail(mailOptions)

    console.log(`[EMAIL DISPATCHED] Order receipt sent to ${recipient} (Message ID: ${info.messageId})`)

    // If Ethereal test message, log the preview URL in console
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[EMAIL PREVIEW URL] 🔗 Inspect invoice in browser: ${previewUrl}`)
    }

    return { success: true, messageId: info.messageId, previewUrl }
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send order receipt email:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Send Drop Alert Email
 */
export const sendDropAlertEmail = async ({ email, dropTitle, releaseDate, dropUrl }) => {
  if (!email) return { success: false, error: 'No email provided' }

  try {
    const mailer = await getTransporter()
    const fromAddress = process.env.EMAIL_FROM || '"Dev Shop Vault" <drops@devshop.io>'

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: `🚨 VIP Drop Alert: ${dropTitle} Is Going Live!`,
      html: `
        <div style="font-family: sans-serif; background: #121212; color: #fff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
          <h2 style="color: #c81d25; text-transform: uppercase;">VIP Drop Allocation Alert</h2>
          <p style="font-size: 16px;">The drop you requested notifications for is arriving:</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin: 20px 0;">
            <div style="font-size: 18px; font-weight: bold;">${dropTitle}</div>
            <div style="font-size: 14px; color: #aaa; margin-top: 5px;">Release Schedule: ${releaseDate || 'Today at 10:00 AM EST'}</div>
          </div>
          <a href="${dropUrl || 'http://localhost:5173/products'}" style="display: inline-block; background: #c81d25; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px;">
            Secure Drop Allocation
          </a>
        </div>
      `,
    }

    const info = await mailer.sendMail(mailOptions)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[EMAIL PREVIEW URL] 🔗 Drop alert preview: ${previewUrl}`)
    }
    return { success: true, messageId: info.messageId, previewUrl }
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send drop alert:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Send Newsletter Welcome Email
 */
export const sendNewsletterWelcomeEmail = async ({ email }) => {
  if (!email) return { success: false, error: 'No email provided' }

  try {
    const mailer = await getTransporter()
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
    const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"Dev Shop" <${smtpUser}>` : '"Dev Shop" <newsletter@devshop.io>')

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: "🎉 You're on the list! Welcome to Dev Shop VIP Club (+ 10% OFF Promo)",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #f5f5f5; padding: 36px 20px; border-radius: 16px; max-width: 560px; margin: auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">DEV<span style="color: #c81d25;">SHOP</span></span>
            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">AUTHENTIC DROP VAULT</div>
          </div>

          <div style="background: linear-gradient(135deg, #1c1c22 0%, #121215 100%); padding: 28px 24px; border-radius: 14px; border: 1px solid #3f3f46; text-align: center; margin-bottom: 24px;">
            <span style="background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 12px;">VIP MEMBERSHIP ACTIVE</span>
            <h2 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0 0 10px 0; letter-spacing: -0.5px;">Welcome to Dev Shop!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0;">
              Thank you for subscribing to our newsletter! You will now receive first-access alerts on exclusive drops, limited allocations, and member-only sales.
            </p>

            <div style="background: #000000; border: 2px dashed #c81d25; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
              <div style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Your VIP Welcome Discount</div>
              <div style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 4px; margin-top: 4px; font-family: monospace;">WELCOME10</div>
              <div style="font-size: 12px; color: #22c55e; font-weight: 700; margin-top: 4px;">✓ 10% OFF YOUR FIRST DROP ORDER</div>
            </div>

            <a href="${(process.env.FRONTEND_URL || 'http://localhost:5173') + '/products'}" style="display: inline-block; background: #c81d25; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(200, 29, 37, 0.4);">
              Explore Drops Catalog &rarr;
            </a>
          </div>

          <div style="text-align: center; font-size: 11px; color: #52525b; line-height: 1.5;">
            Subscribed as: <strong style="color: #ffffff;">${email}</strong><br />
            You are receiving this because you signed up on Dev Shop.<br />
            &copy; ${new Date().getFullYear()} Dev Shop Global Inc. All rights reserved.
          </div>
        </div>
      `,
    }

    const info = await mailer.sendMail(mailOptions)
    console.log(`[EMAIL DISPATCHED] Newsletter welcome email sent to ${email} (Message ID: ${info.messageId})`)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[NEWSLETTER PREVIEW URL] 🔗 Welcome email preview: ${previewUrl}`)
    }
    return { success: true, messageId: info.messageId, previewUrl }
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send newsletter welcome email:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Send Discount & Drop Campaign Email to Multiple Newsletter Subscribers
 */
export const sendNewsletterBroadcastEmail = async ({
  subscribers = [],
  subject,
  title,
  discountPercent = '20%',
  promoCode = 'VAULTDROP20',
  description,
  ctaUrl,
}) => {
  if (!subscribers.length) {
    return { success: false, error: 'No subscribers provided', count: 0 }
  }

  const mailer = await getTransporter()
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"Dev Shop" <${smtpUser}>` : '"Dev Shop" <newsletter@devshop.io>')

  let sent = 0
  let failed = 0
  const errors = []

  const campaignTitle = title || 'EXCLUSIVE FLASH SALE & DISCOUNT'
  const campaignSubject = subject || `🔥 Exclusive Member Drop: ${discountPercent} OFF Everything with code ${promoCode}`
  const campaignDescription = description || `As a valued Dev Shop VIP newsletter subscriber, enjoy an exclusive ${discountPercent} discount across all vault sneakers, streetwear grails, and limited drops!`

  for (const sub of subscribers) {
    const toEmail = typeof sub === 'string' ? sub : sub.email
    if (!toEmail) continue

    try {
      await mailer.sendMail({
        from: fromAddress,
        to: toEmail,
        subject: campaignSubject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #f5f5f5; padding: 36px 20px; border-radius: 16px; max-width: 560px; margin: auto; border: 1px solid #27272a;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">DEV<span style="color: #c81d25;">SHOP</span></span>
              <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">AUTHENTIC DROP VAULT</div>
            </div>

            <div style="background: linear-gradient(135deg, #1c1c22 0%, #121215 100%); padding: 28px 24px; border-radius: 14px; border: 1px solid #3f3f46; text-align: center; margin-bottom: 24px;">
              <span style="background: #c81d25; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 12px;">VIP MEMBER EXCLUSIVE</span>
              <h2 style="font-size: 26px; font-weight: 900; color: #ffffff; margin: 0 0 10px 0; letter-spacing: -0.5px;">${campaignTitle}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0;">${campaignDescription}</p>

              <div style="background: #000000; border: 2px dashed #c81d25; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
                <div style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Use Promo Code at Checkout</div>
                <div style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 4px; margin-top: 4px; font-family: monospace;">${promoCode}</div>
                <div style="font-size: 12px; color: #22c55e; font-weight: 700; margin-top: 4px;">✓ ${discountPercent} OFF YOUR ENTIRE CART</div>
              </div>

              <a href="${ctaUrl || (process.env.FRONTEND_URL || 'http://localhost:5173') + '/products'}" style="display: inline-block; background: #c81d25; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(200, 29, 37, 0.4);">
                SHOP THE SALE NOW &rarr;
              </a>
            </div>

            <div style="text-align: center; font-size: 11px; color: #52525b; line-height: 1.5;">
              You received this email because you are a registered VIP subscriber on Dev Shop.<br />
              &copy; ${new Date().getFullYear()} Dev Shop Global Inc. All rights reserved.
            </div>
          </div>
        `,
      })
      sent++
    } catch (err) {
      failed++
      errors.push({ email: toEmail, error: err.message })
    }
  }

  return { success: true, total: subscribers.length, sent, failed, errors }
}

/**
 * Send Support Ticket Notification to Admin & Confirmation Receipt to Customer
 */
export const sendSupportTicketEmails = async ({
  ticketId,
  name,
  email,
  topic,
  orderNumber,
  message,
}) => {
  if (!email || !message) {
    return { success: false, error: 'Email and message are required' }
  }

  const mailer = await getTransporter()
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"Dev Shop Support" <${smtpUser}>` : '"Dev Shop Support" <support@devshop.io>')
  const adminEmail = process.env.SUPPORT_ADMIN_EMAIL || smtpUser || 'maryamtanveer1330@gmail.com'

  const results = {
    userMailSent: false,
    adminMailSent: false,
    errors: [],
  }

  // 1. Email to Customer (Confirmation & Acknowledgment)
  try {
    await mailer.sendMail({
      from: fromAddress,
      to: email,
      subject: `🎟️ Ticket #${ticketId} Received: We're on it! - Dev Shop Concierge Desk`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #f5f5f5; padding: 36px 20px; border-radius: 16px; max-width: 580px; margin: auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">DEV<span style="color: #c81d25;">SHOP</span></span>
            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">24/7 CONCIERGE DESK</div>
          </div>

          <div style="background: linear-gradient(135deg, #1c1c22 0%, #121215 100%); padding: 28px 24px; border-radius: 14px; border: 1px solid #3f3f46; margin-bottom: 24px;">
            <div style="text-align: center; margin-bottom: 16px;">
              <span style="background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                ✓ INQUIRY RECEIVED & UNDER REVIEW
              </span>
            </div>

            <h2 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 0 0 12px 0; text-align: center; letter-spacing: -0.5px;">
              Hello ${name || 'Valued Client'},
            </h2>
            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; text-align: center;">
              Thank you for contacting Dev Shop Concierge. We have successfully logged your inquiry, and our support team is actively reviewing the details. You can expect a personalized response within <strong style="color: #ffffff;">15 minutes</strong>.
            </p>

            <!-- Ticket Details Card -->
            <div style="background: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f23; padding-bottom: 8px; margin-bottom: 8px;">
                <span style="color: #71717a; font-size: 11px; font-weight: 700; text-transform: uppercase;">Ticket Reference:</span>
                <strong style="color: #c81d25; font-family: monospace; font-size: 14px;">${ticketId}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f23; padding-bottom: 8px; margin-bottom: 8px;">
                <span style="color: #71717a; font-size: 11px; font-weight: 700; text-transform: uppercase;">Topic / Issue:</span>
                <span style="color: #ffffff; font-weight: 600;">${topic || 'General Inquiry'}</span>
              </div>
              ${orderNumber ? `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f23; padding-bottom: 8px; margin-bottom: 8px;">
                <span style="color: #71717a; font-size: 11px; font-weight: 700; text-transform: uppercase;">Order Number:</span>
                <span style="color: #ffffff; font-weight: 600; font-family: monospace;">${orderNumber}</span>
              </div>
              ` : ''}
              <div style="padding-top: 6px;">
                <div style="color: #71717a; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Your Message:</div>
                <div style="background: #18181b; padding: 12px; border-radius: 8px; color: #e4e4e7; line-height: 1.5; font-style: italic; border-left: 3px solid #c81d25;">
                  "${message}"
                </div>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${(process.env.FRONTEND_URL || 'http://localhost:5173') + '/faq'}" style="display: inline-block; background: #c81d25; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Visit Help Center &rarr;
              </a>
            </div>
          </div>

          <div style="text-align: center; font-size: 11px; color: #52525b; line-height: 1.5;">
            This confirmation was automatically generated for your support request.<br />
            &copy; ${new Date().getFullYear()} Dev Shop Global Inc. All rights reserved.
          </div>
        </div>
      `,
    })
    results.userMailSent = true
    console.log(`[EMAIL DISPATCHED] Support acknowledgment sent to customer ${email} for Ticket ${ticketId}`)
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send support acknowledgment to user:', err.message)
    results.errors.push({ type: 'user', error: err.message })
  }

  // 2. Email to Admin / Support Team (New Issue Alert)
  try {
    await mailer.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: email,
      subject: `🚨 [New Support Ticket #${ticketId}] ${topic} from ${name || email}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #f5f5f5; padding: 36px 20px; border-radius: 16px; max-width: 580px; margin: auto; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">DEV<span style="color: #c81d25;">SHOP</span></span>
            <div style="font-size: 10px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">NEW CUSTOMER SUPPORT ALERT</div>
          </div>

          <div style="background: #18181b; padding: 24px; border-radius: 14px; border: 1px solid #3f3f46; margin-bottom: 20px;">
            <div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 16px; border-bottom: 1px solid #27272a; padding-bottom: 10px;">
              Ticket #${ticketId} Details
            </div>

            <table cellpadding="6" cellspacing="0" border="0" width="100%" style="font-size: 13px; color: #d4d4d8;">
              <tr>
                <td width="130" style="color: #a1a1aa; font-weight: 700;">Customer Name:</td>
                <td style="color: #ffffff; font-weight: 700;">${name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="color: #a1a1aa; font-weight: 700;">Customer Email:</td>
                <td><a href="mailto:${email}" style="color: #38bdf8; text-decoration: underline;">${email}</a></td>
              </tr>
              <tr>
                <td style="color: #a1a1aa; font-weight: 700;">Topic / Category:</td>
                <td><span style="background: #27272a; color: #fbbf24; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">${topic || 'General Inquiry'}</span></td>
              </tr>
              ${orderNumber ? `
              <tr>
                <td style="color: #a1a1aa; font-weight: 700;">Order Reference:</td>
                <td style="color: #ffffff; font-family: monospace; font-weight: 700;">${orderNumber}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #a1a1aa; font-weight: 700;">Submitted At:</td>
                <td style="color: #a1a1aa;">${new Date().toLocaleString()}</td>
              </tr>
            </table>

            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #27272a;">
              <div style="color: #a1a1aa; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Customer Inquiry Message:</div>
              <div style="background: #09090b; padding: 14px; border-radius: 8px; color: #ffffff; font-size: 13px; line-height: 1.6; border-left: 3px solid #ef4444; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 22px; text-align: center;">
              <a href="mailto:${email}?subject=Re: Support Ticket ${ticketId} - ${encodeURIComponent(topic || 'Dev Shop Support')}" style="display: inline-block; background: #c81d25; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Reply Directly to Customer &rarr;
              </a>
            </div>
          </div>
        </div>
      `,
    })
    results.adminMailSent = true
    console.log(`[EMAIL DISPATCHED] Support alert sent to admin ${adminEmail} for Ticket ${ticketId}`)
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send support alert to admin:', err.message)
    results.errors.push({ type: 'admin', error: err.message })
  }

  return {
    success: results.userMailSent || results.adminMailSent,
    ...results,
  }
}
