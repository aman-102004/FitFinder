const express = require('express');
const router  = express.Router();
const { optionalAuth } = require('../middleware/auth');
const Tracker = require('../models/Tracker');

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ message: 'Messages array is required.' });

    let personalContext = '';
    if (req.user) {
      try {
        const tracker = await Tracker.findOne({ user: req.user._id });
        if (tracker?.profile) {
          const p = tracker.profile;
          personalContext = `
The user's name is: ${req.user.name}
Their fitness profile:
- Goal: ${p.goal || 'not set'}
- Current weight: ${p.weight ? p.weight + 'kg' : 'not set'}
- Height: ${p.height ? p.height + 'cm' : 'not set'}
- Age: ${p.age || 'not set'}
- Gender: ${p.gender || 'not set'}
- Activity level: ${p.activityLevel || 'moderate'}
- Target weight: ${p.targetWeight ? p.targetWeight + 'kg' : 'not set'}
- Daily calorie goal: ${tracker.goals?.dailyCalories || 'not set'}
- Daily protein goal: ${tracker.goals?.dailyProtein ? tracker.goals.dailyProtein + 'g' : 'not set'}
Use this to give fully personalised advice. Address them by first name sometimes.`;
        }
      } catch (_) {}
    }

    const systemPrompt = `You are FitAI, an expert personal fitness assistant for FitFinder AI — India's smart gym finder for Madhya Pradesh cities.

${personalContext}

Your expertise:
- Personalised workout plans (beginner to advanced)
- Indian diet plans using local foods (dal, roti, paneer, chicken, sabzi, sprouts, chana etc.)
- Gym recommendations in Bhopal, Indore, Jabalpur, Gwalior, Ujjain
- BMI, calorie and macro calculations
- Supplement guidance (whey protein, creatine, vitamins)
- Recovery, sleep, injury prevention advice
- Motivation and mindset coaching

Rules:
- Give specific, actionable advice based on what the user actually asked
- Use Indian food names and local context
- Use emojis to make responses engaging
- Keep responses under 300 words unless user asks for a full plan
- If asked for a full plan, give a complete structured plan
- Tailor everything to the user profile if available
- End with something encouraging`;

    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const apiKey = groqKey || openAiKey;

    if (!apiKey || apiKey.includes('xxx')) {
      return res.json({ reply: `⚠️ API key not set. Add your Groq key in backend/.env` });
    }

    const isGroq = !!groqKey && groqKey.startsWith('gsk_');
    const baseURL = isGroq
      ? 'https://api.groq.com/openai/v1'
      : 'https://api.openai.com/v1';

    // ✅ Updated to latest active Groq models (llama3-8b was decommissioned)
    const model ="openai/gpt-oss-20b";

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        temperature: 0.75,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.role !== 'system').slice(-20)
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({
      reply: `❌ Error: ${err.message}\n\nQuick fixes:\n1. Free option → get a key at console.groq.com\n2. Paid option → add credits at platform.openai.com/billing`
    });
  }
});

module.exports = router;