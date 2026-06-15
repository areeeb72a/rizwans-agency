export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { messages, system } = req.body;
    const urduInstruction = `آپ کو اردو میں جواب دینا ہے — بالکل اسی طرح جیسے کراچی کا ایک پڑھا لکھا دوست بات کرتا ہے۔
سادہ اور آسان الفاظ استعمال کریں۔ مشکل یا کتابی اردو بالکل نہ لکھیں۔
جیسے: "آپ یہ کام کر سکتے ہیں"، "یہ بہت آسان ہے"، "پہلے یہ کریں"۔
انگریزی الفاظ جو عام بول چال میں ہیں وہ لکھ سکتے ہیں جیسے mobile, internet, online۔
جواب چھوٹا اور سمجھ میں آنے والا ہو — ٣ سے ٤ جملے کافی ہیں۔\n\n`;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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
