// const express = require("express");
// const router = express.Router();
// const axios = require("axios");

// function classifySentiment(emotion) {
//   const positiveEmotions = [
//     "joy",
//     "love",
//     "amusement",
//     "gratitude",
//     "relief",
//     "hope",
//     "pride",
//     "contentment",
//     "satisfaction",
//     "excitement",
//     "happiness",
//     "affection",
//     "enthusiasm",
//     "optimism",
//     "serenity",
//     "admiration",
//     "elation",
//     "inspiration",
//     "trust",
//     "confidence",
//     "delight",
//     "cheerfulness",
//     "fondness",
//     "compassion",
//     "generosity",
//     "calmness",
//     "thankfulness",
//     "playfulness",
//   ];
//   const negativeEmotions = [
//     "sadness",
//     "anger",
//     "fear",
//     "disgust",
//     "guilt",
//     "shame",
//     "frustration",
//     "envy",
//     "resentment",
//     "bitterness",
//     "anxiety",
//     "loneliness",
//     "hate",
//     "despair",
//     "panic",
//     "worry",
//     "jealousy",
//     "annoyance",
//     "irritation",
//     "nervousness",
//     "humiliation",
//     "disappointment",
//     "embarrassment",
//     "grief",
//     "rage",
//     "regret",
//     "dread",
//     "insecurity",
//     "hostility",
//     "rejection",
//     "contempt",
//     "exhaustion",
//   ];

//   const emotionLower = emotion.toLowerCase();

//   if (positiveEmotions.includes(emotionLower)) {
//     return "POSITIVE";
//   } else if (negativeEmotions.includes(emotionLower)) {
//     return "NEGATIVE";
//   } else {
//     return "NEUTRAL";
//   }
// }

// async function detectEmotion(sentence) {
//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
//       { inputs: sentence },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const result = response.data;

//     if (
//       Array.isArray(result) &&
//       result.length > 0 &&
//       Array.isArray(result[0]) &&
//       result[0].length > 0
//     ) {
//       const topResult = result[0][0];
//       const emotion = topResult.label;
//       const confidence = Math.round(topResult.score * 100 * 10) / 10;
//       return { emotion, confidence };
//     }

//     throw new Error("Invalid response format");
//   } catch (error) {
//     console.error("Error detecting emotion:", error.message);
//     return { emotion: "Error", confidence: 0 };
//   }
// }

// function preprocessSentence(sentence) {
//   if (!sentence || typeof sentence !== "string") {
//     return "";
//   }

//   return sentence.trim().replace(/\s+/g, " ");
// }

// function generateAnalysisId() {
//   return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// }

// router.post("/infer", async (req, res) => {
//   try {
//     const { sentence } = req.body;

//     if (!sentence) {
//       return res.status(400).json({ error: "Sentence is required" });
//     }
//     const segments = sentence
//       .split(/(?<=[.!?])\s+| and | but | or |, /i)
//       .filter(Boolean);

//     const results = [];

//     for (let segment of segments) {
//       const processedSegment = preprocessSentence(segment);
//       if (!processedSegment) continue;

//       const { emotion, confidence } = await detectEmotion(processedSegment);
//       if (emotion === "Error") continue;

//       const sentiment = classifySentiment(emotion);

//       results.push({
//         text: segment.trim(),
//         emotion,
//         confidence,
//         sentiment,
//       });
//     }

//     if (results.length === 0) {
//       return res.status(500).json({ error: "No valid segments analyzed" });
//     }

//     res.status(201).json({
//       message: "Emotion analysis completed successfully",
//       original_sentence: sentence,
//       analysis: results,
//       timestamp: new Date().toISOString(),
//       analysis_id: generateAnalysisId(),
//     });

//     res.status(201).json({
//       message: "Emotion analysis completed successfully",
//       analysis: analysisData,
//     });
//   } catch (err) {
//     console.error("Error in emotion analysis:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = { mlRoutes: router };
