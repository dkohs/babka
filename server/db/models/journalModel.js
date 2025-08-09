const { Schema, model } = require("mongoose");

const journalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    entry: {
      type: String,
      required: true,
      trim: true,
    },
    mlAnalysis: {
      emotion: {
        emotion: { type: String },
        confidence: { type: Number },
        sentiment: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] }
      },
      personality: [{
        label: { type: String },
        score: { type: Number }
      }],
      mental_health: [{
        label: { type: String },
        score: { type: Number }
      }],
      communication: [{
        label: { type: String },
        score: { type: Number }
      }],
      values: [{
        label: { type: String },
        score: { type: Number }
      }],
      sentence_analysis: [{
        text: { type: String },
        emotion: { type: String },
        confidence: { type: Number },
        sentiment: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] }
      }],
      analyzed_at: { type: Date, default: Date.now }
    }
  },
  {
    timestamps: true,
  }
);

journalSchema.index({ userId: 1, createdAt: -1 });

journalSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

module.exports = { Journal: model("Journal", journalSchema) };