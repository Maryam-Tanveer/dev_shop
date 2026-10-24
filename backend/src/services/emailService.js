import nodemailer from 'nodemailer'

let transporter = null

/**
 * Initialize email transporter (SMTP or Ethereal test account in development)
 */
const getTransporter = async () => {
  if (transporter) return transporter

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    console.log(`[EMAIL] SMTP Transporter initialized: ${process.env.SMTP_HOST}`)
  } else {
    // Development fallback using Ethereal test credentials
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
