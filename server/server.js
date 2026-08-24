// Safe, playful LLM-style scoring
function scoreMessage(msg) {
  let score = 0;

  // Creativity: longer messages often have more flair
  if (msg.length > 20) score += 1;
  if (msg.length > 40) score += 1;

  // Dramatic punctuation
  if (/[!?]/.test(msg)) score += 1;

  // Funny / dramatic keywords
  const funnyWords = ["bro", "wow", "no way", "fr", "nah", "dude"];
  const dramaticWords = ["unbelievable", "insane", "wild", "shocking"];

  const lower = msg.toLowerCase();

  funnyWords.forEach(w => {
    if (lower.includes(w)) score += 1;
  });

  dramaticWords.forEach(w => {
    if (lower.includes(w)) score += 1;
  });

  // Energy boost: CAPS
  if (msg === msg.toUpperCase() && msg.length > 5) {
    score += 1;
  }

  // Keep score safe and small
  return Math.min(score, 10);
}
