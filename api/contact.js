// Vercel Serverless Function: Secure Telegram Bridge
// This script runs only on Vercel's servers, hiding your keys from the public.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, parse_mode } = req.body;
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[KARIO] Server Error: Missing Environment Variables');
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parse_mode || 'Markdown'
      })
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[KARIO] Bridge Error:', err);
    return res.status(500).json({ error: 'Failed to forward message' });
  }
}
