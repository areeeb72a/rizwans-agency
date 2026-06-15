export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { messages, system } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: system + '\n\nضروری ہدایت: کبھی بھی ## یا ** یا # یا -- جیسے نشانات استعمال نہ کریں۔ صرف سادہ اردو جملے لکھیں۔ کراچی یا پاکستان کے کسی خاص ہسپتال کا نام نہ لیں — صرف عام مشورہ دیں جیسے: قریبی سرکاری ہسپتال جائیں، صحت کارڈ بنوائیں۔',
        messages
      })
    });
    const data = await response.json();
    let text = data?.content?.[0]?.text || data?.error?.message || 'معذرت، دوبارہ کوشش کریں۔';
    // Clean markdown symbols
    text = text.replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/--+/g, '').replace(/\n{3,}/g, '\n\n').trim();
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ content: [{ text: err.message }] });
  }
}
