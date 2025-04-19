export const analyzeFRMResultText = (text) => {
  const scores = {};
  const topics = [
    "Foundations of Risk Management",
    "Quantitative Analysis",
    "Financial Markets and Products",
    "Valuation and Risk Models",
  ];

  topics.forEach(topic => {
    const regex = new RegExp(`${topic}[\s\S]*?You scored in the\s+(\d{1,3})\s*-\s*(\d{1,3})\s+percentile range`, 'i');
    const match = text.match(regex);

    if (match && match[1] && match[2]) {
      const lowerPercentile = parseInt(match[1], 10);
      const upperPercentile = parseInt(match[2], 10);
      scores[topic] = `${lowerPercentile} - ${upperPercentile}`;
    } else {
      scores[topic] = null;
    }
  });

  return scores;
};
