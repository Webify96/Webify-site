function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml({ name, email, service, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service || 'Not specified');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f2f2f7; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f2f7; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(10,10,14,0.08);">
          <tr>
            <td style="background-color:#0A0A0E; background-image:linear-gradient(135deg,#7C3AED 0%,#A855F7 100%); padding:28px 32px;">
              <span style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:0.02em;">Webify</span>
              <div style="font-size:13px; color:rgba(255,255,255,0.85); margin-top:4px;">New contact form submission</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px; border-bottom:1px solid #eeeef2;">
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#8A8AAA; margin-bottom:4px;">Name</div>
                    <div style="font-size:15px; color:#1C1C2E; font-weight:600;">${safeName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0; border-bottom:1px solid #eeeef2;">
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#8A8AAA; margin-bottom:4px;">Email</div>
                    <div style="font-size:15px;"><a href="mailto:${safeEmail}" style="color:#7C3AED; text-decoration:none; font-weight:600;">${safeEmail}</a></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0; border-bottom:1px solid #eeeef2;">
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#8A8AAA; margin-bottom:4px;">Service</div>
                    <div style="font-size:15px; color:#1C1C2E; font-weight:600;">${safeService}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#8A8AAA; margin-bottom:8px;">Message</div>
                    <div style="font-size:15px; color:#1C1C2E; line-height:1.6; background-color:#f7f7fb; border-left:3px solid #8B5CF6; border-radius:6px; padding:14px 16px;">${safeMessage}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; background-color:#f7f7fb; text-align:center;">
              <span style="font-size:12px; color:#8A8AAA;">Sent from the contact form at webify.joburg</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, service, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Webify Contact Form <no-reply@webify.joburg>',
        to: ['info@webify.joburg'],
        reply_to: email,
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nMessage:\n${message}`,
        html: buildEmailHtml({ name, email, service, message }),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      res.status(502).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
