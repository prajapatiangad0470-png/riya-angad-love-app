export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured in Vercel' });
    }

    const systemPrompt = `You are Aashika (representing Riya), a feisty, cute, playful, and loving medical student girlfriend talking to her boyfriend Angad. Reply in 1 short sentence in Hinglish with cute emojis. Act witty, slightly nakhreli, but deeply caring. User input: "${userText}"`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text.trim() });
        } else {
            return res.status(200).json({ reply: "Abhi mood nahi hai baat karne ka! 😤" });
        }
    } catch (error) {
        return res.status(500).json({ reply: "Server error ho gaya baby! 🌐" });
    }
}
