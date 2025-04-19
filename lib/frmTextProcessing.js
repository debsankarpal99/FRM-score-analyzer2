export const analyzeFRMResultText = (text) => {
  const scores = {};
  const topics = [
    "Foundations of Risk Management",
    "Quantitative Analysis",
    "Financial Markets and Products",
    "Valuation and Risk Models",
  ];

  topics.forEach(topic => {
    const regex = new RegExp(`${topic}[\\s\\S]*?You scored in the (\\d{1,3})(?:st|nd|rd|th) - (\\d{1,3})(?:st|nd|rd|th) percentile range`, 'i');
    const match = text.match(regex);

    if (match && match[1] && match[2]) {
      const lowerPercentile = parseInt(match[1], 10);
      const upperPercentile = parseInt(match[2], 10);
      // Use the midpoint of the percentile range as the score
      scores[topic] = (lowerPercentile + upperPercentile) / 2;
    } else {
      scores[topic] = null; // Score not found for this topic
    }
  });

  return scores;
};
