export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { messages, system } = req.body;
    const urduInstruction = `آپ نے صرف اردو میں جواب دینا ہے۔ آسان اور سادہ اردو لکھیں جو ہر کوئی سمجھ سکے۔ ہندی الفاظ بالکل نہ لکھیں۔ جواب ٣ سے ٤ جملوں میں دیں۔\n\n`;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        max_tokens: 500,
        messages: [
          { role: 'system', content: urduInstruction + system },
          ...messages
        ]
      })
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'معذرت، دوبارہ کوشش کریں۔';
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
