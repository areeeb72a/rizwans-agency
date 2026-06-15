export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { messages, system } = req.body;
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: geminiMessages.length > 0 ? geminiMessages : [{ role: 'user', parts: [{ text: 'السلام علیکم' }] }],
          generationConfig: { maxOutputTokens: 500 }
        })
      }
    );
    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 data?.error?.message || 
                 'معذرت، دوبارہ کوشش کریں۔';
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ content: [{ text: err.message }] });
  }
}
