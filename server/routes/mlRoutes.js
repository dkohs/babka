const express = require("express");
const router = express.Router();
const axios = require("axios");

const MODELS = {
  EMOTION: "j-hartmann/emotion-english-distilroberta-base",
  CLASSIFICATION: "facebook/bart-large-mnli",
};

const ANALYSIS_CATEGORIES = {
  MBTI: [
    "Extroversion",
    "Introversion",
    "Sensing",
    "Intuition",
    "Thinking",
    "Feeling",
    "Judging",
    "Perceiving",
  ],
  MENTAL_HEALTH: ["Anxiety", "Depression", "Stress", "Confidence", "Optimism"],
  COMMUNICATION: ["Assertive", "Passive", "Analytical", "Emotional", "Direct"],
  VALUES: [
    "Achievement",
    "Relationships",
    "Health",
    "Security",
    "Growth",
    "Creativity",
  ],
};

const POSITIVE_EMOTIONS = [
  "joy",
  "love",
  "gratitude",
  "hope",
  "pride",
  "satisfaction",
  "happiness",
  "trust",
  "confidence",
];
const NEGATIVE_EMOTIONS = [
  "sadness",
  "anger",
  "fear",
  "guilt",
  "frustration",
  "anxiety",
  "worry",
  "disappointment",
];

function classifySentiment(emotion) {
  const emotionLower = emotion.toLowerCase();
  if (POSITIVE_EMOTIONS.includes(emotionLower)) return "POSITIVE";
  if (NEGATIVE_EMOTIONS.includes(emotionLower)) return "NEGATIVE";
  return "NEUTRAL";
}

async function callModel(modelName, text, options = {}) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${modelName}`,
      { inputs: text, ...options },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Model ${modelName} error:`, error.message);
    return null;
  }
}

async function analyzeEmotion(text) {
  const result = await callModel(MODELS.EMOTION, text);

  if (Array.isArray(result?.[0]) && result[0].length > 0) {
    const top = result[0][0];
    return {
      emotion: top.label,
      confidence: Math.round(top.score * 100),
      sentiment: classifySentiment(top.label),
    };
  }
  return { emotion: "unknown", confidence: 0, sentiment: "NEUTRAL" };
}

async function analyzeCategory(text, category) {
  const result = await callModel(MODELS.CLASSIFICATION, text, {
    parameters: { candidate_labels: ANALYSIS_CATEGORIES[category] },
  });

  if (result?.labels && result?.scores) {
    return result.labels.slice(0, 3).map((label, i) => ({
      label,
      score: Math.round(result.scores[i] * 100),
    }));
  }
  return [];
}

async function comprehensiveAnalysis(text) {
  const [emotion, mbti, mentalHealth, communication, values] =
    await Promise.allSettled([
      analyzeEmotion(text),
      analyzeCategory(text, "MBTI"),
      analyzeCategory(text, "MENTAL_HEALTH"),
      analyzeCategory(text, "COMMUNICATION"),
      analyzeCategory(text, "VALUES"),
    ]);

  return {
    emotion: emotion.status === "fulfilled" ? emotion.value : null,
    personality: mbti.status === "fulfilled" ? mbti.value : null,
    mental_health:
      mentalHealth.status === "fulfilled" ? mentalHealth.value : null,
    communication:
      communication.status === "fulfilled" ? communication.value : null,
    values: values.status === "fulfilled" ? values.value : null,
  };
}

router.post("/infer", async (req, res) => {
  try {
    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: "Sentence is required" });
    }

    const comprehensiveResults = await comprehensiveAnalysis(sentence);

    const segments = sentence.split(/(?<=[.!?])\s+/).filter(Boolean);
    const sentenceAnalysis = [];

    for (const segment of segments) {
      const text = segment.trim().replace(/\s+/g, " ");
      if (!text) continue;

      const analysis = await analyzeEmotion(text);
      if (analysis.emotion !== "unknown") {
        sentenceAnalysis.push({ text, ...analysis });
      }
    }

    res.json({
      message: "Complete analysis finished",
      comprehensive_analysis: comprehensiveResults,
      sentence_analysis: sentenceAnalysis,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { mlRoutes: router };
