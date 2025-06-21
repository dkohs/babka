const express = require("express");
const router = express.Router();
const axios = require("axios");

function classifySentiment(emotion) {
  const positiveEmotions = [
    "joy",
    "love",
    "amusement",
    "gratitude",
    "relief",
    "hope",
    "pride",
    "contentment",
    "satisfaction",
    "excitement",
    "happiness",
    "affection",
    "enthusiasm",
    "optimism",
    "serenity",
    "admiration",
    "elation",
    "inspiration",
    "trust",
    "confidence",
    "delight",
    "cheerfulness",
    "fondness",
    "compassion",
    "generosity",
    "calmness",
    "thankfulness",
    "playfulness",
  ];
  const negativeEmotions = [
    "sadness",
    "anger",
    "fear",
    "disgust",
    "guilt",
    "shame",
    "frustration",
    "envy",
    "resentment",
    "bitterness",
    "anxiety",
    "loneliness",
    "hate",
    "despair",
    "panic",
    "worry",
    "jealousy",
    "annoyance",
    "irritation",
    "nervousness",
    "humiliation",
    "disappointment",
    "embarrassment",
    "grief",
    "rage",
    "regret",
    "dread",
    "insecurity",
    "hostility",
    "rejection",
    "contempt",
    "exhaustion",
  ];
  const neutralEmotions = [
    "confusion",
    "anticipation",
    "indifference",
    "interest (neutral)",
    "uncertainty",
    "alertness",
    "acceptance",
    "neutral",
    "expectation",
    "sensory awareness",
    "calculated",
    "observant",
    "passivity",
    "thoughtfulness",
    "reflection",
    "concentration",
    "inquisitiveness",
    "objectivity",
  ];

  const emotionLower = emotion.toLowerCase();

  if (positiveEmotions.includes(emotionLower)) {
    return "POSITIVE";
  } else if (negativeEmotions.includes(emotionLower)) {
    return "NEGATIVE";
  } else if (neutralEmotions.includes(emotionLower)) {
    return "NEUTRAL";
  } else {
    return "UNMEASURABLE";
  }
}

async function detectEmotion(sentence) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: sentence },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    if (Array.isArray(result) && result.length > 0) {
      const topResult = result[0];
      const emotion = topResult.label;
      const confidence = Math.round(topResult.score * 100 * 10) / 10; 
      return { emotion, confidence };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error detecting emotion:", error.message);
    return { emotion: "Error", confidence: 0 };
  }
}

function preprocessSentence(sentence) {
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  return sentence.trim().replace(/\s+/g, " ");
}

function packageAnalysisData(
  originalSentence,
  processedSentence,
  emotion,
  confidence,
  sentiment
) {
  return {
    original_sentence: originalSentence,
    processed_sentence: processedSentence,
    emotion: emotion,
    confidence: confidence,
    sentiment: sentiment,
    timestamp: new Date().toISOString(),
    analysis_id: generateAnalysisId(),
  };
}

function generateAnalysisId() {
  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

router.post("/infer", async (req, res) => {
  try {
    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: "Sentence is required" });
    }

    // Pre-process the sentence
    const processedSentence = preprocessSentence(sentence);

    if (!processedSentence) {
      return res.status(400).json({ error: "Invalid sentence provided" });
    }

    // Detect emotion and confidence
    const { emotion, confidence } = await detectEmotion(processedSentence);

    if (emotion === "Error") {
      return res.status(500).json({ error: "Failed to analyze emotion" });
    }

    // Detect sentiment
    const sentiment = classifySentiment(emotion);

    // Package the data payload
    const analysisData = packageAnalysisData(
      sentence,
      processedSentence,
      emotion,
      confidence,
      sentiment
    );

    // Store the analysis in table (you'll need to implement this based on your database)
    // Example: await saveAnalysisToDatabase(analysisData);

    console.log("Analysis completed:", analysisData);

    res.status(201).json({
      message: "Emotion analysis completed successfully",
      analysis: analysisData,
    });
  } catch (err) {
    console.error("Error in emotion analysis:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { mlRoutes: router };
