async function llmScoreMessage(msg) {
  const response = await fetch("https://safe-llm-api.example.com/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({
      prompt: `
You are a friendly scoring assistant for a teen game.
Score the following message from 0 to 10 based on:
- creativity
- humor
- dramatic flair
- exaggeration
- playful energy

Message: "${msg}"

Respond ONLY with a number from 0 to 10.
`
    })
  });

  const data = await response.json();
  const score = parseInt(data.score);

  if (isNaN(score)) return 0;
  return Math.max(0, Math.min(score, 10));
}
