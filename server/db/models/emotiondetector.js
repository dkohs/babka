async function analyzeSentiment(text) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_HF_TOKEN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const result = await response.json();
  return result;
}

// Example usage:
analyzeSentiment("I love working with UChicago!").then(console.log);
