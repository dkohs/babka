const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Journal } = require("../db/models/journalModel");
const {auth} = require("../middleware/auth");

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
    personality: mbti.status === "fulfilled" ? mbti.value : [],
    mental_health:
      mentalHealth.status === "fulfilled" ? mentalHealth.value : [],
    communication:
      communication.status === "fulfilled" ? communication.value : [],
    values: values.status === "fulfilled" ? values.value : [],
  };
}

router.post("/infer", auth, async (req, res) => {
  try {
    const { sentence } = req.body;
    const userId = req.user.id;

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

    const journalEntry = new Journal({
      userId,
      entry: sentence,
      mlAnalysis: {
        ...comprehensiveResults,
        sentence_analysis: sentenceAnalysis,
        analyzed_at: new Date(),
      },
    });

    await journalEntry.save();

    res.json({
      message: "Complete analysis finished",
      comprehensive_analysis: comprehensiveResults,
      sentence_analysis: sentenceAnalysis,
      timestamp: new Date().toISOString(),
      journal_id: journalEntry._id,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Journal.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        journals,
        pagination: {
          current: parseInt(page),
          total,
          hasNext: skip + journals.length < total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Journal not found" });
    }
    res.json({ success: true, data: journal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Journal not found" });
    }
    res.json({ success: true, message: "Journal deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/analytics/summary", auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const journals = await Journal.find({
      userId: req.user.id,
      createdAt: { $gte: startDate },
    }).select("mlAnalysis");

    const analytics = {
      totalEntries: journals.length,
      emotionDistribution: {},
      sentimentDistribution: { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 },
    };

    journals.forEach((journal) => {
      if (journal.mlAnalysis?.emotion) {
        const { emotion, sentiment } = journal.mlAnalysis.emotion;
        if (emotion)
          analytics.emotionDistribution[emotion] =
            (analytics.emotionDistribution[emotion] || 0) + 1;
        if (sentiment) analytics.sentimentDistribution[sentiment]++;
      }
    });

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = { mlRoutes: router };
